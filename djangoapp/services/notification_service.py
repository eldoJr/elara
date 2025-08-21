from typing import List, Dict, Any
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
from ..models import Product, UserBehavior, Cart, CartItem
from .ai_service import ai_service
import logging

logger = logging.getLogger(__name__)

class SmartNotificationService:
    
    def generate_personalized_notifications(self, user_id: int) -> List[Dict]:
        """Generate AI-driven personalized notifications"""
        try:
            notifications = []
            
            # Price drop alerts
            price_alerts = self._check_price_drops(user_id)
            notifications.extend(price_alerts)
            
            # Restock notifications
            restock_alerts = self._check_restocks(user_id)
            notifications.extend(restock_alerts)
            
            # Abandoned cart recovery
            cart_alerts = self._check_abandoned_cart(user_id)
            notifications.extend(cart_alerts)
            
            # Personalized recommendations
            recommendation_alerts = self._generate_recommendation_notifications(user_id)
            notifications.extend(recommendation_alerts)
            
            return notifications[:5]  # Limit to 5 notifications
            
        except Exception as e:
            logger.error(f"Notification generation error: {str(e)}")
            return []
    
    def _check_price_drops(self, user_id: int) -> List[Dict]:
        """Check for price drops on viewed products"""
        try:
            # Get recently viewed products
            viewed_products = UserBehavior.objects.filter(
                user_id=user_id,
                action='VIEW',
                timestamp__gte=timezone.now() - timedelta(days=7)
            ).values_list('product_id', flat=True).distinct()
            
            notifications = []
            for product_id in viewed_products[:3]:  # Check top 3
                try:
                    product = Product.objects.get(id=product_id)
                    # Simulate price drop detection (in real app, track price history)
                    notifications.append({
                        'type': 'price_drop',
                        'title': f'Price Drop Alert!',
                        'message': f'{product.name} is now available at a great price: ${product.price}',
                        'product_id': product.id,
                        'priority': 'high'
                    })
                except Product.DoesNotExist:
                    continue
            
            return notifications[:2]  # Limit price drop alerts
            
        except Exception as e:
            logger.error(f"Price drop check error: {str(e)}")
            return []
    
    def _check_restocks(self, user_id: int) -> List[Dict]:
        """Check for restocks of out-of-stock items user was interested in"""
        try:
            # Get products user viewed that were out of stock
            viewed_products = UserBehavior.objects.filter(
                user_id=user_id,
                action='VIEW',
                timestamp__gte=timezone.now() - timedelta(days=14)
            ).values_list('product_id', flat=True).distinct()
            
            notifications = []
            for product_id in viewed_products[:3]:
                try:
                    product = Product.objects.get(id=product_id)
                    stock = getattr(product, 'stock_quantity', 0)
                    if stock > 0:  # Now in stock
                        notifications.append({
                            'type': 'restock',
                            'title': 'Back in Stock!',
                            'message': f'{product.name} is now available. Get it before it sells out again!',
                            'product_id': product.id,
                            'priority': 'medium'
                        })
                except Product.DoesNotExist:
                    continue
            
            return notifications[:1]  # Limit restock alerts
            
        except Exception as e:
            logger.error(f"Restock check error: {str(e)}")
            return []
    
    def _check_abandoned_cart(self, user_id: int) -> List[Dict]:
        """Check for abandoned cart and create recovery notification"""
        try:
            cart = Cart.objects.get(user_id=user_id)
            cart_items = CartItem.objects.filter(cart=cart)
            
            if cart_items.exists():
                # Generate AI-powered cart recovery message
                items_list = [item.product.name for item in cart_items[:3]]
                
                recovery_prompt = f"""
                User has {cart_items.count()} items in cart: {', '.join(items_list)}
                Create a compelling cart recovery message that:
                1. Is personalized and friendly
                2. Creates urgency without being pushy
                3. Highlights value or benefits
                4. Encourages completion
                """
                
                ai_message = ai_service.chat_completion([
                    {'role': 'system', 'content': 'You are a friendly e-commerce assistant.'},
                    {'role': 'user', 'content': recovery_prompt}
                ])
                
                return [{
                    'type': 'abandoned_cart',
                    'title': 'Complete Your Purchase',
                    'message': ai_message,
                    'cart_items': cart_items.count(),
                    'priority': 'high'
                }]
            
            return []
            
        except Cart.DoesNotExist:
            return []
        except Exception as e:
            logger.error(f"Abandoned cart check error: {str(e)}")
            return []
    
    def _generate_recommendation_notifications(self, user_id: int) -> List[Dict]:
        """Generate AI-powered recommendation notifications"""
        try:
            # Get user's recent behavior
            recent_behaviors = UserBehavior.objects.filter(
                user_id=user_id,
                timestamp__gte=timezone.now() - timedelta(days=3)
            ).order_by('-timestamp')[:5]
            
            if not recent_behaviors.exists():
                return []
            
            behavior_summary = [
                f"{b.action}: {b.product.name if b.product else 'N/A'}"
                for b in recent_behaviors
            ]
            
            recommendation_prompt = f"""
            User's recent activity: {'; '.join(behavior_summary)}
            
            Create a personalized product recommendation notification that:
            1. References their recent interests
            2. Suggests complementary or related products
            3. Is engaging and helpful
            4. Includes a clear call-to-action
            """
            
            ai_recommendation = ai_service.chat_completion([
                {'role': 'system', 'content': 'You are a personalized shopping assistant.'},
                {'role': 'user', 'content': recommendation_prompt}
            ])
            
            return [{
                'type': 'recommendation',
                'title': 'Recommended for You',
                'message': ai_recommendation,
                'priority': 'medium'
            }]
            
        except Exception as e:
            logger.error(f"Recommendation notification error: {str(e)}")
            return []
    
    def create_marketing_campaign(self, target_segment: str, campaign_type: str) -> Dict:
        """Create AI-powered marketing campaign"""
        try:
            campaign_prompt = f"""
            Create a marketing campaign for:
            Target Segment: {target_segment}
            Campaign Type: {campaign_type}
            
            Generate:
            1. Campaign title and theme
            2. Key messaging points
            3. Call-to-action suggestions
            4. Timing recommendations
            5. Success metrics to track
            """
            
            campaign = ai_service.chat_completion([
                {'role': 'system', 'content': 'You are a marketing campaign expert.'},
                {'role': 'user', 'content': campaign_prompt}
            ])
            
            return {
                'target_segment': target_segment,
                'campaign_type': campaign_type,
                'campaign_details': campaign,
                'status': 'success'
            }
            
        except Exception as e:
            logger.error(f"Marketing campaign error: {str(e)}")
            return {'status': 'error', 'message': str(e)}

# Global instance
notification_service = SmartNotificationService()