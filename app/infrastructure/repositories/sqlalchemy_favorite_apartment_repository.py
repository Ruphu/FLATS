from sqlalchemy.orm import Session

from app.domains.user.domain.entities import FavoriteApartment
from app.infrastructure.database.models import FavoriteApartmentModel


class SqlAlchemyFavoriteApartmentRepository:
    def __init__(self, session: Session) -> None:
        self._session = session

    def add(self, user_id: str, apartment_id: str) -> FavoriteApartment:
        model = (
            self._session.query(FavoriteApartmentModel)
            .filter(
                FavoriteApartmentModel.user_id == user_id,
                FavoriteApartmentModel.apartment_id == apartment_id,
            )
            .one_or_none()
        )
        if not model:
            model = FavoriteApartmentModel(user_id=user_id, apartment_id=apartment_id)
            self._session.add(model)
            self._session.commit()
            self._session.refresh(model)

        return self._to_domain(model)

    def find_by_user_id(self, user_id: str) -> list[FavoriteApartment]:
        models = (
            self._session.query(FavoriteApartmentModel)
            .filter(FavoriteApartmentModel.user_id == user_id)
            .order_by(FavoriteApartmentModel.created_at.desc())
            .all()
        )
        return [self._to_domain(model) for model in models]

    def delete(self, user_id: str, apartment_id: str) -> None:
        model = (
            self._session.query(FavoriteApartmentModel)
            .filter(
                FavoriteApartmentModel.user_id == user_id,
                FavoriteApartmentModel.apartment_id == apartment_id,
            )
            .one_or_none()
        )
        if model:
            self._session.delete(model)
            self._session.commit()

    @staticmethod
    def _to_domain(model: FavoriteApartmentModel) -> FavoriteApartment:
        return FavoriteApartment(
            id=model.id,
            user_id=model.user_id,
            apartment_id=model.apartment_id,
            created_at=model.created_at,
        )
