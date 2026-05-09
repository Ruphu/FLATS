from app.common.errors import AlreadyExistsError, UnauthorizedError
from app.common.events import publish
from app.common.security.jwt_service import JwtService
from app.common.security.password_hasher import ArgonPasswordHasher
from app.domains.auth.domain.entities import AuthToken, User
from app.domains.auth.domain.repositories import UserRepository


class AuthUseCases:
    def __init__(
        self,
        users: UserRepository,
        password_hasher: ArgonPasswordHasher,
        jwt_service: JwtService,
    ) -> None:
        self._users = users
        self._password_hasher = password_hasher
        self._jwt_service = jwt_service

    def register(self, name: str, email: str, password: str) -> AuthToken:
        if self._users.find_by_email(email):
            raise AlreadyExistsError('User with this email already exists')

        user = self._users.create(
            name=name,
            email=email,
            password_hash=self._password_hasher.hash(password),
        )
        publish(
            'user.registered',
            {'user_id': user.id, 'email': user.email},
        )
        return self._issue_token(user.id)

    def login(self, email: str, password: str) -> AuthToken:
        user = self._users.find_by_email(email)
        if not user:
            raise UnauthorizedError('User not found or invalid credentials')

        if not self._password_hasher.verify(user.password_hash, password):
            raise UnauthorizedError('User not found or invalid credentials')

        return self._issue_token(user.id)

    def validate_user(self, user_id: str) -> User:
        user = self._users.find_by_id(user_id)
        if not user:
            raise UnauthorizedError('User not found')
        return user

    def _issue_token(self, user_id: str) -> AuthToken:
        return AuthToken(access_token=self._jwt_service.create_access_token(user_id))
