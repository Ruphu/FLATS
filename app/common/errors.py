class DomainError(Exception):
    message = 'Domain error'

    def __init__(self, message: str | None = None) -> None:
        super().__init__(message or self.message)
        self.message = message or self.message


class AlreadyExistsError(DomainError):
    pass


class NotFoundError(DomainError):
    pass


class UnauthorizedError(DomainError):
    pass


class ValidationError(DomainError):
    pass
