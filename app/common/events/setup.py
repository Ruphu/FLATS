import logging
from collections.abc import Mapping

from app.common.events import subscribe
from app.infrastructure.domain_events.store import append_domain_event

logger = logging.getLogger(__name__)

_default_handlers_registered: list[bool] = [False]


def _log_event(name: str, payload: object) -> None:
    shown = dict(payload) if isinstance(payload, Mapping) else payload
    logger.info('domain_event %s %s', name, shown)


def _handle(name: str, payload: object) -> None:
    if isinstance(payload, Mapping):
        append_domain_event(name, payload)
    else:
        append_domain_event(name, {'data': str(payload)})
    _log_event(name, payload)


def register_default_event_handlers() -> None:
    """Один раз за процесс: повторный вызов (reload) не дублирует подписчиков."""
    if _default_handlers_registered[0]:
        return
    subscribe('apartment.upserted', lambda p: _handle('apartment.upserted', p))
    subscribe('user.registered', lambda p: _handle('user.registered', p))
    subscribe('user.preferences_upserted', lambda p: _handle('user.preferences_upserted', p))
    _default_handlers_registered[0] = True
