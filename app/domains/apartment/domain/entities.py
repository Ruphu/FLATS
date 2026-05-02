from dataclasses import dataclass, field
from datetime import datetime

from app.common.errors import ValidationError
from app.domains.apartment.domain.value_objects import (
    HOUSE_TYPES,
    METRO_STATIONS,
    ApartmentType,
)


@dataclass(frozen=True)
class Image:
    url: str
    order: int = 0

    def __post_init__(self) -> None:
        if self.order < 0:
            raise ValidationError('Image order cannot be negative')


@dataclass(frozen=True)
class Apartment:
    id: str
    title: str
    address: str
    price: int
    district: str
    apartment_type: ApartmentType
    area: float
    rooms_count: int
    floor: int
    house_type: str
    minutes_to_metro: int
    nearest_metro: str
    description: str | None = ''
    has_balcony: bool = False
    has_loggia: bool = False
    images: list[Image] = field(default_factory=list)
    created_at: datetime | None = None
    updated_at: datetime | None = None

    def __post_init__(self) -> None:
        if len(self.title) < 3:
            raise ValidationError('The name is too short (min. 3 characters)')
        if self.price < 0:
            raise ValidationError('The price cannot be negative')
        if self.area < 1:
            raise ValidationError('The area must be at least 1 m²')
        if self.rooms_count < 0:
            raise ValidationError('The number of rooms cannot be negative')
        if self.floor < 0:
            raise ValidationError('The floor cannot be negative')
        if self.minutes_to_metro < 0:
            raise ValidationError('Minutes to metro cannot be negative')
        if self.house_type not in HOUSE_TYPES:
            raise ValidationError('Invalid house type')
        if self.nearest_metro not in METRO_STATIONS:
            raise ValidationError('Invalid nearest metro')


@dataclass(frozen=True)
class ApartmentRecommendation:
    apartment: Apartment
    rank: int
    score: float
    distance_to_ideal: float
    distance_to_anti_ideal: float
    criteria_scores: dict[str, float]
