from sqlalchemy.orm import Session

from app.domains.auth.domain.entities import User
from app.infrastructure.database.models import UserModel


class SqlAlchemyUserRepository:
    def __init__(self, session: Session) -> None:
        self._session = session

    def find_by_id(self, user_id: str) -> User | None:
        model = self._session.get(UserModel, user_id)
        return self._to_domain(model) if model else None

    def find_by_email(self, email: str) -> User | None:
        model = self._session.query(UserModel).filter(UserModel.email == email).one_or_none()
        return self._to_domain(model) if model else None

    def create(self, name: str, email: str, password_hash: str) -> User:
        model = UserModel(name=name, email=email, password=password_hash)
        self._session.add(model)
        self._session.commit()
        self._session.refresh(model)
        return self._to_domain(model)

    @staticmethod
    def _to_domain(model: UserModel) -> User:
        return User(
            id=model.id,
            name=model.name,
            email=model.email,
            password_hash=model.password,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )
