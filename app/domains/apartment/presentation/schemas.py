from datetime import datetime

from pydantic import BaseModel, Field, field_validator

from app.domains.apartment.domain.value_objects import HOUSE_TYPES, METRO_STATIONS, ApartmentType


class ImageSchema(BaseModel):
    url: str
    order: int = Field(default=0, ge=0)


class ApartmentRequest(BaseModel):
    id: str | None = None
    title: str = Field(min_length=3, max_length=200)
    description: str | None = Field(default='', max_length=5000)
    address: str = Field(min_length=5, max_length=500)
    price: int = Field(ge=0)
    district: str = Field(min_length=2, max_length=100)
    apartmentType: ApartmentType
    area: float = Field(ge=1, le=1000)
    roomsCount: int = Field(ge=0, le=20)
    hasBalcony: bool = False
    hasLoggia: bool = False
    floor: int = Field(ge=0, le=200)
    houseType: str
    minutesToMetro: int = Field(ge=0, le=120)
    nearestMetro: str
    images: list[ImageSchema] = Field(default_factory=list)

    @field_validator('nearestMetro')
    @classmethod
    def validate_nearest_metro(cls, value: str) -> str:
        if value not in METRO_STATIONS:
            raise ValueError('Nearest metro must be a valid station')
        return value

    @field_validator('houseType')
    @classmethod
    def validate_house_type(cls, value: str) -> str:
        if value not in HOUSE_TYPES:
            raise ValueError('Invalid house type')
        return value


class ApartmentResponse(ApartmentRequest):
    id: str
    createdAt: datetime | None = None
    updatedAt: datetime | None = None


class RecommendationRequest(BaseModel):
    weights: dict[str, float] | None = None
    pairwiseMatrix: list[list[float]] | None = None
    onlyMatching: bool = False


class RecommendationResponse(BaseModel):
    rank: int
    score: float
    distanceToIdeal: float
    distanceToAntiIdeal: float
    criteriaScores: dict[str, float]
    weights: dict[str, float]
    apartment: ApartmentResponse


class RecommendationCriteriaResponse(BaseModel):
    criteria: list[str]
    defaultWeights: dict[str, float]
