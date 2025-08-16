from django.urls import path
from .views import CartView, add_to_cart, OrderListView

urlpatterns = [
    path('cart/', CartView.as_view(), name='cart'),
    path('cart/add/', add_to_cart, name='add-to-cart'),
    path('orders/', OrderListView.as_view(), name='order-list'),
]