"""
ASGI config for chatapp project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application
from django.db import connection
from chatapp.websocket import websocket_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "chatapp.settings")

http_application = get_asgi_application()

buffer = {}  # email -> list of message obj which is sent either to or by this email
latest = {}  # email -> list of message obj which are to be sent to this email
current_pool = set()

async def application(scope, receive, send):
    if scope["type"] == "http":
        await http_application(scope, receive, send)
    elif scope["type"] == "websocket":
        await websocket_application(scope, receive, send, buffer, latest, connection, current_pool)
    else:
        raise NotImplementedError(f"Unknown scope type {scope['type']}")
