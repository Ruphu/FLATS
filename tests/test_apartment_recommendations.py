from app.domains.apartment.application.use_cases import ApartmentUseCases, CRITERIA
from app.domains.apartment.domain.entities import Apartment
from app.domains.apartment.domain.value_objects import ApartmentType
from app.domains.user.domain.entities import Preference


class InMemoryApartmentRepository:
    def __init__(self, apartments: list[Apartment]) -> None:
        self.apartments = apartments

    def upsert(self, apartment: Apartment) -> Apartment:
        self.apartments.append(apartment)
        return apartment

    def find_by_id(self, apartment_id: str) -> Apartment | None:
        return next(
            (apartment for apartment in self.apartments if apartment.id == apartment_id),
            None,
        )

    def find_all(self) -> list[Apartment]:
        return self.apartments

    def find_by_ids(self, apartment_ids: list[str]) -> list[Apartment]:
        return [
            apartment
            for apartment_id in apartment_ids
            for apartment in self.apartments
            if apartment.id == apartment_id
        ]

    def delete(self, apartment_id: str) -> None:
        self.apartments = [
            apartment for apartment in self.apartments if apartment.id != apartment_id
        ]


def make_apartment(
    apartment_id: str,
    price: int,
    area: float,
    district: str = 'Петроградский',
    minutes_to_metro: int = 7,
) -> Apartment:
    return Apartment(
        id=apartment_id,
        title=f'Квартира {apartment_id}',
        address='Санкт-Петербург, тестовый адрес',
        price=price,
        district=district,
        apartment_type=ApartmentType.secondary,
        area=area,
        rooms_count=2,
        floor=5,
        house_type='Кирпичный',
        minutes_to_metro=minutes_to_metro,
        nearest_metro='Петроградская',
        transport_accessibility=85,
        shops_nearby=True,
        schools_nearby=True,
        parks_nearby=True,
    )


def make_preference() -> Preference:
    return Preference(
        id='preference-1',
        user_id='user-1',
        budget_min=9_000_000,
        budget_max=12_000_000,
        preferred_district='Петроградский',
        apartment_type=ApartmentType.secondary,
        area_min=50,
        area_max=70,
        rooms_count=2,
        has_balcony=False,
        has_loggia=False,
        floor_min=2,
        floor_max=8,
        house_type='Кирпичный',
        minutes_to_metro=10,
    )


def test_topsis_returns_ranked_recommendations() -> None:
    use_cases = ApartmentUseCases(
        InMemoryApartmentRepository(
            [
                make_apartment('best', 10_500_000, 60, minutes_to_metro=5),
                make_apartment('worse', 18_000_000, 35, 'Невский', 35),
            ]
        )
    )

    recommendations = use_cases.recommend_apartments(make_preference())

    assert [item.rank for item in recommendations] == [1, 2]
    assert recommendations[0].apartment.id == 'best'
    assert recommendations[0].score > recommendations[1].score
    assert set(recommendations[0].criteria_scores) == set(CRITERIA)


def test_ahp_matrix_produces_normalized_weights() -> None:
    use_cases = ApartmentUseCases(InMemoryApartmentRepository([]))
    matrix = [[1 if column == row else 1 for column in CRITERIA] for row in CRITERIA]

    weights = use_cases.get_recommendation_weights(pairwise_matrix=matrix)

    assert round(sum(weights.values()), 6) == 1
    assert set(weights) == set(CRITERIA)
