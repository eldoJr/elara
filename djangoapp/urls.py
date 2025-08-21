from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from . import views

app_name = 'djangoapp'
urlpatterns = [
    # Authentication endpoints
    path('auth/register/', views.registration, name='register'),
    path('auth/register', views.registration, name='register_no_slash'),
    path('auth/login/', views.login_user, name='login'),
    path('auth/login', views.login_user, name='login_no_slash'),
    path('auth/logout/', views.logout_request, name='logout'),
    path('auth/logout', views.logout_request, name='logout_no_slash'),
    
    # Product endpoints
    path('products/', views.get_products, name='get_products'),
    path('products', views.get_products, name='get_products_no_slash'),
    path('products/<int:product_id>/', views.get_product_detail, name='get_product_detail'),
    path('products/<int:product_id>', views.get_product_detail, name='get_product_detail_no_slash'),
    path('categories/', views.get_categories, name='get_categories'),
    path('categories', views.get_categories, name='get_categories_no_slash'),
    
    # Cart endpoints
    path('cart/', views.get_cart, name='get_cart'),
    path('cart', views.get_cart, name='get_cart_no_slash'),
    path('cart/add/', views.add_to_cart, name='add_to_cart'),
    path('cart/add', views.add_to_cart, name='add_to_cart_no_slash'),
    path('cart/update/', views.update_cart_item, name='update_cart_item'),
    path('cart/update', views.update_cart_item, name='update_cart_item_no_slash'),
    path('cart/remove/', views.remove_from_cart, name='remove_from_cart'),
    path('cart/remove', views.remove_from_cart, name='remove_from_cart_no_slash'),
    
    # Order endpoints
    path('orders/', views.get_orders, name='get_orders'),
    path('orders', views.get_orders, name='get_orders_no_slash'),
    path('orders/create/', views.create_order, name='create_order'),
    path('orders/create', views.create_order, name='create_order_no_slash'),
    
    # AI Assistant endpoint
    path('assistant/chat/', views.ai_chat, name='ai_chat'),
    path('search/semantic/', views.semantic_search, name='semantic_search'),
    path('recommendations/', views.get_recommendations, name='get_recommendations'),
    path('search/suggestions/', views.search_suggestions, name='search_suggestions'),
    path('assistant/chat', views.ai_chat, name='ai_chat_no_slash'),
    
    # User profile
    path('profile/', views.get_profile, name='get_profile'),
    path('profile', views.get_profile, name='get_profile_no_slash'),
    path('profile/update/', views.update_profile, name='update_profile'),
    path('profile/update', views.update_profile, name='update_profile_no_slash'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)