from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.domains.user.application.use_cases import UserUseCases
from app.infrastructure.database.session import get_session
from app.infrastructure.repositories.sqlalchemy_preference_repository import (
    SqlAlchemyPreferenceRepository,
)
from app.infrastructure.repositories.sqlalchemy_apartment_repository import (
    SqlAlchemyApartmentRepository,
)
from app.infrastructure.repositories.sqlalchemy_favorite_apartment_repository import (
    SqlAlchemyFavoriteApartmentRepository,
)
from app.infrastructure.repositories.sqlalchemy_user_repository import (
    SqlAlchemyUserRepository,
)


def get_user_use_cases(
    session: Annotated[Session, Depends(get_session)],
) -> UserUseCases:
    return UserUseCases(
        users=SqlAlchemyUserRepository(session),
        preferences=SqlAlchemyPreferenceRepository(session),
        favorites=SqlAlchemyFavoriteApartmentRepository(session),
        apartments=SqlAlchemyApartmentRepository(session),
    )
