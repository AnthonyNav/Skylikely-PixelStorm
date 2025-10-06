import pandas as pd
import logging
from .gldas import gldas_daily_series
from .imerg import imerg_daily_series
from ..config.settings import settings

logger = logging.getLogger(__name__)

def build_dataset(lat: float, lon: float, start_iso: str, end_iso: str) -> pd.DataFrame:
    """
    Construye dataset combinando GLDAS + IMERG - solo datos reales de NASA
    """
    
    logger.info("🌍 Fetching real NASA data...")
    

    gldas = gldas_daily_series(lat, lon, start_iso, end_iso)
    logger.info("✅ GLDAS data fetched successfully")
    
    imerg = imerg_daily_series(lat, lon, start_iso, end_iso)
    logger.info("✅ IMERG data fetched successfully")
    
    df = gldas.join(imerg, how="outer").sort_index()
    logger.info(f"📊 Final dataset shape: {df.shape}")
    return df.loc[start_iso[:10]:end_iso[:10]]
