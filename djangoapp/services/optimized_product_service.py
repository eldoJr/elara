import json
import os
import logging
from typing import List, Dict, Optional

logger = logging.getLogger(__name__)

class OptimizedProductService:
    def __init__(self):
        self.products_file = os.path.join(os.path.dirname(__file__), '../../database/data/products.json')
        self.products = self.load_products()
        
    def load_products(self) -> List[Dict]:
        """Load and index products from JSON"""
        try:
            with open(self.products_file, 'r', encoding='utf-8') as f:
                products = json.load(f)
            
            # Index products for fast search
            for product in products:
                product['search_text'] = (
                    f"{product['name']} {product['description']} "
                    f"{product.get('brand', '')}".lower()
                )
            
            logger.info(f"Loaded {len(products)} products from JSON")
            return products
        except Exception as e:
            logger.error(f"Error loading products: {e}")
            return []
    
    def search(self, query: str, category_id: Optional[int] = None, limit: int = 10) -> List[Dict]:
        """Optimized search with relevance scoring"""
        if not query:
            return self.get_trending_products(limit)
        
        query_lower = query.lower()
        results = []
        
        for product in self.products:
            # Category filter
            if category_id and product.get('category_id') != category_id:
                continue
            
            # Relevance scoring
            score = 0
            
            # Exact match in name (highest priority)
            if query_lower in product['name'].lower():
                score += 10
            
            # Word matches in name
            name_words = product['name'].lower().split()
            query_words = query_lower.split()
            for word in query_words:
                if word in name_words:
                    score += 5
            
            # Description match
            if query_lower in product['description'].lower():
                score += 3
            
            # Brand match
            if query_lower in product.get('brand', '').lower():
                score += 2
            
            if score > 0:
                product_copy = product.copy()
                product_copy['relevance_score'] = score
                results.append(product_copy)
        
        # Sort by relevance and rating
        results.sort(key=lambda x: (x['relevance_score'], x.get('rating', 0)), reverse=True)
        return results[:limit]
    
    def get_by_category(self, category_id: int, limit: int = 10) -> List[Dict]:
        """Get products by category"""
        return [p for p in self.products if p.get('category_id') == category_id][:limit]
    
    def get_trending_products(self, limit: int = 10) -> List[Dict]:
        """Get trending products (by rating)"""
        sorted_products = sorted(
            self.products, 
            key=lambda x: x.get('rating', 0), 
            reverse=True
        )
        return sorted_products[:limit]
    
    def get_by_intent(self, user_query: str) -> List[Dict]:
        """Get products by user intent"""
        query_lower = user_query.lower()
        
        # Category mapping by keywords
        if any(word in query_lower for word in ['makeup', 'beauty', 'cosmetic', 'mascara', 'lipstick']):
            return self.get_by_category(1, 5)  # Beauty
        elif any(word in query_lower for word in ['perfume', 'fragrance', 'scent']):
            return self.get_by_category(2, 5)  # Fragrances
        elif any(word in query_lower for word in ['furniture', 'bed', 'chair', 'table']):
            return self.get_by_category(3, 5)  # Furniture
        
        return self.search(user_query, limit=5)

# Global instance
product_service = OptimizedProductService()