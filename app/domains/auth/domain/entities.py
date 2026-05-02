from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class User:
    id: str
    name: str
    email: str
    password_hash: str
    created_at: datetime | None = None
    updated_at: datetime | None = None


@dataclass(frozen=True)
class AuthToken:
    access_token: str
