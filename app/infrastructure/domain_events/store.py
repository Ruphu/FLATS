"""Запись доменных событий в БД (аудит, расследование инцидентов, будущие интеграции)."""

from __future__ import annotations

import logging
from collections.abc import Mapping

from app.infrastructure.database.models import DomainEventModel
from app.infrastructure.database.session import SessionLocal

logger = logging.getLogger(__name__)


def append_domain_event(name: str, payload: Mapping[str, object]) -> None:
    session = SessionLocal()
    try:
        session.add(DomainEventModel(name=name, payload=dict(payload)))
        session.commit()
    except Exception:
        session.rollback()
        logger.exception('append_domain_event failed for %s', name)
    finally:
        session.close()
