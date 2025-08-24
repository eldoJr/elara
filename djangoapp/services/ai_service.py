import json
import logging
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)

try:
    from transformers import pipeline
    HAS_TRANSFORMERS = True
except ImportError:
    HAS_TRANSFORMERS = False

class LocalAIService:
    def __init__(self):
        self.generator = None
        if HAS_TRANSFORMERS:
            try:
                self.generator = pipeline('text-generation', model='microsoft/DialoGPT-small')
            except Exception as e:
                logger.warning(f"Failed to load AI model: {e}")
                self.generator = None
    
    def generate_response(self, prompt: str, max_length: int = 100) -> str:
        """Generate AI response using local model"""
        if not self.generator:
            return self._generate_fallback_response(prompt, [], None)
        
        try:
            response = self.generator(prompt, max_length=max_length, num_return_sequences=1, pad_token_id=50256)
            generated_text = response[0]['generated_text']
            # Extract only the new part after the prompt
            if len(generated_text) > len(prompt):
                return generated_text[len(prompt):].strip()
            return "I'm here to help you with your shopping needs!"
        except Exception as e:
            logger.error(f"Local AI error: {e}")
            return self._generate_fallback_response(prompt, [], None)
    
    def generate_product_recommendations(self, user_context: Dict[str, Any], products: List[Dict]) -> str:
        """Generate personalized product recommendations"""
        system_prompt = """You are an AI shopping assistant for Elara e-commerce platform. 
        Analyze the user's context and recommend relevant products from the available catalog.
        Provide helpful, personalized recommendations with brief explanations."""
        
        user_prompt = f"""
        User Context: {json.dumps(user_context)}
        Available Products: {json.dumps(products[:10])}  # Limit for API efficiency
        
        Please recommend 3-5 products that would be most relevant to this user and explain why.
        """
        
        messages = [
            {'role': 'system', 'content': system_prompt},
            {'role': 'user', 'content': user_prompt}
        ]
        
        return self.chat_completion(messages)
    
    def process_shopping_query(self, query: str, products: List[Dict], user_context: Optional[Dict] = None) -> str:
        """Process natural language shopping queries with intelligent fallback"""
        # Try local AI first
        if self.generator:
            try:
                context = f"User: {user_context.get('username', 'Customer')} is shopping. Products available: {', '.join([p['name'] for p in products[:5]])}."
                prompt = f"{context}\nCustomer: {query}\nAssistant:"
                response = self.generate_response(prompt, max_length=150)
                if response and len(response) > 10:
                    return response
            except Exception as e:
                logger.error(f"Local AI failed: {e}")
        
        # Fallback to intelligent responses
        return self._generate_fallback_response(query, products, user_context)
    
    def _generate_fallback_response(self, query: str, products: List[Dict], user_context: Optional[Dict] = None) -> str:
        """Generate intelligent fallback responses when API is unavailable"""
        query_lower = query.lower()
        
        # Category-specific queries (check these first)
        if any(word in query_lower for word in ['electronic', 'electronics', 'phone', 'laptop', 'laptops', 'computer', 'tech', 'smartphone', 'tablet']):
            electronics = [p for p in products if 'electronic' in p.get('category', '').lower() or any(item in p.get('name', '').lower() for item in ['phone', 'laptop', 'computer', 'tv', 'iphone', 'samsung', 'apple'])]
            if electronics:
                return f"Perfect! I found {len(electronics)} electronics for you: {', '.join([f"{p['name']} (${p['price']})" for p in electronics[:5]])}. What specific type interests you?"
            return "We have amazing electronics! Smartphones, laptops, tablets, TVs, and more. What specific device are you looking for?"
        
        # Clothing queries (check for 'need clothing' patterns)
        if any(phrase in query_lower for phrase in ['clothing', 'clothes', 'shirt', 'pants', 'dress', 'shoes', 'apparel', 'fashion', 'need clothing', 'want clothes']):
            clothing_items = [p for p in products if any(cat in p.get('category', '').lower() for cat in ['clothing', 'apparel', 'fashion']) or any(item in p.get('name', '').lower() for item in ['shirt', 'pants', 'dress', 'shoes', 'nike'])]
            if clothing_items:
                return f"Perfect! I found {len(clothing_items)} clothing items for you. Check out: {', '.join([p['name'] for p in clothing_items[:3]])}. Browse our clothing section for more options!"
            return "Our clothing collection has something for everyone! From casual wear to formal attire, we offer a wide range of styles and sizes. Check out our men's, women's, and children's clothing sections."
        
        # Home goods queries
        if any(word in query_lower for word in ['home', 'furniture', 'kitchen', 'decor']):
            home_items = [p for p in products if any(cat in p.get('category', '').lower() for cat in ['home', 'kitchen', 'furniture']) or any(item in p.get('name', '').lower() for item in ['coffee', 'maker', 'table', 'chair'])]
            if home_items:
                return f"Perfect for your home! I found {len(home_items)} home items. Check out: {', '.join([p['name'] for p in home_items[:3]])}. Browse our home section for more!"
            return "Transform your living space with our home goods collection! We have furniture, decor, kitchen essentials, and everything you need to make your house a home."
        
        # Recommendation queries (check before general search)
        if any(phrase in query_lower for phrase in ['recommend', 'suggest', 'what do you have', 'show me']):
            if products:
                top_products = products[:3]
                return f"Based on our popular items, I'd recommend checking out: {', '.join([p['name'] for p in top_products])}. These are some of our customer favorites!"
            return "I'd be happy to recommend products! Browse our trending items or check out our customer favorites in each category."
        
        # Product search queries
        if any(word in query_lower for word in ['looking for', 'need', 'want', 'search', 'find']):
            # Check if it's a specific product search
            if any(tech in query_lower for tech in ['electronic', 'electronics', 'laptop', 'phone', 'computer']):
                electronics = [p for p in products if 'electronic' in p.get('category', '').lower() or any(item in p.get('name', '').lower() for item in ['phone', 'laptop', 'computer', 'tv', 'iphone'])]
                if electronics:
                    return f"Great! I found {len(electronics)} electronics: {', '.join([f"{p['name']} (${p['price']})" for p in electronics[:3]])}. Which one interests you?"
            if products:
                return f"I'd love to help! We have {len(products)} products. What category interests you: electronics, clothing, or home goods?"
            return "I'm here to help you find exactly what you need! What are you shopping for?"
        
        # Greeting responses
        if any(word in query_lower for word in ['hello', 'hi', 'hey', 'good morning', 'good afternoon']):
            username = user_context.get('username', '') if user_context else ''
            greeting = f"Hello {username}! " if username else "Hello! "
            return f"{greeting}Welcome to Elara! I'm here to help you find the perfect products. You can browse our categories like electronics, clothing, home goods, and more. What are you looking for today?"
        
        # Default helpful response
        return "I'm your AI shopping assistant! I can help you find products, answer questions about items, and guide you through our catalog. Try asking about specific categories like electronics, clothing, or home goods, or let me know what you're shopping for today!"

# Global instance
ai_service = LocalAIService()