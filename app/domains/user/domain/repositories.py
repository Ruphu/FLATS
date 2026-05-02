from typing import Protocol

from app.domains.user.domain.entities import FavoriteApartment, Preference


class PreferenceRepository(Protocol):
    def find_by_user_id(self, user_id: str) -> Preference | None:
        ...

    def upsert(self, preference: Preference) -> Preference:
        ...

    def delete_by_user_id(self, user_id: str) -> None:
        ...


class FavoriteApartmentRepository(Protocol):
    def add(self, user_id: str, apartment_id: str) -> FavoriteApartment:
        ...

    def find_by_user_id(self, user_id: str) -> list[FavoriteApartment]:
        ...

    def delete(self, user_id: str, apartment_id: str) -> None:
        ...
