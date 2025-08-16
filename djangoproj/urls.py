"""
Elara E-Commerce Platform URL Configuration
"""
from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('djangoapp.urls')),
    path('', TemplateView.as_view(template_name="index.html")),
    path('products/', TemplateView.as_view(template_name="index.html")),
    path('cart/', TemplateView.as_view(template_name="index.html")),
    path('login/', TemplateView.as_view(template_name="index.html")),
    path('register/', TemplateView.as_view(template_name="index.html")),
    path('profile/', TemplateView.as_view(template_name="index.html")),
    path('assistant/', TemplateView.as_view(template_name="index.html")),
    # Serve manifest.json from the build directory
    path('manifest.json', TemplateView.as_view(
        template_name="manifest.json",
        content_type="application/json"
    )),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)