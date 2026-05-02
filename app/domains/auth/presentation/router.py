from typing import Annotated

from fastapi import APIRouter, Depends

from app.domains.auth.application.use_cases import AuthUseCases
from app.domains.auth.domain.entities import User
from app.domains.auth.presentation.dependencies import get_auth_use_cases, get_current_user
from app.domains.auth.presentation.schemas import (
    AuthTokenResponse,
    CurrentUserResponse,
    LoginRequest,
    RegisterRequest,
)

router = APIRouter(prefix='/auth', tags=['auth'])


@router.post('/register', response_model=AuthTokenResponse)
def register(
    payload: RegisterRequest,
    auth: Annotated[AuthUseCases, Depends(get_auth_use_cases)],
) -> AuthTokenResponse:
    token = auth.register(payload.name, str(payload.email), payload.password)
    return AuthTokenResponse(accessToken=token.access_token)


@router.post('/login', response_model=AuthTokenResponse)
def login(
    payload: LoginRequest,
    auth: Annotated[AuthUseCases, Depends(get_auth_use_cases)],
) -> AuthTokenResponse:
    token = auth.login(str(payload.email), payload.password)
    return AuthTokenResponse(accessToken=token.access_token)


@router.get('/me', response_model=CurrentUserResponse)
def me(user: Annotated[User, Depends(get_current_user)]) -> CurrentUserResponse:
    return CurrentUserResponse(id=user.id, name=user.name, email=user.email)
