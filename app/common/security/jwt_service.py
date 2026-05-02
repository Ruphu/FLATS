from datetime import datetime, timedelta, timezone
from typing import Any

import jwt

from app.common.errors import UnauthorizedError


class JwtService:
    def __init__(self, secret: str, ttl_seconds: int) -> None:
        self._secret = secret
        self._ttl_seconds = ttl_seconds

    def create_access_token(self, user_id: str) -> str:
        now = datetime.now(timezone.utc)
        payload: dict[str, Any] = {
            'id': user_id,
            'iat': now,
            'exp': now + timedelta(seconds=self._ttl_seconds),
        }
        return jwt.encode(payload, self._secret, algorithm='HS256')

    def decode_access_token(self, token: str) -> dict[str, Any]:
        try:
            payload = jwt.decode(token, self._secret, algorithms=['HS256'])
        except jwt.PyJWTError as exc:
            raise UnauthorizedError('Invalid or expired token') from exc

        if not isinstance(payload.get('id'), str):
            raise UnauthorizedError('Invalid token payload')
        return payload
