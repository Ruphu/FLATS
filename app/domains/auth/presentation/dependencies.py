from typing import Annotated

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.common.security.jwt_service import JwtService
from app.common.security.password_hasher import ArgonPasswordHasher
from app.common.settings.config import Settings, get_settings
from app.domains.auth.application.use_cases import AuthUseCases
from app.domains.auth.domain.entities import User
from app.infrastructure.database.session import get_session
from app.infrastructure.repositories.sqlalchemy_user_repository import (
    SqlAlchemyUserRepository,
)

bearer_scheme = HTTPBearer()


def get_jwt_service(settings: Annotated[Settings, Depends(get_settings)]) -> JwtService:
    return JwtService(settings.jwt_secret, settings.jwt_access_token_ttl_seconds)


def get_auth_use_cases(
    session: Annotated[Session, Depends(get_session)],
    jwt_service: Annotated[JwtService, Depends(get_jwt_service)],
) -> AuthUseCases:
    return AuthUseCases(
        users=SqlAlchemyUserRepository(session),
        password_hasher=ArgonPasswordHasher(),
        jwt_service=jwt_service,
    )


def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(bearer_scheme)],
    jwt_service: Annotated[JwtService, Depends(get_jwt_service)],
    auth: Annotated[AuthUseCases, Depends(get_auth_use_cases)],
) -> User:
    payload = jwt_service.decode_access_token(credentials.credentials)
    return auth.validate_user(payload['id'])
