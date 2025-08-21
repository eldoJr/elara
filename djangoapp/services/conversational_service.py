from typing import List, Dict, Any, Optional
from django.contrib.auth.models import User
from ..models import Product, UserBehavior, ConversationHistory
from .ai_service import ai_service
import logging

logger = logging.getLogger(__name__)

class ConversationalShoppingService:
    
    def create_shopping_list(self, user_id: int, items: List[str]) -> Dict:
        """Create AI-powered shopping list with product suggestions"""
        try:
            # Generate AI suggestions for shopping list items
            suggestions_prompt = f"""
            User wants to create a shopping list with these items: {', '.join(items)}
            Suggest specific products and quantities for an e-commerce platform.
            Format as a structured shopping list with categories.
            """
            
            ai_suggestions = ai_service.chat_completion([
                {'role': 'system', 'content': 'You are a helpful shopping assistant.'},
                {'role': 'user', 'content': suggestions_prompt}
            ])
            
            # Track behavior
            UserBehavior.objects.create(
                user_id=user_id,
                action='SHOPPING_LIST_CREATE',
                metadata={'items': items, 'ai_suggestions': ai_suggestions}
            )
            
            return {
                'original_items': items,
                'ai_suggestions': ai_suggestions,
                'status': 'success'
            }
            
        except Exception as e:
            logger.error(f"Shopping list creation error: {str(e)}")
            return {'status': 'error', 'message': str(e)}
    
    def get_shopping_journey_guidance(self, user_id: int, intent: str) -> Dict:
        """Provide personalized shopping journey guidance"""
        try:
            # Get user's recent behavior
            recent_behaviors = UserBehavior.objects.filter(
                user_id=user_id
            ).order_by('-timestamp')[:10]
            
            behavior_context = [
                f"{b.action}: {b.product.name if b.product else 'N/A'}"
                for b in recent_behaviors
            ]
            
            guidance_prompt = f"""
            User intent: {intent}
            Recent shopping behavior: {'; '.join(behavior_context)}
            
            Provide personalized shopping guidance including:
            1. Recommended next steps
            2. Product categories to explore
            3. Budget considerations
            4. Timing suggestions
            """
            
            guidance = ai_service.chat_completion([
                {'role': 'system', 'content': 'You are an expert shopping advisor.'},
                {'role': 'user', 'content': guidance_prompt}
            ])
            
            return {
                'guidance': guidance,
                'user_intent': intent,
                'status': 'success'
            }
            
        except Exception as e:
            logger.error(f"Shopping guidance error: {str(e)}")
            return {'status': 'error', 'message': str(e)}
    
    def handle_voice_query(self, user_id: int, voice_text: str) -> Dict:
        """Process voice-to-text shopping queries"""
        try:
            # Get products for context
            products = Product.objects.filter(is_active=True)[:20]
            products_data = [
                f"{p.name} - ${p.price} ({p.category.name if p.category else 'Uncategorized'})"
                for p in products
            ]
            
            voice_prompt = f"""
            Voice query: "{voice_text}"
            Available products: {'; '.join(products_data[:10])}
            
            Interpret this voice query and provide:
            1. What the user is looking for
            2. Relevant product recommendations
            3. Follow-up questions to clarify needs
            """
            
            response = ai_service.chat_completion([
                {'role': 'system', 'content': 'You are a voice shopping assistant.'},
                {'role': 'user', 'content': voice_prompt}
            ])
            
            # Track voice interaction
            UserBehavior.objects.create(
                user_id=user_id,
                action='VOICE_QUERY',
                metadata={'voice_text': voice_text, 'response': response}
            )
            
            return {
                'voice_text': voice_text,
                'ai_response': response,
                'status': 'success'
            }
            
        except Exception as e:
            logger.error(f"Voice query error: {str(e)}")
            return {'status': 'error', 'message': str(e)}
    
    def get_product_cards_for_chat(self, product_names: List[str]) -> List[Dict]:
        """Get product cards for chat interface"""
        try:
            products = []
            for name in product_names:
                product_matches = Product.objects.filter(
                    name__icontains=name,
                    is_active=True
                )[:3]
                
                for product in product_matches:
                    products.append({
                        'id': product.id,
                        'name': product.name,
                        'price': float(product.price),
                        'image': getattr(product, 'image_url', ''),
                        'category': product.category.name if product.category else '',
                        'description': product.description[:100] + '...' if len(product.description) > 100 else product.description
                    })
            
            return products[:6]  # Limit to 6 cards
            
        except Exception as e:
            logger.error(f"Product cards error: {str(e)}")
            return []

# Global instance
conversational_service = ConversationalShoppingService()