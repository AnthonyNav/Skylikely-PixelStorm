import numpy as np
import pandas as pd

def generate_synthetic(start: str, end: str, varname: str) -> pd.Series:
    """Generate synthetic daily data for the given variable."""
    idx = pd.date_range(start, end, freq="D", tz="UTC")
    doy = idx.dayofyear.values
    seasonal = 0.5 + 0.4 * np.sin(2 * np.pi * (doy / 366.0))  # simple yearly seasonality
    noise = 0.1 * np.random.randn(len(idx))                    # random variability

    base = {
        "Tmax_C": 25 + 10 * seasonal + 2 * noise,   # max temperature (°C)
        "Tmin_C": 12 +  6 * seasonal + 2 * noise,   # min temperature (°C)
        "WS_ms":   4 +  3 * seasonal + 1 * noise,   # wind speed (m/s)
        "P_mmday": np.maximum(0, 5 * seasonal + 5 * np.random.rand(len(idx))),  # precipitation (mm/day)
        "HI_C":   26 +  9 * seasonal + 2 * noise,   # heat index (°C)
    }[varname]

    return pd.Series(base, index=idx, name=varname)


def get_daily_series(lat: float, lon: float, buffer_km: float,
                     start: str, end: str, varname: str) -> pd.Series:
    return generate_synthetic(start, end, varname)
