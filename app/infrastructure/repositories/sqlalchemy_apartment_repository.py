from sqlalchemy.orm import Session, selectinload

from app.domains.apartment.domain.entities import Apartment, Image
from app.infrastructure.database.models import ApartmentModel, ImageModel


class SqlAlchemyApartmentRepository:
    def __init__(self, session: Session) -> None:
        self._session = session

    def upsert(self, apartment: Apartment) -> Apartment:
        model = self._session.get(ApartmentModel, apartment.id)
        if not model:
            model = ApartmentModel(id=apartment.id)
            self._session.add(model)

        model.title = apartment.title
        model.description = apartment.description
        model.address = apartment.address
        model.price = apartment.price
        model.district = apartment.district
        model.apartment_type = apartment.apartment_type
        model.area = apartment.area
        model.rooms_count = apartment.rooms_count
        model.has_balcony = apartment.has_balcony
        model.has_loggia = apartment.has_loggia
        model.floor = apartment.floor
        model.house_type = apartment.house_type
        model.minutes_to_metro = apartment.minutes_to_metro
        model.nearest_metro = apartment.nearest_metro
        model.condition_score = apartment.condition_score
        model.transport_accessibility = apartment.transport_accessibility
        model.shops_nearby = apartment.shops_nearby
        model.schools_nearby = apartment.schools_nearby
        model.kindergartens_nearby = apartment.kindergartens_nearby
        model.parks_nearby = apartment.parks_nearby
        model.latitude = apartment.latitude
        model.longitude = apartment.longitude
        model.images = [
            ImageModel(url=image.url, order=image.order) for image in apartment.images
        ]

        self._session.commit()
        saved = self.find_by_id(model.id)
        if saved is None:
            raise RuntimeError('Apartment was not persisted')
        return saved

    def find_by_id(self, apartment_id: str) -> Apartment | None:
        model = (
            self._session.query(ApartmentModel)
            .options(selectinload(ApartmentModel.images))
            .filter(ApartmentModel.id == apartment_id)
            .one_or_none()
        )
        return self._to_domain(model) if model else None

    def find_all(self) -> list[Apartment]:
        models = (
            self._session.query(ApartmentModel)
            .options(selectinload(ApartmentModel.images))
            .all()
        )
        return [self._to_domain(model) for model in models]

    def find_by_ids(self, apartment_ids: list[str]) -> list[Apartment]:
        if not apartment_ids:
            return []

        models = (
            self._session.query(ApartmentModel)
            .options(selectinload(ApartmentModel.images))
            .filter(ApartmentModel.id.in_(apartment_ids))
            .all()
        )
        apartments_by_id = {model.id: self._to_domain(model) for model in models}
        return [
            apartments_by_id[apartment_id]
            for apartment_id in apartment_ids
            if apartment_id in apartments_by_id
        ]

    def delete(self, apartment_id: str) -> None:
        model = self._session.get(ApartmentModel, apartment_id)
        if model:
            self._session.delete(model)
            self._session.commit()

    @staticmethod
    def _to_domain(model: ApartmentModel) -> Apartment:
        return Apartment(
            id=model.id,
            title=model.title,
            description=model.description,
            address=model.address,
            price=model.price,
            district=model.district,
            apartment_type=model.apartment_type,
            area=model.area,
            rooms_count=model.rooms_count,
            has_balcony=model.has_balcony,
            has_loggia=model.has_loggia,
            floor=model.floor,
            house_type=model.house_type,
            minutes_to_metro=model.minutes_to_metro,
            nearest_metro=model.nearest_metro,
            condition_score=model.condition_score or 0.7,
            transport_accessibility=model.transport_accessibility or 70,
            shops_nearby=bool(model.shops_nearby),
            schools_nearby=bool(model.schools_nearby),
            kindergartens_nearby=bool(model.kindergartens_nearby),
            parks_nearby=bool(model.parks_nearby),
            latitude=model.latitude,
            longitude=model.longitude,
            images=[Image(url=image.url, order=image.order) for image in model.images],
            created_at=model.created_at,
            updated_at=model.updated_at,
        )
