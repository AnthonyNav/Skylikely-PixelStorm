# api/Dockerfile
FROM python:3.11-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

# Paquetes del sistema: certificados, netCDF/HDF5 (para netCDF4/xarray), y build basics
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates curl \
    gcc g++ \
    libhdf5-dev libnetcdf-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Instala dependencias primero (mejor caché)
COPY requirements.txt .
RUN pip install -r requirements.txt

# Runtime image (más limpia)
FROM python:3.11-slim AS runtime
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8080

# Solo runtime libs necesarios
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates curl \
    libhdf5-103-1 libnetcdf19 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiamos paquetes ya instalados desde la capa base
COPY --from=base /usr/local/lib/python3.11 /usr/local/lib/python3.11
COPY --from=base /usr/local/bin /usr/local/bin

# Copiamos el código
COPY app ./app
COPY gunicorn_conf.py .
# (opcional) Si tienes archivos como pyproject.toml o versionado, cópialos aquí

# Seguridad: usuario no-root
RUN useradd -m appuser
USER appuser

EXPOSE 8080
CMD ["gunicorn", "app.main:app", "-c", "gunicorn_conf.py"]
