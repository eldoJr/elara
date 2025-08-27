from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from . import views
from . import ai_endpoints

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
    
    # Phase 3: Advanced AI Features
    path('shopping-list/create/', views.create_shopping_list, name='create_shopping_list'),
    path('shopping/guidance/', views.get_shopping_guidance, name='shopping_guidance'),
    path('voice/query/', views.voice_query, name='voice_query'),
    
    # Predictive Analytics
    path('analytics/demand-forecast/', views.demand_forecast, name='demand_forecast'),
    path('analytics/inventory-optimization/', views.inventory_optimization, name='inventory_optimization'),
    path('analytics/price-analysis/', views.price_analysis, name='price_analysis'),
    path('analytics/customer-ltv/', views.customer_lifetime_value, name='customer_lifetime_value'),
    
    # Smart Notifications
    path('notifications/', views.get_notifications, name='get_notifications'),
    path('marketing/campaign/', views.create_marketing_campaign, name='create_marketing_campaign'),
    
    # Phase 4: Advanced Personalization
    path('personalization/ui/', views.get_personalized_ui, name='personalized_ui'),
    path('personalization/layout/', views.get_adaptive_layout, name='adaptive_layout'),
    path('personalization/navigation/', views.get_dynamic_navigation, name='dynamic_navigation'),
    
    # Smart Cart Features
    path('cart/optimize/', views.optimize_cart, name='optimize_cart'),
    path('cart/bundles/', views.get_smart_bundles, name='smart_bundles'),
    path('cart/recovery/', views.recover_abandoned_cart, name='cart_recovery'),
    path('pricing/dynamic/', views.get_dynamic_pricing, name='dynamic_pricing'),
    path('assistant/chat', views.ai_chat, name='ai_chat_no_slash'),
    
    # User profile
    path('profile/', views.get_profile, name='get_profile'),
    path('profile', views.get_profile, name='get_profile_no_slash'),
    path('profile/update/', views.update_profile, name='update_profile'),
    path('profile/update', views.update_profile, name='update_profile_no_slash'),
    
    # Gemini AI Endpoints
    path('ai/bundles/', ai_endpoints.generate_product_bundles, name='ai_bundles'),
    path('ai/search-enhance/', ai_endpoints.enhance_search_results, name='ai_search_enhance'),
    path('ai/marketing/', ai_endpoints.generate_marketing_content, name='ai_marketing'),
    path('ai/sentiment/', ai_endpoints.analyze_product_sentiment, name='ai_sentiment'),
    path('ai/description/', ai_endpoints.generate_product_description, name='ai_description'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)