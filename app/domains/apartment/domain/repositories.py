from typing import Protocol

from app.domains.apartment.domain.entities import Apartment


class ApartmentRepository(Protocol):
    def upsert(self, apartment: Apartment) -> Apartment:
        ...

    def find_by_id(self, apartment_id: str) -> Apartment | None:
        ...

    def find_all(self) -> list[Apartment]:
        ...

    def find_by_ids(self, apartment_ids: list[str]) -> list[Apartment]:
        ...

    def delete(self, apartment_id: str) -> None:
        ...
