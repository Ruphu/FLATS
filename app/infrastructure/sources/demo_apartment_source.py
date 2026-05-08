import random

import requests

from app.domains.apartment.domain.entities import Apartment, Image
from app.domains.apartment.domain.value_objects import ApartmentType
from app.infrastructure.repositories.sqlalchemy_apartment_repository import (
    SqlAlchemyApartmentRepository,
)

# ── Конфигурация Яндекс.Геокодера ──────────────────────────────────
YANDEX_API_KEY = "0683fa1e-4d2e-43f8-8be7-0f1709a6bef3"
GEOCODE_URL = "https://geocode-maps.yandex.ru/1.x/"
GEOCODE_CACHE: dict[str, tuple[float, float]] = {}


def _geocode(address: str, district: str) -> tuple[float, float]:
    """Получает координаты через Яндекс.Геокодер с кешированием."""
    if address in GEOCODE_CACHE:
        return GEOCODE_CACHE[address]

    queries = [
        f"Санкт-Петербург, {address}",
        f"Санкт-Петербург, {district} район, {address}",
    ]

    for query in queries:
        try:
            response = requests.get(
                GEOCODE_URL,
                params={
                    "apikey": YANDEX_API_KEY,
                    "geocode": query,
                    "format": "json",
                },
                timeout=5,
            )
            data = response.json()
            geo_objects = data.get("response", {}).get("GeoObjectCollection", {}).get("featureMember", [])
            if geo_objects:
                pos = geo_objects[0]["GeoObject"]["Point"]["pos"]
                lon, lat = pos.split()
                coords = (float(lat), float(lon))
                GEOCODE_CACHE[address] = coords
                print(f"  [geocode] {address} → {coords}")
                return coords
        except Exception:
            continue

    print(f"  [geocode error] {address}: not found")
    fallback = (59.9343, 30.3351)
    GEOCODE_CACHE[address] = fallback
    return fallback


# ── Районы и улицы ─────────────────────────────────────────────────
DISTRICTS = (
    {
        'district': 'Петроградский',
        'metro': 'Петроградская',
        'base_price': 16_200_000,
        'streets': [
            'Большой проспект Петроградской стороны, 15',
            'Каменноостровский проспект, 32',
            'улица Ленина, 10',
            'Малый проспект Петроградской стороны, 25',
            'Чкаловский проспект, 18',
            'улица Большая Пушкарская, 7',
            'улица Мира, 5',
            'Кронверкский проспект, 29',
        ],
    },
    {
        'district': 'Московский',
        'metro': 'Московская',
        'base_price': 12_400_000,
        'streets': [
            'Московский проспект, 145',
            'улица Типанова, 12',
            'проспект Космонавтов, 30',
            'Пулковская улица, 8',
            'улица Ленсовета, 22',
            'проспект Гагарина, 17',
            'улица Фрунзе, 40',
            'улица Победы, 5, Московский район',
        ],
    },
    {
        'district': 'Приморский',
        'metro': 'Комендантский проспект',
        'base_price': 11_200_000,
        'streets': [
            'Комендантский проспект, 20',
            'проспект Королёва, 15',
            'улица Уточкина, 6',
            'проспект Авиаконструкторов, 28',
            'улица Шаврова, 12',
            'Богатырский проспект, 35',
            'улица Оптиков, 18',
            'Туристская улица, 10',
        ],
    },
    {
        'district': 'Василеостровский',
        'metro': 'Василеостровская',
        'base_price': 14_800_000,
        'streets': [
            'Большой проспект В.О., 40',
            'Средний проспект В.О., 25',
            '6-я линия В.О., 15',
            'улица Кораблестроителей, 30к1',
            'набережная Макарова, 12',
            'Малый проспект В.О., 18',
            'улица Нахимова, 8',
            'Новосмоленская набережная, 4',
        ],
    },
    {
        'district': 'Невский',
        'metro': 'Проспект Большевиков',
        'base_price': 9_600_000,
        'streets': [
            'проспект Большевиков, 25',
            'улица Дыбенко, 15',
            'Искровский проспект, 20',
            'улица Тельмана, 30, Невский район',
            'Российский проспект, 12, Невский район',
            'улица Коллонтай, 18',
            'улица Подвойского, 10',
            'Товарищеский проспект, 8',
        ],
    },
    {
        'district': 'Калининский',
        'metro': 'Академическая',
        'base_price': 10_500_000,
        'streets': [
            'Гражданский проспект, 60',
            'проспект Науки, 20',
            'улица Бутлерова, 12',
            'улица Верности, 8',
            'Северный проспект, 30',
            'улица Демьяна Бедного, 15',
            'Светлановский проспект, 25',
            'улица Карпинского, 10',
        ],
    },
    {
        'district': 'Адмиралтейский',
        'metro': 'Адмиралтейская',
        'base_price': 17_500_000,
        'streets': [
            'набережная реки Фонтанки, 50',
            'Измайловский проспект, 10',
            'Московский проспект, 5',
            'улица Гороховая, 20',
            'улица Садовая, 30',
            'Вознесенский проспект, 15',
            'Рижский проспект, 8',
            'Лермонтовский проспект, 12',
        ],
    },
    {
        'district': 'Фрунзенский',
        'metro': 'Международная',
        'base_price': 9_900_000,
        'streets': [
            'улица Белы Куна, 10',
            'Бухарестская улица, 35',
            'Софийская улица, 20',
            'улица Турку, 15',
            'проспект Славы, 25',
            'Малая Балканская улица, 8',
            'Дунайский проспект, 40',
            'улица Ярослава Гашека, 12',
        ],
    },
)

LAYOUTS = (
    {'rooms': 0, 'area': 31.5, 'area_step': 1.1, 'price_factor': 0.62, 'label': 'Студия'},
    {'rooms': 1, 'area': 39.0, 'area_step': 1.6, 'price_factor': 0.78, 'label': '1-комн. квартира'},
    {'rooms': 2, 'area': 57.0, 'area_step': 2.0, 'price_factor': 1.0, 'label': '2-комн. квартира'},
    {'rooms': 3, 'area': 78.0, 'area_step': 2.7, 'price_factor': 1.32, 'label': '3-комн. квартира'},
    {'rooms': 4, 'area': 102.0, 'area_step': 3.1, 'price_factor': 1.68, 'label': '4-комн. квартира'},
)

HOUSE_TYPES = ('Кирпичный', 'Панельный', 'Монолитный')

# ── Категории фото ─────────────────────────────────────────────────
IMAGE_CATEGORIES = {
    'elite': {
        'min_price': 16_000_000,
        'min_condition': 0.80,
        'photos': (
            '/public/images/elite-1.jpg',
            '/public/images/elite-2.jpg',
        ),
    },
    'good': {
        'min_price': 12_000_000,
        'min_condition': 0.70,
        'photos': (
            '/public/images/good-1.jpg',
            '/public/images/good-2.jpg',
        ),
    },
    'average': {
        'min_price': 9_000_000,
        'min_condition': 0.60,
        'photos': (
            '/public/images/average-1.jpg',
            '/public/images/average-2.jpg',
        ),
    },
    'budget': {
        'min_price': 0,
        'min_condition': 0.0,
        'photos': (
            '/public/images/budget-1.jpg',
            '/public/images/budget-2.jpg',
        ),
    },
}

# ── Шаблоны описаний ────────────────────────────────────────────────
DESCRIPTION_TEMPLATES = {
    'elite': [
        'Просторная квартира с дизайнерским ремонтом. Панорамные окна, '
        'премиальная отделка, встроенная техника. Закрытый двор с охраной.',
        'Элитная квартира в историческом центре. Высокие потолки, '
        'качественный паркет, консьерж. Вид на набережную.',
        'Квартира после капитального ремонта с использованием материалов '
        'премиум-класса. Просторная гардеробная, две ванные комнаты, '
        'тёплые полы по всей площади.',
    ],
    'good': [
        'Светлая квартира с качественным ремонтом. Окна во двор, '
        'застеклённый балкон. В шаговой доступности школы и магазины.',
        'Уютная квартира в тихом районе. Современная кухня, '
        'новая сантехника. Ухоженный двор с детской площадкой.',
        'Квартира в отличном состоянии. Просторная кухня-гостиная, '
        'изолированные комнаты. Хорошая транспортная доступность.',
    ],
    'average': [
        'Квартира с обычным ремонтом. Чистый подъезд, '
        'застеклённый балкон. В пешей доступности метро и ТЦ.',
        'Типовая квартира в спальном районе. Требует косметического '
        'обновления. Кухня и санузел раздельные.',
        'Квартира в жилом доме советской постройки. Просторный коридор, '
        'встроенный шкаф. Окна выходят на южную сторону.',
    ],
    'budget': [
        'Квартира с минимальным ремонтом. Требует вложений, '
        'но потенциал отличный. Тихий зелёный двор.',
        'Бюджетный вариант в хорошем районе. Старая отделка, '
        'работающий стояк. Отличный вариант под собственный ремонт.',
        'Квартира в старом фонде. Просторные комнаты, '
        'высокие потолки. Требуется капитальный ремонт.',
    ],
}

BALCONY_PHRASES = [
    'Просторный застеклённый балкон.',
    'Балкон с панорамным остеклением.',
    'Уютный балкон с видом во двор.',
    'Большой балкон на солнечной стороне.',
]

LOGGIA_PHRASES = [
    'Застеклённая лоджия с утеплением.',
    'Лоджия, переоборудованная под кабинет.',
    'Просторная лоджия с кладовой зоной.',
]

PARK_PHRASES = [
    'Рядом парк — идеально для прогулок и пробежек.',
    'В пяти минутах зелёная зона с прудом.',
    'Близость парковой зоны — свежий воздух круглый год.',
]

METRO_PHRASES = {
    'close': 'Метро в двух шагах от дома.',
    'medium': 'До метро комфортная прогулка пешком.',
    'far': 'До метро курсирует общественный транспорт.',
}


# ── Вспомогательные функции ─────────────────────────────────────────
def _pick_photos(price: int, condition_score: float) -> tuple[str, str]:
    for category in IMAGE_CATEGORIES.values():
        if price >= category['min_price'] and condition_score >= category['min_condition']:
            return category['photos']
    return IMAGE_CATEGORIES['budget']['photos']


def _get_category(price: int, condition_score: float) -> str:
    if price >= 16_000_000 and condition_score >= 0.80:
        return 'elite'
    elif price >= 12_000_000 and condition_score >= 0.70:
        return 'good'
    elif price >= 9_000_000 and condition_score >= 0.60:
        return 'average'
    else:
        return 'budget'


def _build_description(
    category: str,
    index: int,
    has_balcony: bool,
    has_loggia: bool,
    parks_nearby: bool,
    minutes_to_metro: int,
) -> str:
    templates = DESCRIPTION_TEMPLATES[category]
    base = templates[index % len(templates)]

    extras: list[str] = []
    if has_balcony:
        extras.append(random.choice(BALCONY_PHRASES))
    if has_loggia:
        extras.append(random.choice(LOGGIA_PHRASES))
    if parks_nearby:
        extras.append(random.choice(PARK_PHRASES))

    if minutes_to_metro <= 7:
        extras.append(METRO_PHRASES['close'])
    elif minutes_to_metro <= 15:
        extras.append(METRO_PHRASES['medium'])
    else:
        extras.append(METRO_PHRASES['far'])

    if extras:
        base += ' ' + ' '.join(extras)

    return base


def _build_title(rooms: int, district: str, apartment_type: ApartmentType) -> str:
    room_label = 'Студия' if rooms == 0 else f'{rooms}-комн. квартира'
    type_label = 'новостройка' if apartment_type == ApartmentType.new_building else 'вторичка'
    return f'{room_label}, {district}, {type_label}'


# ── Главная функция генерации ──────────────────────────────────────
def build_demo_apartments() -> list[Apartment]:
    apartments: list[Apartment] = []
    index = 0

    for district_data in DISTRICTS:
        for street_index, street in enumerate(district_data['streets']):
            for layout in LAYOUTS:
                rooms = layout['rooms']
                area = round(layout['area'] + (street_index % 3) * layout['area_step'], 1)
                price = int(
                    district_data['base_price']
                    * layout['price_factor']
                    * (1 + (street_index % 3) * 0.04)
                )
                house_type = HOUSE_TYPES[(street_index + layout['rooms']) % len(HOUSE_TYPES)]
                apartment_type = (
                    ApartmentType.new_building
                    if (index % 3 == 0)
                    else ApartmentType.secondary
                )

                minutes_to_metro = 4 + ((street_index * 3 + layout['rooms'] * 5) % 24)
                floor = 2 + ((street_index * 5 + layout['rooms'] * 3) % 22)
                condition_score = round(0.50 + ((index % 12) * 0.04), 2)
                transport_accessibility = max(40, 100 - minutes_to_metro * 2 - (street_index % 10))

                has_balcony = (index % 2 == 0)
                has_loggia = (index % 4 == 0)
                parks_nearby = (index % 5 in (0, 1, 3))

                photo_1, photo_2 = _pick_photos(price, condition_score)
                category = _get_category(price, condition_score)
                coords = _geocode(street, district_data['district'])
                description = _build_description(
                    category=category,
                    index=index,
                    has_balcony=has_balcony,
                    has_loggia=has_loggia,
                    parks_nearby=parks_nearby,
                    minutes_to_metro=minutes_to_metro,
                )

                apartment = Apartment(
                    id=f'demo-apartment-{index + 1:03d}',
                    title=_build_title(rooms, district_data['district'], apartment_type),
                    description=description,
                    address=f"Санкт-Петербург, {street}",
                    price=price,
                    district=district_data['district'],
                    apartment_type=apartment_type,
                    area=area,
                    rooms_count=rooms,
                    has_balcony=has_balcony,
                    has_loggia=has_loggia,
                    floor=floor,
                    house_type=house_type,
                    minutes_to_metro=minutes_to_metro,
                    nearest_metro=district_data['metro'],
                    condition_score=min(condition_score, 0.98),
                    transport_accessibility=transport_accessibility,
                    shops_nearby=(index % 2 != 1),
                    schools_nearby=(index % 3 != 1),
                    kindergartens_nearby=(index % 4 != 2),
                    parks_nearby=parks_nearby,
                    latitude=coords[0],
                    longitude=coords[1],
                    images=[
                        Image(url=photo_1, order=0),
                        Image(url=photo_2, order=1),
                    ],
                )

                apartments.append(apartment)
                index += 1

    return apartments


def seed_demo_apartments(repository: SqlAlchemyApartmentRepository) -> int:
    print(f"\n[seed] Generating {8 * 8 * 5} demo apartments...")
    print("[seed] Geocoding addresses via Yandex API...\n")
    created_or_updated = 0
    for apartment in build_demo_apartments():
        repository.upsert(apartment)
        created_or_updated += 1
    print(f"\n[seed] Done! {created_or_updated} apartments seeded.\n")
    return created_or_updated