from fastapi import FastAPI
from pydantic import BaseModel, Field
from datetime import date

app = FastAPI(title="Weather Likelihood API", version="0.1.0")

class Thresholds(BaseModel):
    very_hot_Tmax_C: float = 32.0
    very_cold_Tmin_C: float = 0.0
    very_windy_speed_ms: float = 10.0
    very_wet_precip_mmday: float = 20.0
    very_uncomfortable_HI_C: float = 32.0

class ProbabilitiesRequest(BaseModel):
    lat: float = Field(..., ge=-90, le=90)
    lon: float = Field(..., ge=-180, le=180)
    buffer_km: float = Field(25, ge=0, le=200)
    start_date: date
    end_date: date
    date_of_interest: date
    engine: str = Field("logistic", pattern="^(logistic|empirical)$")
    window_days: int = Field(7, ge=0, le=30)
    thresholds: Thresholds = Thresholds()

@app.get("/health")
def health():
    return {"ok": True, "mode": "synthetic"}  # cambia a 'live' cuando integres datos reales

@app.post("/api/probabilities")
def probabilities(req: ProbabilitiesRequest):
    # TODO: integrar pipeline real. Por ahora, respuesta dummy.
    doy = req.date_of_interest.timetuple().tm_yday
    def make_curve():
        return [{"doy": i, "p_raw": 0.1, "p_smooth": 0.1} for i in range(1, 367)]
    curves = {
        "very_hot": make_curve(),
        "very_cold": make_curve(),
        "very_windy": make_curve(),
        "very_wet": make_curve(),
        "very_uncomfortable": make_curve(),
    }
    snapshot = {k: c[doy-1]["p_smooth"] for k, c in curves.items()}
    return {
        "meta": {"lat": req.lat, "lon": req.lon, "period": f"{req.start_date}..{req.end_date}", "engine": req.engine, "source": "placeholder", "mode": "synthetic"},
        "snapshot_date": str(req.date_of_interest),
        "snapshot": snapshot,
        "curves": curves,
        "download": {"csv": None, "json": None},
    }
