from typing import Annotated

from fastapi import APIRouter, Depends, Response, status

from app.domains.auth.domain.entities import User
from app.domains.auth.presentation.dependencies import get_current_user
from app.domains.apartment.presentation.mappers import apartment_to_response
from app.domains.apartment.presentation.schemas import ApartmentResponse
from app.domains.user.application.use_cases import UserUseCases
from app.domains.user.presentation.dependencies import get_user_use_cases
from app.domains.user.presentation.mappers import (
    preference_from_request,
    preference_to_response,
)
from app.domains.user.presentation.schemas import PreferenceRequest, PreferenceResponse

router = APIRouter(prefix='/user', tags=['user'])


@router.put('/preferences', response_model=PreferenceResponse)
def upsert_preferences(
    payload: PreferenceRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    users: Annotated[UserUseCases, Depends(get_user_use_cases)],
) -> PreferenceResponse:
    preference = users.upsert_preferences(
        current_user.id,
        preference_from_request(current_user.id, payload),
    )
    return preference_to_response(preference)


@router.get('/preferences', response_model=PreferenceResponse)
def get_preferences(
    current_user: Annotated[User, Depends(get_current_user)],
    users: Annotated[UserUseCases, Depends(get_user_use_cases)],
) -> PreferenceResponse:
    return preference_to_response(users.get_preferences(current_user.id))


@router.delete('/preferences', status_code=status.HTTP_200_OK)
def delete_preferences(
    current_user: Annotated[User, Depends(get_current_user)],
    users: Annotated[UserUseCases, Depends(get_user_use_cases)],
) -> Response:
    users.delete_preferences(current_user.id)
    return Response(status_code=status.HTTP_200_OK)


@router.post(
    '/favorites/{apartment_id}',
    response_model=list[ApartmentResponse],
    status_code=status.HTTP_201_CREATED,
)
def add_favorite_apartment(
    apartment_id: str,
    current_user: Annotated[User, Depends(get_current_user)],
    users: Annotated[UserUseCases, Depends(get_user_use_cases)],
) -> list[ApartmentResponse]:
    users.add_favorite_apartment(current_user.id, apartment_id)
    return [
        apartment_to_response(apartment)
        for apartment in users.get_favorite_apartments(current_user.id)
    ]


@router.get('/favorites', response_model=list[ApartmentResponse])
def get_favorite_apartments(
    current_user: Annotated[User, Depends(get_current_user)],
    users: Annotated[UserUseCases, Depends(get_user_use_cases)],
) -> list[ApartmentResponse]:
    return [
        apartment_to_response(apartment)
        for apartment in users.get_favorite_apartments(current_user.id)
    ]


@router.delete('/favorites/{apartment_id}', status_code=status.HTTP_200_OK)
def delete_favorite_apartment(
    apartment_id: str,
    current_user: Annotated[User, Depends(get_current_user)],
    users: Annotated[UserUseCases, Depends(get_user_use_cases)],
) -> Response:
    users.delete_favorite_apartment(current_user.id, apartment_id)
    return Response(status_code=status.HTTP_200_OK)
