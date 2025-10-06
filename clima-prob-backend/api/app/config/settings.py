from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path

# Ruta robusta al .env dentro de api/
ENV_FILE = Path(__file__).resolve().parents[2] / ".env"  # .../api/.env


class Settings(BaseSettings):
    EARTHDATA_USERNAME: str | None = None
    EARTHDATA_PASSWORD: str | None = None

    GIOVANNI_SIGNIN_URL: str = "https://api.giovanni.earthdata.nasa.gov/signin"
    GIOVANNI_TS_URL: str = "https://api.giovanni.earthdata.nasa.gov/timeseries"

    OFFLINE_MODE: bool = False
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )

settings = Settings()
