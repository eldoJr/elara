from typing import List, Dict, Any, Optional
from django.db.models import Count, Q
from ..models import Product, UserBehavior, Order, OrderItem
import logging

logger = logging.getLogger(__name__)

class RecommendationService:
    
    def get_personalized_recommendations(self, user_id: int, limit: int = 10) -> List[Dict]:
        """Get personalized product recommendations for user"""
        try:
            # Get user behavior
            user_behaviors = UserBehavior.objects.filter(user_id=user_id)
            
            if not user_behaviors.exists():
                return self._get_popular_products(limit)
            
            # Collaborative filtering approach
            viewed_products = user_behaviors.filter(action='view').values_list('product_id', flat=True)
            purchased_products = user_behaviors.filter(action='purchase').values_list('product_id', flat=True)
            
            # Find similar users
            similar_users = self._find_similar_users(user_id, viewed_products, purchased_products)
            
            # Get recommendations based on similar users
            recommendations = self._get_collaborative_recommendations(
                user_id, similar_users, viewed_products, purchased_products, limit
            )
            
            if len(recommendations) < limit:
                # Fill with content-based recommendations
                content_recs = self._get_content_based_recommendations(
                    viewed_products, limit - len(recommendations)
                )
                recommendations.extend(content_recs)
            
            return recommendations[:limit]
            
        except Exception as e:
            logger.error(f"Personalized recommendations error: {str(e)}")
            return self._get_popular_products(limit)
    
    def get_similar_products(self, product_id: int, limit: int = 6) -> List[Dict]:
        """Get products similar to the given product"""
        try:
            product = Product.objects.get(id=product_id)
            
            # Find products in same category
            similar_products = Product.objects.filter(
                category=product.category
            ).exclude(id=product_id)
            
            # Add price-based similarity
            price_range = product.price * 0.3  # 30% price range
            similar_products = similar_products.filter(
                price__gte=product.price - price_range,
                price__lte=product.price + price_range
            )
            
            return [self._product_to_dict(p) for p in similar_products[:limit]]
            
        except Exception as e:
            logger.error(f"Similar products error: {str(e)}")
            return []
    
    def get_frequently_bought_together(self, product_id: int, limit: int = 4) -> List[Dict]:
        """Get products frequently bought together with the given product"""
        try:
            # Find orders containing this product
            orders_with_product = OrderItem.objects.filter(
                product_id=product_id
            ).values_list('order_id', flat=True)
            
            # Find other products in those orders
            related_products = OrderItem.objects.filter(
                order_id__in=orders_with_product
            ).exclude(product_id=product_id).values('product_id').annotate(
                frequency=Count('product_id')
            ).order_by('-frequency')
            
            product_ids = [item['product_id'] for item in related_products[:limit]]
            products = Product.objects.filter(id__in=product_ids)
            
            return [self._product_to_dict(p) for p in products]
            
        except Exception as e:
            logger.error(f"Frequently bought together error: {str(e)}")
            return []
    
    def get_trending_products(self, limit: int = 10) -> List[Dict]:
        """Get trending products based on recent activity"""
        try:
            from django.utils import timezone
            from datetime import timedelta
            
            # Get products with most views in last 7 days
            week_ago = timezone.now() - timedelta(days=7)
            
            trending = UserBehavior.objects.filter(
                timestamp__gte=week_ago,
                action='view'
            ).values('product_id').annotate(
                view_count=Count('product_id')
            ).order_by('-view_count')
            
            product_ids = [item['product_id'] for item in trending[:limit]]
            products = Product.objects.filter(id__in=product_ids)
            
            return [self._product_to_dict(p) for p in products]
            
        except Exception as e:
            logger.error(f"Trending products error: {str(e)}")
            return self._get_popular_products(limit)
    
    def _find_similar_users(self, user_id: int, viewed_products: List[int], purchased_products: List[int]) -> List[int]:
        """Find users with similar behavior"""
        # Find users who viewed/purchased similar products
        similar_users = UserBehavior.objects.filter(
            Q(product_id__in=viewed_products) | Q(product_id__in=purchased_products)
        ).exclude(user_id=user_id).values('user_id').annotate(
            similarity_score=Count('user_id')
        ).order_by('-similarity_score')
        
        return [user['user_id'] for user in similar_users[:20]]
    
    def _get_collaborative_recommendations(self, user_id: int, similar_users: List[int], 
                                         viewed_products: List[int], purchased_products: List[int], 
                                         limit: int) -> List[Dict]:
        """Get recommendations based on similar users' behavior"""
        # Get products that similar users liked but current user hasn't seen
        recommended_products = UserBehavior.objects.filter(
            user_id__in=similar_users,
            action__in=['view', 'purchase']
        ).exclude(
            product_id__in=list(viewed_products) + list(purchased_products)
        ).values('product_id').annotate(
            recommendation_score=Count('product_id')
        ).order_by('-recommendation_score')
        
        product_ids = [item['product_id'] for item in recommended_products[:limit]]
        products = Product.objects.filter(id__in=product_ids)
        
        return [self._product_to_dict(p) for p in products]
    
    def _get_content_based_recommendations(self, viewed_products: List[int], limit: int) -> List[Dict]:
        """Get recommendations based on product content similarity"""
        if not viewed_products:
            return []
        
        # Get categories of viewed products
        viewed_categories = Product.objects.filter(
            id__in=viewed_products
        ).values_list('category', flat=True).distinct()
        
        # Recommend products from same categories
        recommendations = Product.objects.filter(
            category__in=viewed_categories
        ).exclude(id__in=viewed_products)
        
        return [self._product_to_dict(p) for p in recommendations[:limit]]
    
    def _get_popular_products(self, limit: int) -> List[Dict]:
        """Get popular products as fallback"""
        popular_products = Product.objects.annotate(
            view_count=Count('userbehavior')
        ).order_by('-view_count')
        
        return [self._product_to_dict(p) for p in popular_products[:limit]]
    
    def _product_to_dict(self, product: Product) -> Dict:
        """Convert product model to dictionary"""
        return {
            'id': product.id,
            'name': product.name,
            'description': product.description,
            'price': float(product.price),
            'category': product.category.name if product.category else '',
            'image': product.image.url if product.image else '',
            'stock': product.stock
        }

# Global instance
recommendation_service = RecommendationService()