from typing import Annotated

from fastapi import APIRouter, Depends, Query, Response, status

from app.domains.apartment.application.use_cases import ApartmentUseCases
from app.domains.apartment.application.use_cases import CRITERIA, DEFAULT_WEIGHTS
from app.domains.apartment.presentation.dependencies import (
    get_apartment_use_cases,
    get_preference_repository,
)
from app.domains.apartment.presentation.mappers import (
    apartment_from_request,
    apartment_to_response,
    recommendation_to_response,
)
from app.domains.apartment.presentation.schemas import (
    ApartmentRequest,
    ApartmentResponse,
    RecommendationRequest,
    RecommendationResponse,
    RecommendationCriteriaResponse,
)
from app.domains.auth.domain.entities import User
from app.domains.auth.presentation.dependencies import get_current_user
from app.domains.user.domain.repositories import PreferenceRepository

router = APIRouter(prefix='/apartment', tags=['apartment'])


@router.put('', response_model=ApartmentResponse)
def upsert_apartment(
    payload: ApartmentRequest,
    apartments: Annotated[ApartmentUseCases, Depends(get_apartment_use_cases)],
) -> ApartmentResponse:
    apartment = apartments.upsert_apartment(apartment_from_request(payload))
    return apartment_to_response(apartment)


@router.get('', response_model=list[ApartmentResponse])
def get_all_apartments(
    apartments: Annotated[ApartmentUseCases, Depends(get_apartment_use_cases)],
) -> list[ApartmentResponse]:
    return [apartment_to_response(apartment) for apartment in apartments.get_all_apartments()]


@router.get('/recommendations/criteria', response_model=RecommendationCriteriaResponse)
def get_recommendation_criteria() -> RecommendationCriteriaResponse:
    return RecommendationCriteriaResponse(
        criteria=list(CRITERIA),
        defaultWeights=DEFAULT_WEIGHTS,
    )


@router.post('/recommendations', response_model=list[RecommendationResponse])
def get_recommendations(
    payload: RecommendationRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    apartments: Annotated[ApartmentUseCases, Depends(get_apartment_use_cases)],
    preferences: Annotated[PreferenceRepository, Depends(get_preference_repository)],
) -> list[RecommendationResponse]:
    preference = preferences.find_by_user_id(current_user.id)
    if not preference:
        return []

    weights = apartments.get_recommendation_weights(payload.weights, payload.pairwiseMatrix)
    recommendations = apartments.recommend_apartments(
        preference,
        weights=weights,
        only_matching=payload.onlyMatching,
    )
    return [
        recommendation_to_response(recommendation, weights)
        for recommendation in recommendations
    ]


@router.get('/compare', response_model=list[ApartmentResponse])
def compare_apartments(
    ids: Annotated[list[str], Query()],
    apartments: Annotated[ApartmentUseCases, Depends(get_apartment_use_cases)],
) -> list[ApartmentResponse]:
    return [
        apartment_to_response(apartment)
        for apartment in apartments.compare_apartments(ids)
    ]


@router.get('/{apartment_id}', response_model=ApartmentResponse)
def get_apartment_by_id(
    apartment_id: str,
    apartments: Annotated[ApartmentUseCases, Depends(get_apartment_use_cases)],
) -> ApartmentResponse:
    return apartment_to_response(apartments.get_apartment_by_id(apartment_id))


@router.delete('/{apartment_id}', status_code=status.HTTP_200_OK)
def delete_apartment(
    apartment_id: str,
    apartments: Annotated[ApartmentUseCases, Depends(get_apartment_use_cases)],
) -> Response:
    apartments.delete_apartment(apartment_id)
    return Response(status_code=status.HTTP_200_OK)
