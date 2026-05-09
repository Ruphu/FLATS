"""Простая in-process шина доменных событий (расширение под обработчики интеграций)."""

from collections.abc import Callable, Mapping

EventHandler = Callable[[Mapping], None]

_subscribers: dict[str, list[EventHandler]] = {}


def subscribe(event_name: str, handler: EventHandler) -> None:
    _subscribers.setdefault(event_name, []).append(handler)


def publish(event_name: str, payload: Mapping) -> None:
    for handler in _subscribers.get(event_name, ()):
        handler(payload)
