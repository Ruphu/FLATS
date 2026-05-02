from uuid import uuid4

from app.domains.user.domain.entities import Preference
from app.domains.user.presentation.schemas import PreferenceRequest, PreferenceResponse


def preference_from_request(user_id: str, payload: PreferenceRequest) -> Preference:
    return Preference(
        id=str(uuid4()),
        user_id=user_id,
        budget_min=payload.budgetMin,
        budget_max=payload.budgetMax,
        preferred_district=payload.preferredDistrict,
        apartment_type=payload.apartmentType,
        area_min=payload.areaMin,
        area_max=payload.areaMax,
        rooms_count=payload.roomsCount,
        has_balcony=payload.hasBalcony,
        has_loggia=payload.hasLoggia,
        floor_min=payload.floorMin,
        floor_max=payload.floorMax,
        house_type=payload.houseType,
        minutes_to_metro=payload.minutesToMetro,
    )


def preference_to_response(preference: Preference) -> PreferenceResponse:
    return PreferenceResponse(
        id=preference.id,
        userId=preference.user_id,
        budgetMin=preference.budget_min,
        budgetMax=preference.budget_max,
        preferredDistrict=preference.preferred_district,
        apartmentType=preference.apartment_type,
        areaMin=preference.area_min,
        areaMax=preference.area_max,
        roomsCount=preference.rooms_count,
        hasBalcony=preference.has_balcony,
        hasLoggia=preference.has_loggia,
        floorMin=preference.floor_min,
        floorMax=preference.floor_max,
        houseType=preference.house_type,
        minutesToMetro=preference.minutes_to_metro,
    )
