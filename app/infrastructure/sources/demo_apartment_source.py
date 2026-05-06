from app.domains.apartment.domain.entities import Apartment, Image
from app.domains.apartment.domain.value_objects import ApartmentType
from app.infrastructure.repositories.sqlalchemy_apartment_repository import (
    SqlAlchemyApartmentRepository,
)


DISTRICTS = (
    {
        'district': 'Петроградский',
        'metro': 'Петроградская',
        'lat': 59.9663,
        'lon': 30.3119,
        'base_price': 16_200_000,
    },
    {
        'district': 'Московский',
        'metro': 'Московская',
        'lat': 59.8518,
        'lon': 30.3216,
        'base_price': 12_400_000,
    },
    {
        'district': 'Приморский',
        'metro': 'Комендантский проспект',
        'lat': 60.0086,
        'lon': 30.2595,
        'base_price': 11_200_000,
    },
    {
        'district': 'Василеостровский',
        'metro': 'Василеостровская',
        'lat': 59.9425,
        'lon': 30.2782,
        'base_price': 14_800_000,
    },
    {
        'district': 'Невский',
        'metro': 'Проспект Большевиков',
        'lat': 59.9198,
        'lon': 30.4669,
        'base_price': 9_600_000,
    },
    {
        'district': 'Калининский',
        'metro': 'Академическая',
        'lat': 60.0129,
        'lon': 30.3954,
        'base_price': 10_500_000,
    },
    {
        'district': 'Адмиралтейский',
        'metro': 'Адмиралтейская',
        'lat': 59.9342,
        'lon': 30.3158,
        'base_price': 17_500_000,
    },
    {
        'district': 'Фрунзенский',
        'metro': 'Международная',
        'lat': 59.8705,
        'lon': 30.3794,
        'base_price': 9_900_000,
    },
)

LAYOUTS = (
    {'rooms': 0, 'area': 31.5, 'area_step': 1.1, 'price_factor': 0.62},
    {'rooms': 1, 'area': 39.0, 'area_step': 1.6, 'price_factor': 0.78},
    {'rooms': 2, 'area': 57.0, 'area_step': 2.0, 'price_factor': 1.0},
    {'rooms': 3, 'area': 78.0, 'area_step': 2.7, 'price_factor': 1.32},
    {'rooms': 4, 'area': 102.0, 'area_step': 3.1, 'price_factor': 1.68},
)

HOUSE_TYPES = ('Кирпичный', 'Панельный', 'Монолитный')
IMAGE_URLS = (
    '/public/images/apartment-1.jpg',
    '/public/images/apartment-2.jpg',
)


def build_demo_apartments() -> list[Apartment]:
    apartments: list[Apartment] = []

    for district_index, district in enumerate(DISTRICTS):
        for layout_index, layout in enumerate(LAYOUTS):
            index = (district_index * len(LAYOUTS)) + layout_index
            rooms = layout['rooms']
            area = round(layout['area'] + (district_index % 3) * layout['area_step'], 1)
            price = int(
                district['base_price']
                * layout['price_factor']
                * (1 + (layout_index % 2) * 0.06)
            )
            house_type = HOUSE_TYPES[(district_index + layout_index) % len(HOUSE_TYPES)]
            apartment_type = (
                ApartmentType.new_building
                if (district_index + layout_index) % 3 == 0
                else ApartmentType.secondary
            )
            minutes_to_metro = 4 + ((district_index * 3 + layout_index * 4) % 24)
            floor = 2 + ((district_index * 5 + layout_index * 3) % 22)
            condition_score = round(0.58 + ((index % 8) * 0.05), 2)
            transport_accessibility = max(45, 96 - minutes_to_metro * 2)

            apartments.append(
                Apartment(
                    id=f'demo-apartment-{index + 1:02d}',
                    title=_build_title(rooms, district['district'], apartment_type),
                    description=(
                        'Демо-объявление для проверки подбора квартир методом TOPSIS. '
                        'В данных специально различаются цена, район, инфраструктура, '
                        'транспортная доступность, состояние и параметры квартиры.'
                    ),
                    address=f"Санкт-Петербург, {district['district']} район, дом {index + 12}",
                    price=price,
                    district=district['district'],
                    apartment_type=apartment_type,
                    area=area,
                    rooms_count=rooms,
                    has_balcony=(index % 2 == 0),
                    has_loggia=(index % 4 == 0),
                    floor=floor,
                    house_type=house_type,
                    minutes_to_metro=minutes_to_metro,
                    nearest_metro=district['metro'],
                    condition_score=min(condition_score, 0.98),
                    transport_accessibility=transport_accessibility,
                    shops_nearby=(index % 2 != 1),
                    schools_nearby=(index % 3 != 1),
                    kindergartens_nearby=(index % 4 != 2),
                    parks_nearby=(index % 5 in (0, 1, 3)),
                    latitude=round(district['lat'] + (layout_index - 2) * 0.004, 6),
                    longitude=round(district['lon'] + (layout_index - 2) * 0.006, 6),
                    images=[
                        Image(url=IMAGE_URLS[index % len(IMAGE_URLS)], order=0),
                        Image(url=IMAGE_URLS[(index + 2) % len(IMAGE_URLS)], order=1),
                    ],
                )
            )

    return apartments


def seed_demo_apartments(repository: SqlAlchemyApartmentRepository) -> int:
    created_or_updated = 0
    for apartment in build_demo_apartments():
        repository.upsert(apartment)
        created_or_updated += 1
    return created_or_updated


def _build_title(
    rooms_count: int,
    district: str,
    apartment_type: ApartmentType,
) -> str:
    room_label = 'Студия' if rooms_count == 0 else f'{rooms_count}-комн. квартира'
    type_label = 'новостройка' if apartment_type == ApartmentType.new_building else 'вторичка'
    return f'{room_label}, {district}, {type_label}'
