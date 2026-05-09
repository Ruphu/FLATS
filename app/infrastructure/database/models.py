from datetime import datetime
from uuid import uuid4

from sqlalchemy import JSON, Boolean, DateTime, Enum, Float, ForeignKey, Index, Integer, String, Text
from sqlalchemy import UniqueConstraint
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.domains.apartment.domain.value_objects import ApartmentType
from app.infrastructure.database.session import Base


def uuid_str() -> str:
    return str(uuid4())


class UserModel(Base):
    __tablename__ = 'users'

    id: Mapped[str] = mapped_column(String, primary_key=True, default=uuid_str)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    password: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    preference: Mapped['PreferenceModel | None'] = relationship(
        back_populates='user',
        cascade='all, delete-orphan',
    )

    __table_args__ = (Index('users_email_idx', 'email'),)


class PreferenceModel(Base):
    __tablename__ = 'preferences'

    id: Mapped[str] = mapped_column(String, primary_key=True, default=uuid_str)
    user_id: Mapped[str] = mapped_column(
        'userId',
        ForeignKey('users.id', ondelete='CASCADE'),
        unique=True,
    )
    budget_min: Mapped[int] = mapped_column('budget_min', Integer)
    budget_max: Mapped[int] = mapped_column('budget_max', Integer)
    preferred_district: Mapped[str] = mapped_column('preferred_district', String(100))
    apartment_type: Mapped[ApartmentType] = mapped_column('apartment_type', Enum(ApartmentType))
    area_min: Mapped[float] = mapped_column('area_min', Float)
    area_max: Mapped[float] = mapped_column('area_max', Float)
    rooms_count: Mapped[int] = mapped_column('rooms_count', Integer)
    has_balcony: Mapped[bool] = mapped_column('has_balcony', Boolean, default=False)
    has_loggia: Mapped[bool] = mapped_column('has_loggia', Boolean, default=False)
    floor_min: Mapped[int] = mapped_column('floor_min', Integer)
    floor_max: Mapped[int] = mapped_column('floor_max', Integer)
    house_type: Mapped[str] = mapped_column('house_type', String)
    minutes_to_metro: Mapped[int] = mapped_column('minutes_to_metro', Integer)
    wants_shops_nearby: Mapped[bool] = mapped_column(
        'wants_shops_nearby',
        Boolean,
        default=False,
    )
    wants_schools_nearby: Mapped[bool] = mapped_column(
        'wants_schools_nearby',
        Boolean,
        default=False,
    )
    wants_kindergartens_nearby: Mapped[bool] = mapped_column(
        'wants_kindergartens_nearby',
        Boolean,
        default=False,
    )
    wants_parks_nearby: Mapped[bool] = mapped_column(
        'wants_parks_nearby',
        Boolean,
        default=False,
    )
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    user: Mapped[UserModel] = relationship(back_populates='preference')

    __table_args__ = (Index('preferences_user_id_idx', 'userId'),)


class ApartmentModel(Base):
    __tablename__ = 'apartments'

    id: Mapped[str] = mapped_column(String, primary_key=True, default=uuid_str)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, default='')
    address: Mapped[str] = mapped_column(String(500), nullable=False)
    price: Mapped[int] = mapped_column(Integer, nullable=False)
    district: Mapped[str] = mapped_column(String(100), nullable=False)
    apartment_type: Mapped[ApartmentType] = mapped_column('apartment_type', Enum(ApartmentType))
    area: Mapped[float] = mapped_column(Float, nullable=False)
    rooms_count: Mapped[int] = mapped_column('rooms_count', Integer, nullable=False)
    has_balcony: Mapped[bool] = mapped_column('has_balcony', Boolean, default=False)
    has_loggia: Mapped[bool] = mapped_column('has_loggia', Boolean, default=False)
    floor: Mapped[int] = mapped_column(Integer, nullable=False)
    house_type: Mapped[str] = mapped_column('house_type', String, nullable=False)
    minutes_to_metro: Mapped[int] = mapped_column('minutes_to_metro', Integer, nullable=False)
    nearest_metro: Mapped[str] = mapped_column('nearest_metro', String, nullable=False)
    condition_score: Mapped[float] = mapped_column('condition_score', Float, default=0.7)
    transport_accessibility: Mapped[int] = mapped_column(
        'transport_accessibility',
        Integer,
        default=70,
    )
    shops_nearby: Mapped[bool] = mapped_column('shops_nearby', Boolean, default=False)
    schools_nearby: Mapped[bool] = mapped_column('schools_nearby', Boolean, default=False)
    kindergartens_nearby: Mapped[bool] = mapped_column(
        'kindergartens_nearby',
        Boolean,
        default=False,
    )
    parks_nearby: Mapped[bool] = mapped_column('parks_nearby', Boolean, default=False)
    latitude: Mapped[float | None] = mapped_column('latitude', Float, nullable=True)
    longitude: Mapped[float | None] = mapped_column('longitude', Float, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    images: Mapped[list['ImageModel']] = relationship(
        back_populates='apartment',
        cascade='all, delete-orphan',
        order_by='ImageModel.order',
    )

    __table_args__ = (
        Index('apartments_price_idx', 'price'),
        Index('apartments_rooms_count_idx', 'rooms_count'),
        Index('apartments_district_idx', 'district'),
    )


class ImageModel(Base):
    __tablename__ = 'images'

    id: Mapped[str] = mapped_column(String, primary_key=True, default=uuid_str)
    url: Mapped[str] = mapped_column(String, nullable=False)
    order: Mapped[int] = mapped_column(Integer, default=0)
    apartment_id: Mapped[str] = mapped_column(
        'apartment_id',
        ForeignKey('apartments.id', ondelete='CASCADE'),
    )
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    apartment: Mapped[ApartmentModel] = relationship(back_populates='images')

    __table_args__ = (
        Index('images_apartment_id_idx', 'apartment_id'),
        Index('images_order_idx', 'order'),
    )


class FavoriteApartmentModel(Base):
    __tablename__ = 'favorite_apartments'

    id: Mapped[str] = mapped_column(String, primary_key=True, default=uuid_str)
    user_id: Mapped[str] = mapped_column(
        'user_id',
        ForeignKey('users.id', ondelete='CASCADE'),
    )
    apartment_id: Mapped[str] = mapped_column(
        'apartment_id',
        ForeignKey('apartments.id', ondelete='CASCADE'),
    )
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user: Mapped[UserModel] = relationship()
    apartment: Mapped[ApartmentModel] = relationship()

    __table_args__ = (
        UniqueConstraint('user_id', 'apartment_id', name='favorite_user_apartment_uc'),
        Index('favorite_apartments_user_id_idx', 'user_id'),
        Index('favorite_apartments_apartment_id_idx', 'apartment_id'),
    )


class DomainEventModel(Base):
    """Аудит доменных событий: регистрации, смена предпочтений, изменения каталога."""

    __tablename__ = 'domain_events'

    id: Mapped[str] = mapped_column(String, primary_key=True, default=uuid_str)
    name: Mapped[str] = mapped_column(String(80), nullable=False, index=True)
    payload: Mapped[dict] = mapped_column(JSON, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    __table_args__ = (Index('domain_events_created_at_idx', 'created_at'),)


def ensure_schema_compatibility(engine: Engine) -> None:
    if engine.dialect.name != 'sqlite':
        return

    table_columns = {
        'apartments': {
            'condition_score': 'FLOAT DEFAULT 0.7',
            'transport_accessibility': 'INTEGER DEFAULT 70',
            'shops_nearby': 'BOOLEAN DEFAULT 0',
            'schools_nearby': 'BOOLEAN DEFAULT 0',
            'kindergartens_nearby': 'BOOLEAN DEFAULT 0',
            'parks_nearby': 'BOOLEAN DEFAULT 0',
            'latitude': 'FLOAT',
            'longitude': 'FLOAT',
        },
        'preferences': {
            'wants_shops_nearby': 'BOOLEAN DEFAULT 0',
            'wants_schools_nearby': 'BOOLEAN DEFAULT 0',
            'wants_kindergartens_nearby': 'BOOLEAN DEFAULT 0',
            'wants_parks_nearby': 'BOOLEAN DEFAULT 0',
        },
    }

    with engine.begin() as connection:
        for table_name, columns_to_add in table_columns.items():
            existing_columns = {
                row[1] for row in connection.exec_driver_sql(f'PRAGMA table_info({table_name})')
            }
            for column_name, column_definition in columns_to_add.items():
                if column_name not in existing_columns:
                    connection.exec_driver_sql(
                        f'ALTER TABLE {table_name} ADD COLUMN {column_name} {column_definition}'
                    )
