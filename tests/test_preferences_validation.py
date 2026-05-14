import pytest
from pydantic import ValidationError

from app.domains.apartment.domain.value_objects import ApartmentType
from app.domains.user.presentation.schemas import PreferenceRequest


def make_payload(**overrides):
    payload = {
        'budgetMin': 5_000_000,
        'budgetMax': 9_000_000,
        'preferredDistrict': 'Петроградский',
        'apartmentType': ApartmentType.secondary,
        'areaMin': 40,
        'areaMax': 70,
        'roomsCount': 2,
        'hasBalcony': False,
        'hasLoggia': False,
        'floorMin': 5,
        'floorMax': 9,
        'houseType': 'Кирпичный',
        'minutesToMetro': 10,
        'wantsShopsNearby': True,
        'wantsSchoolsNearby': True,
        'wantsKindergartensNearby': False,
        'wantsParksNearby': True,
    }
    payload.update(overrides)
    return payload


def test_preference_rejects_reversed_floor_range() -> None:
    with pytest.raises(ValidationError) as exc_info:
        PreferenceRequest(**make_payload(floorMin=9, floorMax=5))

    assert 'The minimum floor cannot be more than the maximum' in str(exc_info.value)


def test_preference_rejects_unknown_district() -> None:
    with pytest.raises(ValidationError) as exc_info:
        PreferenceRequest(**make_payload(preferredDistrict='Любой район'))

    assert (
        'Preferred district must be a valid Saint Petersburg district'
        in str(exc_info.value)
    )


def test_preference_accepts_infrastructure_flags() -> None:
    preferences = PreferenceRequest(**make_payload())

    assert preferences.wantsShopsNearby is True
    assert preferences.wantsSchoolsNearby is True
    assert preferences.wantsKindergartensNearby is False
    assert preferences.wantsParksNearby is True
