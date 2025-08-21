from typing import List, Dict, Any, Optional
from django.contrib.auth.models import User
from ..models import Product, UserBehavior, Category
from .ai_service import ai_service
import logging

logger = logging.getLogger(__name__)

class PersonalizationService:
    
    def get_personalized_ui_layout(self, user_id: int) -> Dict:
        """Generate AI-driven UI personalization"""
        try:
            # Get user behavior patterns
            behaviors = UserBehavior.objects.filter(user_id=user_id).order_by('-timestamp')[:50]
            
            # Analyze behavior patterns
            behavior_analysis = self._analyze_user_patterns(behaviors)
            
            # Generate UI recommendations
            ui_prompt = f"""
            User behavior analysis: {behavior_analysis}
            
            Recommend UI personalization including:
            1. Preferred product layout (grid/list)
            2. Category priorities for navigation
            3. Color scheme preferences
            4. Content organization suggestions
            """
            
            ui_recommendations = ai_service.chat_completion([
                {'role': 'system', 'content': 'You are a UI/UX personalization expert.'},
                {'role': 'user', 'content': ui_prompt}
            ])
            
            return {
                'layout_type': self._determine_layout_preference(behaviors),
                'category_priorities': self._get_category_priorities(behaviors),
                'color_scheme': self._suggest_color_scheme(behaviors),
                'ai_recommendations': ui_recommendations,
                'status': 'success'
            }
            
        except Exception as e:
            logger.error(f"UI personalization error: {str(e)}")
            return {'status': 'error', 'message': str(e)}
    
    def get_adaptive_product_layout(self, user_id: int, category_id: Optional[int] = None) -> Dict:
        """Get adaptive product layout based on user preferences"""
        try:
            behaviors = UserBehavior.objects.filter(user_id=user_id)
            
            # Determine preferred layout
            layout_preference = self._determine_layout_preference(behaviors)
            
            # Get products with personalized ordering
            products_query = Product.objects.filter(is_active=True)
            if category_id:
                products_query = products_query.filter(category_id=category_id)
            
            # Personalize product ordering
            personalized_products = self._personalize_product_order(products_query, behaviors)
            
            return {
                'layout_type': layout_preference,
                'products': personalized_products[:20],
                'personalization_applied': True,
                'status': 'success'
            }
            
        except Exception as e:
            logger.error(f"Adaptive layout error: {str(e)}")
            return {'status': 'error', 'message': str(e)}
    
    def get_dynamic_navigation(self, user_id: int) -> Dict:
        """Generate dynamic navigation based on user behavior"""
        try:
            behaviors = UserBehavior.objects.filter(user_id=user_id)
            
            # Get most viewed categories
            category_views = behaviors.filter(action='VIEW').values(
                'product__category__name'
            ).annotate(view_count=Count('id')).order_by('-view_count')
            
            # Generate navigation suggestions
            nav_prompt = f"""
            User's category preferences: {list(category_views[:5])}
            
            Create personalized navigation structure:
            1. Priority order for categories
            2. Quick access shortcuts
            3. Personalized menu items
            4. Smart filters to show
            """
            
            nav_suggestions = ai_service.chat_completion([
                {'role': 'system', 'content': 'You are a navigation design expert.'},
                {'role': 'user', 'content': nav_prompt}
            ])
            
            return {
                'priority_categories': [item['product__category__name'] for item in category_views[:5]],
                'navigation_suggestions': nav_suggestions,
                'quick_access_items': self._get_quick_access_items(behaviors),
                'status': 'success'
            }
            
        except Exception as e:
            logger.error(f"Dynamic navigation error: {str(e)}")
            return {'status': 'error', 'message': str(e)}
    
    def _analyze_user_patterns(self, behaviors) -> str:
        """Analyze user behavior patterns"""
        if not behaviors:
            return "New user with no behavior history"
        
        action_counts = {}
        for behavior in behaviors:
            action_counts[behavior.action] = action_counts.get(behavior.action, 0) + 1
        
        return f"Actions: {action_counts}, Recent activity: {behaviors.count()} events"
    
    def _determine_layout_preference(self, behaviors) -> str:
        """Determine user's preferred layout type"""
        # Simple heuristic: active users prefer grid, casual users prefer list
        if behaviors.count() > 20:
            return 'grid'
        return 'list'
    
    def _get_category_priorities(self, behaviors) -> List[str]:
        """Get user's category priorities"""
        try:
            from django.db.models import Count
            category_views = behaviors.filter(action='VIEW').values(
                'product__category__name'
            ).annotate(view_count=Count('id')).order_by('-view_count')
            
            return [item['product__category__name'] for item in category_views[:5] if item['product__category__name']]
        except:
            return []
    
    def _suggest_color_scheme(self, behaviors) -> str:
        """Suggest color scheme based on user behavior"""
        # Simple logic: frequent users get dark mode, casual users get light
        if behaviors.count() > 50:
            return 'dark'
        return 'light'
    
    def _personalize_product_order(self, products_query, behaviors) -> List[Dict]:
        """Personalize product ordering based on user preferences"""
        try:
            # Get user's preferred categories
            preferred_categories = self._get_category_priorities(behaviors)
            
            products = []
            for product in products_query[:20]:
                score = 0
                if product.category and product.category.name in preferred_categories:
                    score += preferred_categories.index(product.category.name) + 1
                
                products.append({
                    'id': product.id,
                    'name': product.name,
                    'price': float(product.price),
                    'category': product.category.name if product.category else '',
                    'image': getattr(product, 'image_url', ''),
                    'personalization_score': score
                })
            
            # Sort by personalization score
            return sorted(products, key=lambda x: x['personalization_score'], reverse=True)
            
        except Exception as e:
            logger.error(f"Product personalization error: {str(e)}")
            return []
    
    def _get_quick_access_items(self, behaviors) -> List[str]:
        """Get quick access items based on user behavior"""
        try:
            # Get most common actions
            common_actions = behaviors.values('action').annotate(
                count=Count('action')
            ).order_by('-count')[:3]
            
            quick_items = []
            for action in common_actions:
                if action['action'] == 'VIEW':
                    quick_items.append('Recently Viewed')
                elif action['action'] == 'CART_ADD':
                    quick_items.append('My Cart')
                elif action['action'] == 'SEARCH':
                    quick_items.append('Search History')
            
            return quick_items
            
        except Exception as e:
            logger.error(f"Quick access error: {str(e)}")
            return ['Home', 'Products', 'Cart']

# Global instance
personalization_service = PersonalizationService()