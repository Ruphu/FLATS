from uuid import uuid4

from app.domains.apartment.domain.entities import Apartment, ApartmentRecommendation, Image
from app.domains.apartment.presentation.schemas import (
    ApartmentRequest,
    ApartmentResponse,
    ImageSchema,
    RecommendationResponse,
)


def apartment_from_request(payload: ApartmentRequest) -> Apartment:
    return Apartment(
        id=payload.id or str(uuid4()),
        title=payload.title,
        description=payload.description,
        address=payload.address,
        price=payload.price,
        district=payload.district,
        apartment_type=payload.apartmentType,
        area=payload.area,
        rooms_count=payload.roomsCount,
        has_balcony=payload.hasBalcony,
        has_loggia=payload.hasLoggia,
        floor=payload.floor,
        house_type=payload.houseType,
        minutes_to_metro=payload.minutesToMetro,
        nearest_metro=payload.nearestMetro,
        condition_score=payload.conditionScore,
        transport_accessibility=payload.transportAccessibility,
        shops_nearby=payload.shopsNearby,
        schools_nearby=payload.schoolsNearby,
        kindergartens_nearby=payload.kindergartensNearby,
        parks_nearby=payload.parksNearby,
        latitude=payload.latitude,
        longitude=payload.longitude,
        images=[
            Image(url=image.url, order=image.order if image.order is not None else index)
            for index, image in enumerate(payload.images)
        ],
    )


def apartment_to_response(apartment: Apartment) -> ApartmentResponse:
    return ApartmentResponse(
        id=apartment.id,
        title=apartment.title,
        description=apartment.description,
        address=apartment.address,
        price=apartment.price,
        district=apartment.district,
        apartmentType=apartment.apartment_type,
        area=apartment.area,
        roomsCount=apartment.rooms_count,
        hasBalcony=apartment.has_balcony,
        hasLoggia=apartment.has_loggia,
        floor=apartment.floor,
        houseType=apartment.house_type,
        minutesToMetro=apartment.minutes_to_metro,
        nearestMetro=apartment.nearest_metro,
        conditionScore=apartment.condition_score,
        transportAccessibility=apartment.transport_accessibility,
        shopsNearby=apartment.shops_nearby,
        schoolsNearby=apartment.schools_nearby,
        kindergartensNearby=apartment.kindergartens_nearby,
        parksNearby=apartment.parks_nearby,
        latitude=apartment.latitude,
        longitude=apartment.longitude,
        images=[ImageSchema(url=image.url, order=image.order) for image in apartment.images],
        createdAt=apartment.created_at,
        updatedAt=apartment.updated_at,
    )


def recommendation_to_response(
    recommendation: ApartmentRecommendation,
    weights: dict[str, float],
) -> RecommendationResponse:
    return RecommendationResponse(
        rank=recommendation.rank,
        score=recommendation.score,
        distanceToIdeal=recommendation.distance_to_ideal,
        distanceToAntiIdeal=recommendation.distance_to_anti_ideal,
        criteriaScores=recommendation.criteria_scores,
        weights=weights,
        apartment=apartment_to_response(recommendation.apartment),
    )
