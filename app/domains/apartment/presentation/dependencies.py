from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.domains.apartment.application.use_cases import ApartmentUseCases
from app.infrastructure.database.session import get_session
from app.infrastructure.repositories.sqlalchemy_apartment_repository import (
    SqlAlchemyApartmentRepository,
)
from app.infrastructure.repositories.sqlalchemy_preference_repository import (
    SqlAlchemyPreferenceRepository,
)


def get_apartment_use_cases(
    session: Annotated[Session, Depends(get_session)],
) -> ApartmentUseCases:
    return ApartmentUseCases(apartments=SqlAlchemyApartmentRepository(session))


def get_preference_repository(
    session: Annotated[Session, Depends(get_session)],
) -> SqlAlchemyPreferenceRepository:
    return SqlAlchemyPreferenceRepository(session)
