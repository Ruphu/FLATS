from uuid import uuid4

from app.common.errors import NotFoundError
from app.domains.apartment.domain.entities import Apartment
from app.domains.apartment.domain.repositories import ApartmentRepository
from app.domains.auth.domain.repositories import UserRepository
from app.domains.user.domain.entities import FavoriteApartment, Preference
from app.domains.user.domain.repositories import (
    FavoriteApartmentRepository,
    PreferenceRepository,
)


class UserUseCases:
    def __init__(
        self,
        users: UserRepository,
        preferences: PreferenceRepository,
        favorites: FavoriteApartmentRepository | None = None,
        apartments: ApartmentRepository | None = None,
    ) -> None:
        self._users = users
        self._preferences = preferences
        self._favorites = favorites
        self._apartments = apartments

    def upsert_preferences(self, user_id: str, preference: Preference) -> Preference:
        if not self._users.find_by_id(user_id):
            raise NotFoundError('User not found')

        existing = self._preferences.find_by_user_id(user_id)
        preference_to_save = Preference(
            id=existing.id if existing else str(uuid4()),
            user_id=user_id,
            budget_min=preference.budget_min,
            budget_max=preference.budget_max,
            preferred_district=preference.preferred_district,
            apartment_type=preference.apartment_type,
            area_min=preference.area_min,
            area_max=preference.area_max,
            rooms_count=preference.rooms_count,
            has_balcony=preference.has_balcony,
            has_loggia=preference.has_loggia,
            floor_min=preference.floor_min,
            floor_max=preference.floor_max,
            house_type=preference.house_type,
            minutes_to_metro=preference.minutes_to_metro,
        )
        return self._preferences.upsert(preference_to_save)

    def get_preferences(self, user_id: str) -> Preference:
        preference = self._preferences.find_by_user_id(user_id)
        if not preference:
            raise NotFoundError('Preferences not found')
        return preference

    def delete_preferences(self, user_id: str) -> None:
        self.get_preferences(user_id)
        self._preferences.delete_by_user_id(user_id)

    def add_favorite_apartment(
        self,
        user_id: str,
        apartment_id: str,
    ) -> FavoriteApartment:
        self._require_favorite_dependencies()
        if not self._apartments.find_by_id(apartment_id):
            raise NotFoundError('Apartment not found')
        return self._favorites.add(user_id, apartment_id)

    def get_favorite_apartments(self, user_id: str) -> list[Apartment]:
        self._require_favorite_dependencies()
        favorites = self._favorites.find_by_user_id(user_id)
        return self._apartments.find_by_ids(
            [favorite.apartment_id for favorite in favorites]
        )

    def delete_favorite_apartment(self, user_id: str, apartment_id: str) -> None:
        self._require_favorite_dependencies()
        self._favorites.delete(user_id, apartment_id)

    def _require_favorite_dependencies(self) -> None:
        if self._favorites is None or self._apartments is None:
            raise RuntimeError('Favorite dependencies are not configured')
