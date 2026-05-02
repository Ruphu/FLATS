from typing import Protocol

from app.domains.auth.domain.entities import User


class UserRepository(Protocol):
    def find_by_id(self, user_id: str) -> User | None:
        ...

    def find_by_email(self, email: str) -> User | None:
        ...

    def create(self, name: str, email: str, password_hash: str) -> User:
        ...
