import numpy as np, pandas as pd
def generate_synthetic(start: str, end: str, varname: str) -> pd.Series:
    idx = pd.date_range(start, end, freq="D", tz="UTC")
    doy = idx.dayofyear.values
    seasonal = 0.5 + 0.4*np.sin(2*np.pi*(doy/366.0))
    noise = 0.1*np.random.randn(len(idx))
    base = {
        "Tmax_C": 25 + 10*seasonal + 2*noise,
        "Tmin_C": 12 + 6*seasonal  + 2*noise,
        "WS_ms":  4  + 3*seasonal  + 1*noise,
        "P_mmday": np.maximum(0, 5*seasonal + 5*np.random.rand(len(idx))),
        "HI_C":   26 + 9*seasonal  + 2*noise,
    }[varname]
    return pd.Series(base, index=idx, name=varname)
