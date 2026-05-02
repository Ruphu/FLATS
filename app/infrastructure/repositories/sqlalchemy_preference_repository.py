from sqlalchemy.orm import Session

from app.domains.user.domain.entities import Preference
from app.infrastructure.database.models import PreferenceModel


class SqlAlchemyPreferenceRepository:
    def __init__(self, session: Session) -> None:
        self._session = session

    def find_by_user_id(self, user_id: str) -> Preference | None:
        model = (
            self._session.query(PreferenceModel)
            .filter(PreferenceModel.user_id == user_id)
            .one_or_none()
        )
        return self._to_domain(model) if model else None

    def upsert(self, preference: Preference) -> Preference:
        model = (
            self._session.query(PreferenceModel)
            .filter(PreferenceModel.user_id == preference.user_id)
            .one_or_none()
        )
        if not model:
            model = PreferenceModel(id=preference.id, user_id=preference.user_id)
            self._session.add(model)

        model.budget_min = preference.budget_min
        model.budget_max = preference.budget_max
        model.preferred_district = preference.preferred_district
        model.apartment_type = preference.apartment_type
        model.area_min = preference.area_min
        model.area_max = preference.area_max
        model.rooms_count = preference.rooms_count
        model.has_balcony = preference.has_balcony
        model.has_loggia = preference.has_loggia
        model.floor_min = preference.floor_min
        model.floor_max = preference.floor_max
        model.house_type = preference.house_type
        model.minutes_to_metro = preference.minutes_to_metro

        self._session.commit()
        self._session.refresh(model)
        return self._to_domain(model)

    def delete_by_user_id(self, user_id: str) -> None:
        model = (
            self._session.query(PreferenceModel)
            .filter(PreferenceModel.user_id == user_id)
            .one_or_none()
        )
        if model:
            self._session.delete(model)
            self._session.commit()

    @staticmethod
    def _to_domain(model: PreferenceModel) -> Preference:
        return Preference(
            id=model.id,
            user_id=model.user_id,
            budget_min=model.budget_min,
            budget_max=model.budget_max,
            preferred_district=model.preferred_district,
            apartment_type=model.apartment_type,
            area_min=model.area_min,
            area_max=model.area_max,
            rooms_count=model.rooms_count,
            has_balcony=model.has_balcony,
            has_loggia=model.has_loggia,
            floor_min=model.floor_min,
            floor_max=model.floor_max,
            house_type=model.house_type,
            minutes_to_metro=model.minutes_to_metro,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )
