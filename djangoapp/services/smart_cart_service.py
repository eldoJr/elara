from typing import List, Dict, Any
from django.contrib.auth.models import User
from django.db.models import Sum, Count
from ..models import Product, Cart, CartItem, UserBehavior, OrderItem
from .ai_service import ai_service
from .recommendation_service import recommendation_service
import logging

logger = logging.getLogger(__name__)

class SmartCartService:
    
    def optimize_cart(self, user_id: int) -> Dict:
        """AI-powered cart optimization"""
        try:
            cart = Cart.objects.get(user_id=user_id)
            cart_items = CartItem.objects.filter(cart=cart)
            
            if not cart_items.exists():
                return {'status': 'error', 'message': 'Cart is empty'}
            
            # Analyze cart contents
            cart_analysis = self._analyze_cart_contents(cart_items)
            
            # Generate optimization suggestions
            optimization_prompt = f"""
            Cart contents: {cart_analysis}
            
            Provide cart optimization suggestions:
            1. Bundle opportunities for cost savings
            2. Missing complementary items
            3. Quantity adjustments for better value
            4. Alternative products with better value
            """
            
            optimization_suggestions = ai_service.chat_completion([
                {'role': 'system', 'content': 'You are a shopping optimization expert.'},
                {'role': 'user', 'content': optimization_prompt}
            ])
            
            # Get smart bundles
            bundles = self._suggest_smart_bundles(cart_items)
            
            return {
                'current_total': self._calculate_cart_total(cart_items),
                'optimization_suggestions': optimization_suggestions,
                'smart_bundles': bundles,
                'potential_savings': self._calculate_potential_savings(cart_items, bundles),
                'status': 'success'
            }
            
        except Cart.DoesNotExist:
            return {'status': 'error', 'message': 'Cart not found'}
        except Exception as e:
            logger.error(f"Cart optimization error: {str(e)}")
            return {'status': 'error', 'message': str(e)}
    
    def suggest_smart_bundles(self, user_id: int) -> List[Dict]:
        """Suggest smart product bundles"""
        try:
            cart = Cart.objects.get(user_id=user_id)
            cart_items = CartItem.objects.filter(cart=cart)
            
            bundles = []
            for item in cart_items:
                # Get frequently bought together items
                related_products = recommendation_service.get_frequently_bought_together(
                    item.product.id, limit=3
                )
                
                if related_products:
                    bundle_discount = 0.1  # 10% bundle discount
                    bundle_total = item.product.price
                    bundle_products = [item.product.name]
                    
                    for related in related_products[:2]:  # Max 2 additional items
                        bundle_total += related['price']
                        bundle_products.append(related['name'])
                    
                    discounted_total = bundle_total * (1 - bundle_discount)
                    
                    bundles.append({
                        'name': f"Bundle: {' + '.join(bundle_products[:2])}...",
                        'products': bundle_products,
                        'original_total': float(bundle_total),
                        'discounted_total': float(discounted_total),
                        'savings': float(bundle_total - discounted_total),
                        'discount_percentage': bundle_discount * 100
                    })
            
            return bundles[:3]  # Return top 3 bundles
            
        except Exception as e:
            logger.error(f"Smart bundles error: {str(e)}")
            return []
    
    def recover_abandoned_cart(self, user_id: int) -> Dict:
        """AI-powered abandoned cart recovery"""
        try:
            cart = Cart.objects.get(user_id=user_id)
            cart_items = CartItem.objects.filter(cart=cart)
            
            if not cart_items.exists():
                return {'status': 'error', 'message': 'No abandoned cart found'}
            
            # Analyze abandonment reasons
            cart_value = self._calculate_cart_total(cart_items)
            items_list = [item.product.name for item in cart_items]
            
            recovery_prompt = f"""
            Abandoned cart analysis:
            - Items: {', '.join(items_list)}
            - Total value: ${cart_value}
            - Items count: {cart_items.count()}
            
            Create compelling cart recovery strategy:
            1. Personalized message to encourage completion
            2. Incentive suggestions (discount, free shipping)
            3. Urgency factors (limited stock, price changes)
            4. Value proposition highlights
            """
            
            recovery_strategy = ai_service.chat_completion([
                {'role': 'system', 'content': 'You are a cart recovery specialist.'},
                {'role': 'user', 'content': recovery_prompt}
            ])
            
            # Calculate suggested incentives
            incentives = self._calculate_recovery_incentives(cart_value)
            
            return {
                'cart_value': cart_value,
                'items_count': cart_items.count(),
                'recovery_strategy': recovery_strategy,
                'suggested_incentives': incentives,
                'urgency_factors': self._get_urgency_factors(cart_items),
                'status': 'success'
            }
            
        except Exception as e:
            logger.error(f"Cart recovery error: {str(e)}")
            return {'status': 'error', 'message': str(e)}
    
    def apply_dynamic_pricing(self, user_id: int, product_id: int) -> Dict:
        """Apply dynamic pricing based on user behavior"""
        try:
            # Get user's purchase history and behavior
            user_behaviors = UserBehavior.objects.filter(user_id=user_id)
            purchase_count = user_behaviors.filter(action='PURCHASE').count()
            view_count = user_behaviors.filter(action='VIEW').count()
            
            product = Product.objects.get(id=product_id)
            base_price = float(product.price)
            
            # Calculate dynamic pricing
            pricing_prompt = f"""
            User profile:
            - Purchase history: {purchase_count} purchases
            - Engagement level: {view_count} product views
            - Base product price: ${base_price}
            
            Recommend dynamic pricing strategy:
            1. Loyalty discount eligibility
            2. Volume discount opportunities
            3. Personalized pricing adjustments
            4. Time-sensitive offers
            """
            
            pricing_strategy = ai_service.chat_completion([
                {'role': 'system', 'content': 'You are a dynamic pricing expert.'},
                {'role': 'user', 'content': pricing_prompt}
            ])
            
            # Calculate personalized price
            discount_factor = min(0.15, purchase_count * 0.02)  # Max 15% discount
            personalized_price = base_price * (1 - discount_factor)
            
            return {
                'base_price': base_price,
                'personalized_price': personalized_price,
                'discount_percentage': discount_factor * 100,
                'savings': base_price - personalized_price,
                'pricing_strategy': pricing_strategy,
                'status': 'success'
            }
            
        except Exception as e:
            logger.error(f"Dynamic pricing error: {str(e)}")
            return {'status': 'error', 'message': str(e)}
    
    def _analyze_cart_contents(self, cart_items) -> str:
        """Analyze cart contents for optimization"""
        items_info = []
        for item in cart_items:
            items_info.append(f"{item.product.name} (${item.product.price} x {item.quantity})")
        
        return f"Items: {'; '.join(items_info)}"
    
    def _calculate_cart_total(self, cart_items) -> float:
        """Calculate total cart value"""
        total = sum(item.product.price * item.quantity for item in cart_items)
        return float(total)
    
    def _suggest_smart_bundles(self, cart_items) -> List[Dict]:
        """Suggest smart bundles based on cart contents"""
        # This would integrate with the bundle suggestion logic
        return self.suggest_smart_bundles(cart_items.first().cart.user.id)
    
    def _calculate_potential_savings(self, cart_items, bundles) -> float:
        """Calculate potential savings from bundles"""
        if not bundles:
            return 0.0
        
        max_savings = max(bundle.get('savings', 0) for bundle in bundles)
        return float(max_savings)
    
    def _calculate_recovery_incentives(self, cart_value: float) -> List[Dict]:
        """Calculate suggested recovery incentives"""
        incentives = []
        
        if cart_value > 100:
            incentives.append({
                'type': 'free_shipping',
                'description': 'Free shipping on orders over $100',
                'value': 10.0
            })
        
        if cart_value > 50:
            incentives.append({
                'type': 'percentage_discount',
                'description': '5% off your order',
                'value': cart_value * 0.05
            })
        
        return incentives
    
    def _get_urgency_factors(self, cart_items) -> List[str]:
        """Get urgency factors for cart recovery"""
        factors = []
        
        for item in cart_items:
            stock = getattr(item.product, 'stock_quantity', 0)
            if stock < 5:
                factors.append(f"Only {stock} left of {item.product.name}")
        
        if not factors:
            factors.append("Limited time offer - complete your purchase today!")
        
        return factors

# Global instance
smart_cart_service = SmartCartService()