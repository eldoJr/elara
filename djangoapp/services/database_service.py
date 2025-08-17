import requests
from django.conf import settings
from typing import Dict, List, Optional
import logging

logger = logging.getLogger(__name__)

class DatabaseService:
    """Service to interact with MongoDB database API"""
    
    def __init__(self):
        self.base_url = getattr(settings, 'DATABASE_API_URL', 'http://localhost:3031/api')
    
    def _make_request(self, method: str, endpoint: str, data: Optional[Dict] = None, params: Optional[Dict] = None) -> Optional[Dict]:
        """Make HTTP request to database API"""
        try:
            url = f"{self.base_url}/{endpoint.lstrip('/')}"
            response = requests.request(method, url, json=data, params=params, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"Database API request failed: {e}")
            return None
    
    # Product methods
    def get_products(self, category: Optional[int] = None, brand: Optional[str] = None, 
                    search: Optional[str] = None, limit: int = 20, offset: int = 0) -> List[Dict]:
        """Get products with filtering"""
        params = {'limit': limit, 'offset': offset}
        if category:
            params['category'] = category
        if brand:
            params['brand'] = brand
        if search:
            params['search'] = search
        
        result = self._make_request('GET', 'products', params=params)
        return result if result else []
    
    def get_product(self, product_id: int) -> Optional[Dict]:
        """Get single product by ID"""
        return self._make_request('GET', f'products/{product_id}')
    
    # Category methods
    def get_categories(self) -> List[Dict]:
        """Get all categories"""
        result = self._make_request('GET', 'categories')
        return result if result else []
    
    # Cart methods
    def get_cart(self, user_id: int) -> Optional[Dict]:
        """Get user cart"""
        return self._make_request('GET', f'cart/{user_id}')
    
    def add_to_cart(self, user_id: int, product_id: int, quantity: int = 1) -> Optional[Dict]:
        """Add item to cart"""
        data = {
            'user_id': user_id,
            'product_id': product_id,
            'quantity': quantity
        }
        return self._make_request('POST', 'cart/add', data=data)
    
    # Order methods
    def get_orders(self, user_id: int) -> List[Dict]:
        """Get user orders"""
        result = self._make_request('GET', f'orders/{user_id}')
        return result if result else []
    
    def create_order(self, order_data: Dict) -> Optional[Dict]:
        """Create new order"""
        return self._make_request('POST', 'orders', data=order_data)
    
    # Review methods
    def get_product_reviews(self, product_id: int) -> List[Dict]:
        """Get reviews for a product"""
        result = self._make_request('GET', f'reviews/product/{product_id}')
        return result if result else []
    
    def create_review(self, review_data: Dict) -> Optional[Dict]:
        """Create new review"""
        return self._make_request('POST', 'reviews', data=review_data)

# Singleton instance
db_service = DatabaseService()