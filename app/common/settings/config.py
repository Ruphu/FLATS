from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    port: int = Field(default=5000, alias='PORT')
    database_url: str = Field(default='sqlite:///./flats.db', alias='DATABASE_URL')
    jwt_secret: str = Field(default='default_secret', alias='JWT_SECRET')
    jwt_access_token_ttl_seconds: int = Field(
        default=7 * 24 * 60 * 60,
        alias='JWT_ACCESS_TOKEN_TTL_SECONDS',
    )
    cors_origins: str = Field(default='http://localhost:5173', alias='CORS_ORIGINS')

    model_config = SettingsConfigDict(env_file='.env', extra='ignore')

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(',') if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
