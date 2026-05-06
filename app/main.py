from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from app.common.errors import (
    AlreadyExistsError,
    DomainError,
    NotFoundError,
    UnauthorizedError,
    ValidationError,
)
from app.common.settings.config import get_settings
from app.domains.apartment.presentation.router import router as apartment_router
from app.domains.auth.presentation.router import router as auth_router
from app.domains.user.presentation.router import router as user_router
from app.infrastructure.database import models
from app.infrastructure.database.session import Base, SessionLocal, engine
from app.infrastructure.repositories.sqlalchemy_apartment_repository import (
    SqlAlchemyApartmentRepository,
)
from app.infrastructure.sources.demo_apartment_source import seed_demo_apartments

settings = get_settings()

app = FastAPI(title='FLATS API')

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.mount('/public', StaticFiles(directory='public', check_dir=False), name='public')


@app.on_event('startup')
def create_tables() -> None:
    Base.metadata.create_all(bind=engine)
    models.ensure_schema_compatibility(engine)
    session = SessionLocal()
    try:
        seed_demo_apartments(SqlAlchemyApartmentRepository(session))
    finally:
        session.close()


@app.exception_handler(DomainError)
def handle_domain_error(_: Request, exc: DomainError) -> JSONResponse:
    if isinstance(exc, AlreadyExistsError):
        code = status.HTTP_409_CONFLICT
    elif isinstance(exc, UnauthorizedError):
        code = status.HTTP_401_UNAUTHORIZED
    elif isinstance(exc, NotFoundError):
        code = status.HTTP_404_NOT_FOUND
    elif isinstance(exc, ValidationError):
        code = status.HTTP_422_UNPROCESSABLE_ENTITY
    else:
        code = status.HTTP_400_BAD_REQUEST
    return JSONResponse(
        status_code=code,
        content={'detail': exc.message, 'message': exc.message},
    )


@app.get('/health')
def health() -> dict[str, str]:
    return {'status': 'ok'}


app.include_router(auth_router)
app.include_router(user_router)
app.include_router(apartment_router)
