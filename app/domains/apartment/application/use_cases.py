from uuid import uuid4

from app.common.errors import NotFoundError, ValidationError
from app.domains.apartment.domain.entities import Apartment, ApartmentRecommendation
from app.domains.apartment.domain.repositories import ApartmentRepository
from app.domains.apartment.domain.value_objects import ApartmentType
from app.domains.user.domain.entities import Preference


def build_fallback_preference(user_id: str) -> Preference:
    """Широкий профиль, если пользователь ещё не сохранил предпочтения — TOPSIS всё равно ранжирует каталог."""
    return Preference(
        id=str(uuid4()),
        user_id=user_id,
        budget_min=0,
        budget_max=999_999_999,
        preferred_district='',
        apartment_type=ApartmentType.secondary,
        area_min=1.0,
        area_max=10_000.0,
        rooms_count=2,
        has_balcony=False,
        has_loggia=False,
        floor_min=0,
        floor_max=200,
        house_type='',
        minutes_to_metro=120,
    )


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
        only_matching: bool = False,
    ) -> list[ApartmentRecommendation]:
        apartments = self.get_all_apartments()
        if only_matching:
            apartments = [
                apartment
                for apartment in apartments
                if self._matches_required_profile(apartment, preference)
            ]

        return self._rank_by_topsis(
            apartments,
            preference,
            self._resolve_weights(weights, None),
        )

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
            'transport': self._transport_score(apartment, preference),
            'infrastructure': self._infrastructure_score(apartment, preference),
            'condition': apartment.condition_score,
            'house_type': self._match(apartment.house_type, preference.house_type),
            'floor': self._closeness(apartment.floor, target_floor),
            'balcony_loggia': (balcony_matches + loggia_matches) / 2,
        }

    def _matches_required_profile(
        self,
        apartment: Apartment,
        preference: Preference,
    ) -> bool:
        house_ok = (
            not preference.house_type.strip()
            or apartment.house_type == preference.house_type
        )
        return (
            preference.budget_min <= apartment.price <= preference.budget_max
            and preference.area_min <= apartment.area <= preference.area_max
            and apartment.rooms_count == preference.rooms_count
            and apartment.apartment_type == preference.apartment_type
            and preference.floor_min <= apartment.floor <= preference.floor_max
            and house_ok
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
            criterion: float(source.get(criterion, 0.0))
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
        if not target.strip():
            return 1.0
        return 1.0 if value.strip().lower() == target.strip().lower() else 0.0

    @staticmethod
    def _infrastructure_score(apartment: Apartment, preference: Preference) -> float:
        desired_pairs = (
            (preference.wants_shops_nearby, apartment.shops_nearby),
            (preference.wants_schools_nearby, apartment.schools_nearby),
            (preference.wants_kindergartens_nearby, apartment.kindergartens_nearby),
            (preference.wants_parks_nearby, apartment.parks_nearby),
        )
        required = [available for desired, available in desired_pairs if desired]
        if required:
            base_score = sum(1 for available in required if available) / len(required)
        else:
            base_score = sum(1 for _, available in desired_pairs if available) / len(desired_pairs)
        metro_bonus = 0.2 if apartment.minutes_to_metro <= 10 else 0
        return min(base_score + metro_bonus, 1.0)

    @staticmethod
    def _transport_score(apartment: Apartment, preference: Preference) -> float:
        metro_score = 1.0 if apartment.minutes_to_metro <= preference.minutes_to_metro else (
            preference.minutes_to_metro / apartment.minutes_to_metro
            if apartment.minutes_to_metro
            else 1.0
        )
        accessibility_score = apartment.transport_accessibility / 100
        return min((metro_score * 0.7) + (accessibility_score * 0.3), 1.0)

    @staticmethod
    def _euclidean_distance(
        left: dict[str, float],
        right: dict[str, float],
    ) -> float:
        return sum((left[criterion] - right[criterion]) ** 2 for criterion in CRITERIA) ** 0.5
