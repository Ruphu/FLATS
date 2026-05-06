from dataclasses import dataclass
from datetime import datetime

from app.domains.apartment.domain.value_objects import ApartmentType


@dataclass(frozen=True)
class Preference:
    id: str
    user_id: str
    budget_min: int
    budget_max: int
    preferred_district: str
    apartment_type: ApartmentType
    area_min: float
    area_max: float
    rooms_count: int
    has_balcony: bool
    has_loggia: bool
    floor_min: int
    floor_max: int
    house_type: str
    minutes_to_metro: int
    wants_shops_nearby: bool = False
    wants_schools_nearby: bool = False
    wants_kindergartens_nearby: bool = False
    wants_parks_nearby: bool = False
    created_at: datetime | None = None
    updated_at: datetime | None = None


@dataclass(frozen=True)
class FavoriteApartment:
    id: str
    user_id: str
    apartment_id: str
    created_at: datetime | None = None
