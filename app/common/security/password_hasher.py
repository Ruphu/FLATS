from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError, VerificationError


class ArgonPasswordHasher:
    def __init__(self) -> None:
        self._hasher = PasswordHasher()

    def hash(self, password: str) -> str:
        return self._hasher.hash(password)

    def verify(self, hashed_password: str, plain_password: str) -> bool:
        try:
            return self._hasher.verify(hashed_password, plain_password)
        except (VerifyMismatchError, VerificationError):
            return False
