from app.infrastructure.database import models as _orm_models  # noqa: F401 — регистрация таблиц
from app.infrastructure.database.models import DomainEventModel
from app.infrastructure.database.session import Base, SessionLocal, engine
from app.infrastructure.domain_events.store import append_domain_event


def test_domain_event_is_persisted_to_database() -> None:
    Base.metadata.create_all(bind=engine)
    append_domain_event('pytest.probe', {'source': 'test'})
    session = SessionLocal()
    try:
        row = (
            session.query(DomainEventModel)
            .filter(DomainEventModel.name == 'pytest.probe')
            .order_by(DomainEventModel.created_at.desc())
            .first()
        )
        assert row is not None
        assert row.payload['source'] == 'test'
        session.delete(row)
        session.commit()
    finally:
        session.close()
