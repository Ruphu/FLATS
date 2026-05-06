from pydantic import BaseModel, Field, model_validator

from app.domains.apartment.domain.value_objects import ApartmentType


class PreferenceRequest(BaseModel):
    budgetMin: int
    budgetMax: int
    preferredDistrict: str = Field(max_length=100)
    apartmentType: ApartmentType
    areaMin: float
    areaMax: float
    roomsCount: int = Field(le=10)
    hasBalcony: bool
    hasLoggia: bool
    floorMin: int = Field(ge=1)
    floorMax: int = Field(ge=1)
    houseType: str
    minutesToMetro: int = Field(ge=0, le=120)
    wantsShopsNearby: bool = False
    wantsSchoolsNearby: bool = False
    wantsKindergartensNearby: bool = False
    wantsParksNearby: bool = False

    @model_validator(mode='after')
    def validate_ranges(self) -> 'PreferenceRequest':
        if self.budgetMin > self.budgetMax:
            raise ValueError('The minimum budget cannot be more than the maximum')
        if self.areaMin > self.areaMax:
            raise ValueError('The minimum area cannot be more than the maximum')
        if self.floorMin > self.floorMax:
            raise ValueError('The minimum floor cannot be more than the maximum')
        return self


class PreferenceResponse(PreferenceRequest):
    id: str
    userId: str
