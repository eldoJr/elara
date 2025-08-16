"""
ASGI config for Elara e-commerce platform.
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'djangoproj.settings')

application = get_asgi_application()