from app.common.errors import NotFoundError, ValidationError
from app.domains.apartment.domain.entities import Apartment, ApartmentRecommendation
from app.domains.apartment.domain.repositories import ApartmentRepository
from app.domains.user.domain.entities import Preference


CRITERIA = (
    'price',
    'area',
    'rooms',
    'district',
    'transport',
    'infrastructure',
    'condition',
    'house_type',
    'floor',
    'balcony_loggia',
)

DEFAULT_WEIGHTS = {
    'price': 0.18,
    'area': 0.12,
    'rooms': 0.1,
    'district': 0.12,
    'transport': 0.12,
    'infrastructure': 0.1,
    'condition': 0.08,
    'house_type': 0.07,
    'floor': 0.06,
    'balcony_loggia': 0.05,
}


class ApartmentUseCases:
    def __init__(self, apartments: ApartmentRepository) -> None:
        self._apartments = apartments

    def upsert_apartment(self, apartment: Apartment) -> Apartment:
        return self._apartments.upsert(apartment)

    def get_all_apartments(self) -> list[Apartment]:
        return self._apartments.find_all()

    def compare_apartments(self, apartment_ids: list[str]) -> list[Apartment]:
        return self._apartments.find_by_ids(apartment_ids)

    def get_apartment_by_id(self, apartment_id: str) -> Apartment:
        apartment = self._apartments.find_by_id(apartment_id)
        if not apartment:
            raise NotFoundError('Apartment not found')
        return apartment

    def delete_apartment(self, apartment_id: str) -> None:
        self.get_apartment_by_id(apartment_id)
        self._apartments.delete(apartment_id)

    def recommend_apartments(
        self,
        preference: Preference,
        weights: dict[str, float] | None = None,
        pairwise_matrix: list[list[float]] | None = None,
        only_matching: bool = False,
    ) -> list[ApartmentRecommendation]:
        apartments = self.get_all_apartments()
        if only_matching:
            apartments = [
                apartment
                for apartment in apartments
                if self._matches_required_profile(apartment, preference)
            ]

        effective_weights = self._resolve_weights(weights, pairwise_matrix)
        return self._rank_by_topsis(apartments, preference, effective_weights)

    def get_recommendation_weights(
        self,
        weights: dict[str, float] | None = None,
        pairwise_matrix: list[list[float]] | None = None,
    ) -> dict[str, float]:
        return self._resolve_weights(weights, pairwise_matrix)

    def _rank_by_topsis(
        self,
        apartments: list[Apartment],
        preference: Preference,
        weights: dict[str, float],
    ) -> list[ApartmentRecommendation]:
        if not apartments:
            return []

        raw_scores = [
            self._score_criteria(apartment, preference) for apartment in apartments
        ]
        columns = {
            criterion: [row[criterion] for row in raw_scores] for criterion in CRITERIA
        }
        denominators = {
            criterion: sum(value**2 for value in values) ** 0.5 or 1.0
            for criterion, values in columns.items()
        }
        weighted_rows = [
            {
                criterion: row[criterion] / denominators[criterion] * weights[criterion]
                for criterion in CRITERIA
            }
            for row in raw_scores
        ]
        ideal = {
            criterion: max(row[criterion] for row in weighted_rows)
            for criterion in CRITERIA
        }
        anti_ideal = {
            criterion: min(row[criterion] for row in weighted_rows)
            for criterion in CRITERIA
        }

        recommendations = []
        for apartment, weighted_row, raw_row in zip(apartments, weighted_rows, raw_scores):
            distance_to_ideal = self._euclidean_distance(weighted_row, ideal)
            distance_to_anti_ideal = self._euclidean_distance(weighted_row, anti_ideal)
            denominator = distance_to_ideal + distance_to_anti_ideal
            score = distance_to_anti_ideal / denominator if denominator else 1.0
            recommendations.append(
                ApartmentRecommendation(
                    apartment=apartment,
                    rank=0,
                    score=round(score, 6),
                    distance_to_ideal=round(distance_to_ideal, 6),
                    distance_to_anti_ideal=round(distance_to_anti_ideal, 6),
                    criteria_scores={
                        criterion: round(value, 6) for criterion, value in raw_row.items()
                    },
                )
            )

        recommendations.sort(key=lambda recommendation: recommendation.score, reverse=True)
        return [
            ApartmentRecommendation(
                apartment=recommendation.apartment,
                rank=index,
                score=recommendation.score,
                distance_to_ideal=recommendation.distance_to_ideal,
                distance_to_anti_ideal=recommendation.distance_to_anti_ideal,
                criteria_scores=recommendation.criteria_scores,
            )
            for index, recommendation in enumerate(recommendations, start=1)
        ]

    def _score_criteria(
        self,
        apartment: Apartment,
        preference: Preference,
    ) -> dict[str, float]:
        target_price = (preference.budget_min + preference.budget_max) / 2
        target_area = (preference.area_min + preference.area_max) / 2
        target_floor = (preference.floor_min + preference.floor_max) / 2
        balcony_matches = int(not preference.has_balcony or apartment.has_balcony)
        loggia_matches = int(not preference.has_loggia or apartment.has_loggia)

        return {
            'price': self._closeness(apartment.price, target_price),
            'area': self._closeness(apartment.area, target_area),
            'rooms': self._closeness(apartment.rooms_count, preference.rooms_count),
            'district': self._match(apartment.district, preference.preferred_district),
            'transport': self._closeness(
                apartment.minutes_to_metro,
                preference.minutes_to_metro,
            ),
            'infrastructure': self._infrastructure_score(apartment),
            'condition': 0.7,
            'house_type': self._match(apartment.house_type, preference.house_type),
            'floor': self._closeness(apartment.floor, target_floor),
            'balcony_loggia': (balcony_matches + loggia_matches) / 2,
        }

    def _matches_required_profile(
        self,
        apartment: Apartment,
        preference: Preference,
    ) -> bool:
        return (
            preference.budget_min <= apartment.price <= preference.budget_max
            and preference.area_min <= apartment.area <= preference.area_max
            and apartment.rooms_count == preference.rooms_count
            and apartment.apartment_type == preference.apartment_type
            and preference.floor_min <= apartment.floor <= preference.floor_max
            and apartment.house_type == preference.house_type
            and apartment.minutes_to_metro <= preference.minutes_to_metro
            and (not preference.has_balcony or apartment.has_balcony)
            and (not preference.has_loggia or apartment.has_loggia)
        )

    def _resolve_weights(
        self,
        weights: dict[str, float] | None,
        pairwise_matrix: list[list[float]] | None,
    ) -> dict[str, float]:
        if pairwise_matrix:
            return self._weights_from_ahp(pairwise_matrix)

        source = weights or DEFAULT_WEIGHTS
        cleaned = {
            criterion: max(float(source.get(criterion, 0)), 0.0)
            for criterion in CRITERIA
        }
        total = sum(cleaned.values()) or 1.0
        return {criterion: value / total for criterion, value in cleaned.items()}

    def _weights_from_ahp(self, matrix: list[list[float]]) -> dict[str, float]:
        if len(matrix) != len(CRITERIA) or any(len(row) != len(CRITERIA) for row in matrix):
            raise ValidationError(f'AHP matrix must be {len(CRITERIA)}x{len(CRITERIA)}')

        geometric_means = []
        for row in matrix:
            product = 1.0
            for value in row:
                product *= max(float(value), 0.000001)
            geometric_means.append(product ** (1 / len(row)))

        total = sum(geometric_means) or 1.0
        return {
            criterion: geometric_means[index] / total
            for index, criterion in enumerate(CRITERIA)
        }

    @staticmethod
    def _closeness(value: float, target: float) -> float:
        if target <= 0:
            return 1.0 if value <= 0 else 0.0
        return 1 / (1 + abs(value - target) / target)

    @staticmethod
    def _match(value: str, target: str) -> float:
        return 1.0 if value.strip().lower() == target.strip().lower() else 0.0

    @staticmethod
    def _infrastructure_score(apartment: Apartment) -> float:
        if apartment.minutes_to_metro <= 5:
            return 1.0
        if apartment.minutes_to_metro <= 15:
            return 0.75
        if apartment.minutes_to_metro <= 30:
            return 0.45
        return 0.2

    @staticmethod
    def _euclidean_distance(
        left: dict[str, float],
        right: dict[str, float],
    ) -> float:
        return sum((left[criterion] - right[criterion]) ** 2 for criterion in CRITERIA) ** 0.5
