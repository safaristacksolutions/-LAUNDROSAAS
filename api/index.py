import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(BASE_DIR, "backend"))

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()


def handler(event, context):
    method = event.get("httpMethod", "GET")
    path = event.get("path", "/")
    query = event.get("queryStringParameters") or ""
    headers = event.get("headers") or {}
    body = event.get("body") or ""

    if isinstance(query, dict):
        query = "&".join(f"{k}={v}" for k, v in query.items() if v is not None)

    environ = {
        "REQUEST_METHOD": method,
        "PATH_INFO": path,
        "QUERY_STRING": query,
        "SERVER_NAME": headers.get("host", "localhost").split(":")[0],
        "SERVER_PORT": "443",
        "HTTP_HOST": headers.get("host", "localhost"),
        "SERVER_PROTOCOL": "HTTP/1.1",
        "wsgi.version": (1, 0),
        "wsgi.url_scheme": headers.get("x-forwarded-proto", "https"),
        "wsgi.input": __import__("io").StringIO(body),
        "wsgi.errors": __import__("io").StringIO(),
        "wsgi.multithread": False,
        "wsgi.multiprocess": False,
        "wsgi.run_once": True,
        "CONTENT_TYPE": headers.get("content-type", ""),
        "CONTENT_LENGTH": str(len(body)),
    }

    for k, v in headers.items():
        k_upper = k.upper().replace("-", "_")
        if k_upper not in ("CONTENT_TYPE", "CONTENT_LENGTH") and k_upper != "HOST":
            environ[f"HTTP_{k_upper}"] = v

    status_code = [200]
    response_headers = []

    def start_response(status, headers):
        status_code[0] = int(status.split(" ")[0])
        response_headers.extend(headers)

    chunks = application(environ, start_response)
    body_out = "".join(c.decode() if isinstance(c, bytes) else c for c in chunks)

    return {
        "statusCode": status_code[0],
        "headers": dict(response_headers),
        "body": body_out,
    }
