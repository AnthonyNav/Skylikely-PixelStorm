import requests
from requests.auth import HTTPBasicAuth
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
import time
import logging
from ..config.settings import settings

logger = logging.getLogger(__name__)

def giovanni_token() -> str:
    user, pwd = settings.EARTHDATA_USERNAME, settings.EARTHDATA_PASSWORD
    if not (user and pwd):

        import netrc
        login, _, password = netrc.netrc().hosts['urs.earthdata.nasa.gov']
        user, pwd = login, password


    signin_urls = [
        "https://api.giovanni.earthdata.nasa.gov/signin",
        "https://api.giovanni.earthdata.nasa.gov/gettoken", 
        "https://giovanni.gsfc.nasa.gov/signin"
    ]

    session = requests.Session()
    retry_strategy = Retry(
        total=3,
        backoff_factor=2,
        status_forcelist=[429, 500, 502, 503, 504],
        allowed_methods=["GET"]
    )
    
    adapter = HTTPAdapter(max_retries=retry_strategy)
    session.mount("http://", adapter)
    session.mount("https://", adapter)


    last_error = None
    token_received = False
    
    for url_idx, signin_url in enumerate(signin_urls):
        logger.info(f"🎯 Trying URL {url_idx + 1}/{len(signin_urls)}: {signin_url.split('/')[-1]}")
        
        max_attempts = 2
        for attempt in range(max_attempts):
            try:
                logger.info(f"🔑 Attempting token (URL {url_idx + 1}, attempt {attempt + 1}/{max_attempts})")
                
                r = session.get(
                    signin_url,
                    auth=HTTPBasicAuth(user, pwd),
                    allow_redirects=True,
                    timeout=90,
                )
                

                logger.info(f"✅ Connection success with URL: {signin_url.split('/')[-1]}")
                

                ctype = r.headers.get("Content-Type", "").lower()
                txt = r.text.strip()
                if "text/html" in ctype or txt.lower().startswith("<!doctype html") or "<html" in txt.lower():
                    logger.warning(f"⚠️ URL {signin_url.split('/')[-1]} returned HTML (authorization issue) - trying next URL")
                    break
                
                logger.info(f"✅ Valid token received from: {signin_url.split('/')[-1]}")

                token_received = True
                break
                
            except requests.exceptions.RequestException as e:
                logger.warning(f"⚠️ {signin_url.split('/')[-1]} attempt {attempt + 1} failed: {str(e)}")
                last_error = e
                
                if attempt < max_attempts - 1:
                    wait_time = 2
                    time.sleep(wait_time)
        else:

            continue
        

        if token_received:
            break
    else:

        raise RuntimeError(f"All Giovanni URLs failed. Last error: {str(last_error)}")
    

    if not token_received:
        raise RuntimeError("All Giovanni URLs returned HTML (authorization issues). Check your NASA Earthdata account permissions.")


    if r.status_code in (401, 403):
        raise RuntimeError(f"EDL signin inválido ({r.status_code}). Revisa usuario/clave y autoriza GES DISC/Giovanni en tu cuenta.")

    r.raise_for_status()


    token = r.text.replace('"', "").strip()
    if not token or " " in token or "<" in token:
        raise RuntimeError("Token EDL inesperado. Respuesta no parece un token válido.")

    logger.info(f"🎉 Token obtained successfully: {token[:20]}...")
    return token
