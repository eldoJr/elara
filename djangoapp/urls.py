from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from . import views

app_name = 'djangoapp'
urlpatterns = [
    # Authentication endpoints
    path('auth/register/', views.registration, name='register'),
    path('auth/login/', views.login_user, name='login'),
    path('auth/logout/', views.logout_request, name='logout'),
    
    # Product endpoints
    path('products/', views.get_products, name='get_products'),
    path('products/<int:product_id>/', views.get_product_detail, name='get_product_detail'),
    path('categories/', views.get_categories, name='get_categories'),
    
    # Cart endpoints
    path('cart/', views.get_cart, name='get_cart'),
    path('cart/add/', views.add_to_cart, name='add_to_cart'),
    path('cart/update/', views.update_cart_item, name='update_cart_item'),
    path('cart/remove/', views.remove_from_cart, name='remove_from_cart'),
    
    # Order endpoints
    path('orders/', views.get_orders, name='get_orders'),
    path('orders/create/', views.create_order, name='create_order'),
    
    # AI Assistant endpoint
    path('assistant/chat/', views.ai_chat, name='ai_chat'),
    
    # User profile
    path('profile/', views.get_profile, name='get_profile'),
    path('profile/update/', views.update_profile, name='update_profile'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)