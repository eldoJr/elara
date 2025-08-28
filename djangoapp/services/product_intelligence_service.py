import json
import os
import logging
from typing import Dict, List, Optional, Tuple
from datetime import datetime

logger = logging.getLogger(__name__)

class ProductIntelligenceService:
    """Advanced product intelligence and recommendation service"""
    
    def __init__(self):
        self.products_file = os.path.join(os.path.dirname(__file__), '../../database/data/products.json')
        self.products = self._load_products()
        self.product_index = self._build_search_index()
        
    def _load_products(self) -> List[Dict]:
        """Load products with enhanced metadata"""
        try:
            with open(self.products_file, 'r', encoding='utf-8') as f:
                products = json.load(f)
            
            # Enhance products with intelligence metadata
            for product in products:
                product['popularity_score'] = self._calculate_popularity(product)
                product['value_score'] = self._calculate_value_score(product)
                product['search_keywords'] = self._extract_keywords(product)
                product['complementary_categories'] = self._get_complementary_categories(product)
            
            logger.info(f"Enhanced {len(products)} products with intelligence metadata")
            return products
            
        except Exception as e:
            logger.error(f"Failed to load products: {e}")
            return []
    
    def _build_search_index(self) -> Dict:
        """Build advanced search index"""
        index = {
            'by_category': {},
            'by_brand': {},
            'by_price_range': {'budget': [], 'mid': [], 'premium': []},
            'by_keywords': {},
            'trending': []
        }
        
        for product in self.products:
            # Category index
            cat_id = product.get('category_id')
            if cat_id:
                if cat_id not in index['by_category']:
                    index['by_category'][cat_id] = []
                index['by_category'][cat_id].append(product)
            
            # Brand index
            brand = product.get('brand', '').lower()
            if brand:
                if brand not in index['by_brand']:
                    index['by_brand'][brand] = []
                index['by_brand'][brand].append(product)
            
            # Price range index
            price = product.get('price', 0)
            if price < 25:
                index['by_price_range']['budget'].append(product)
            elif price < 100:
                index['by_price_range']['mid'].append(product)
            else:
                index['by_price_range']['premium'].append(product)
            
            # Keyword index
            for keyword in product.get('search_keywords', []):
                if keyword not in index['by_keywords']:
                    index['by_keywords'][keyword] = []
                index['by_keywords'][keyword].append(product)
        
        # Sort trending by popularity
        index['trending'] = sorted(
            self.products, 
            key=lambda x: x.get('popularity_score', 0), 
            reverse=True
        )[:20]
        
        return index
    
    def _calculate_popularity(self, product: Dict) -> float:
        """Calculate product popularity score"""
        score = 0.0
        
        # Rating contribution (0-50 points)
        rating = product.get('rating', 0)
        score += rating * 10
        
        # Stock level contribution (0-20 points)
        stock = product.get('stock_quantity', 0)
        if stock > 50:
            score += 20
        elif stock > 10:
            score += 15
        elif stock > 0:
            score += 10
        
        # Price attractiveness (0-15 points)
        discount = product.get('discount_percentage', 0)
        score += discount * 0.5
        
        # Brand recognition (0-15 points)
        known_brands = ['chanel', 'dior', 'calvin klein', 'gucci', 'essence']
        brand = product.get('brand', '').lower()
        if any(kb in brand for kb in known_brands):
            score += 15
        
        return round(score, 2)
    
    def _calculate_value_score(self, product: Dict) -> float:
        """Calculate value-for-money score"""
        rating = product.get('rating', 0)
        price = product.get('price', 1)
        discount = product.get('discount_percentage', 0)
        
        # Base value: rating per dollar
        base_value = rating / price if price > 0 else 0
        
        # Discount bonus
        discount_bonus = discount * 0.01
        
        return round((base_value + discount_bonus) * 100, 2)
    
    def _extract_keywords(self, product: Dict) -> List[str]:
        """Extract searchable keywords from product"""
        keywords = []
        
        # Name keywords
        name_words = product.get('name', '').lower().split()
        keywords.extend([word for word in name_words if len(word) > 2])
        
        # Brand
        brand = product.get('brand', '').lower()
        if brand:
            keywords.append(brand)
        
        # Category-specific keywords
        cat_id = product.get('category_id')
        if cat_id == 1:  # Beauty
            keywords.extend(['makeup', 'beauty', 'cosmetic'])
        elif cat_id == 2:  # Fragrances
            keywords.extend(['perfume', 'fragrance', 'scent'])
        elif cat_id == 3:  # Furniture
            keywords.extend(['furniture', 'home', 'decor'])
        
        return list(set(keywords))
    
    def _get_complementary_categories(self, product: Dict) -> List[int]:
        """Get categories that complement this product"""
        cat_id = product.get('category_id')
        
        complements = {
            1: [2],  # Beauty complements with Fragrances
            2: [1],  # Fragrances complement with Beauty
            3: []    # Furniture standalone
        }
        
        return complements.get(cat_id, [])
    
    def intelligent_search(self, query: str, limit: int = 10, user_preferences: Optional[Dict] = None) -> List[Dict]:
        """Perform intelligent product search"""
        query_lower = query.lower().strip()
        
        if not query_lower:
            return self.get_trending_products(limit)
        
        scored_products = []
        
        for product in self.products:
            score = self._calculate_search_relevance(product, query_lower, user_preferences)
            
            if score > 0:
                product_copy = product.copy()
                product_copy['search_relevance'] = score
                scored_products.append(product_copy)
        
        # Sort by relevance and return top results
        scored_products.sort(key=lambda x: x['search_relevance'], reverse=True)
        return scored_products[:limit]
    
    def _calculate_search_relevance(self, product: Dict, query: str, user_preferences: Optional[Dict]) -> float:
        """Calculate search relevance score"""
        score = 0.0
        
        # Exact name match (highest priority)
        if query in product.get('name', '').lower():
            score += 100
        
        # Brand match
        if query in product.get('brand', '').lower():
            score += 80
        
        # Keyword matches
        keywords = product.get('search_keywords', [])
        for keyword in keywords:
            if query in keyword or keyword in query:
                score += 60
        
        # Description match
        if query in product.get('description', '').lower():
            score += 40
        
        # Popularity boost
        score += product.get('popularity_score', 0) * 0.5
        
        # User preference boost
        if user_preferences:
            if user_preferences.get('preferred_categories'):
                if product.get('category_id') in user_preferences['preferred_categories']:
                    score += 30
            
            if user_preferences.get('price_range'):
                price = product.get('price', 0)
                pref_range = user_preferences['price_range']
                if pref_range['min'] <= price <= pref_range['max']:
                    score += 20
        
        return score
    
    def get_trending_products(self, limit: int = 10) -> List[Dict]:
        """Get trending products"""
        return self.product_index['trending'][:limit]
    
    def get_products_by_category(self, category_id: int, limit: int = 10) -> List[Dict]:
        """Get products by category with intelligent sorting"""
        products = self.product_index['by_category'].get(category_id, [])
        
        # Sort by popularity within category
        sorted_products = sorted(
            products, 
            key=lambda x: x.get('popularity_score', 0), 
            reverse=True
        )
        
        return sorted_products[:limit]
    
    def get_complementary_products(self, product_id: int, limit: int = 5) -> List[Dict]:
        """Get products that complement the given product"""
        # Find the source product
        source_product = None
        for product in self.products:
            if product['id'] == product_id:
                source_product = product
                break
        
        if not source_product:
            return []
        
        complementary = []
        
        # Get products from complementary categories
        comp_categories = source_product.get('complementary_categories', [])
        for cat_id in comp_categories:
            cat_products = self.get_products_by_category(cat_id, 3)
            complementary.extend(cat_products)
        
        # Get products from same category (similar products)
        same_category = self.get_products_by_category(
            source_product.get('category_id'), 
            limit - len(complementary)
        )
        
        # Filter out the source product
        same_category = [p for p in same_category if p['id'] != product_id]
        complementary.extend(same_category)
        
        return complementary[:limit]
    
    def get_products_by_price_range(self, min_price: float, max_price: float, limit: int = 10) -> List[Dict]:
        """Get products within price range"""
        filtered_products = [
            product for product in self.products
            if min_price <= product.get('price', 0) <= max_price
        ]
        
        # Sort by value score
        sorted_products = sorted(
            filtered_products,
            key=lambda x: x.get('value_score', 0),
            reverse=True
        )
        
        return sorted_products[:limit]
    
    def get_product_recommendations(self, user_behavior: List[Dict], limit: int = 10) -> List[Dict]:
        """Generate personalized recommendations based on user behavior"""
        if not user_behavior:
            return self.get_trending_products(limit)
        
        # Analyze user preferences from behavior
        category_preferences = {}
        brand_preferences = {}
        price_range = {'min': float('inf'), 'max': 0}
        
        for behavior in user_behavior:
            if behavior.get('product'):
                product = behavior['product']
                
                # Category preference
                cat_id = product.get('category_id')
                if cat_id:
                    category_preferences[cat_id] = category_preferences.get(cat_id, 0) + 1
                
                # Brand preference
                brand = product.get('brand', '').lower()
                if brand:
                    brand_preferences[brand] = brand_preferences.get(brand, 0) + 1
                
                # Price range
                price = product.get('price', 0)
                price_range['min'] = min(price_range['min'], price)
                price_range['max'] = max(price_range['max'], price)
        
        # Generate recommendations based on preferences
        recommendations = []
        
        # Preferred categories
        for cat_id in sorted(category_preferences.keys(), key=category_preferences.get, reverse=True):
            cat_products = self.get_products_by_category(cat_id, 5)
            recommendations.extend(cat_products)
        
        # Fill with trending if needed
        if len(recommendations) < limit:
            trending = self.get_trending_products(limit - len(recommendations))
            recommendations.extend(trending)
        
        # Remove duplicates and limit
        seen_ids = set()
        unique_recommendations = []
        for product in recommendations:
            if product['id'] not in seen_ids:
                seen_ids.add(product['id'])
                unique_recommendations.append(product)
        
        return unique_recommendations[:limit]

# Global instance
product_intelligence_service = ProductIntelligenceService()