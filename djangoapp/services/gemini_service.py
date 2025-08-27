import json
import logging
from typing import List, Dict, Any, Optional
import google.generativeai as genai
from django.contrib.auth.models import User
from ..models import Product, Category, UserBehavior

logger = logging.getLogger(__name__)

class GeminiEnhancedService:
    def __init__(self):
        self.api_key = "AIzaSyDEVfJYhLbe6NELrNZuJ63Hqj1rY-LBJto"
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')
    
    def generate_product_descriptions(self, product_name: str, category: str, features: List[str]) -> str:
        """Generate enhanced product descriptions using Gemini"""
        try:
            prompt = f"""Create an engaging product description for:
            Product: {product_name}
            Category: {category}
            Key Features: {', '.join(features)}
            
            Write a compelling 2-3 sentence description that highlights benefits and appeals to customers."""
            
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            logger.error(f"Product description generation error: {e}")
            return f"High-quality {product_name} with excellent features and great value."
    
    def analyze_customer_sentiment(self, reviews: List[str]) -> Dict[str, Any]:
        """Analyze customer sentiment from reviews"""
        try:
            prompt = f"""Analyze the sentiment of these customer reviews:
            {json.dumps(reviews, indent=2)}
            
            Provide:
            1. Overall sentiment (positive/negative/neutral)
            2. Key themes mentioned
            3. Improvement suggestions
            4. Sentiment score (1-10)
            
            Format as JSON."""
            
            response = self.model.generate_content(prompt)
            return {"analysis": response.text, "status": "success"}
        except Exception as e:
            logger.error(f"Sentiment analysis error: {e}")
            return {"analysis": "Sentiment analysis unavailable", "status": "error"}
    
    def generate_marketing_content(self, product: Dict, target_audience: str) -> Dict[str, str]:
        """Generate marketing content for products"""
        try:
            prompt = f"""Create marketing content for:
            Product: {product.get('name')}
            Price: ${product.get('price')}
            Category: {product.get('category')}
            Target Audience: {target_audience}
            
            Generate:
            1. Catchy headline (max 10 words)
            2. Social media post (max 280 chars)
            3. Email subject line
            4. Product tagline
            
            Format as JSON with headline, social_post, email_subject, tagline fields."""
            
            response = self.model.generate_content(prompt)
            return {"content": response.text, "status": "success"}
        except Exception as e:
            logger.error(f"Marketing content generation error: {e}")
            return {
                "content": json.dumps({
                    "headline": f"Amazing {product.get('name')}",
                    "social_post": f"Check out our {product.get('name')} - great quality at ${product.get('price')}!",
                    "email_subject": f"New: {product.get('name')} Available Now",
                    "tagline": f"Quality {product.get('name')} for Everyone"
                }),
                "status": "fallback"
            }
    
    def personalized_shopping_assistant(self, user_query: str, user_context: Dict, products: List[Dict]) -> str:
        """Advanced personalized shopping assistance"""
        try:
            prompt = f"""You are an expert shopping assistant for Elara e-commerce platform.
            
            User Query: "{user_query}"
            
            User Context:
            - Username: {user_context.get('username', 'Customer')}
            - Recent Actions: {user_context.get('recent_actions', [])}
            - Preferences: {user_context.get('preferences', {})}
            
            Available Products (top 10):
            {json.dumps(products[:10], indent=2)}
            
            Provide a helpful, personalized response that:
            1. Addresses their specific query
            2. Recommends relevant products with reasons
            3. Suggests complementary items
            4. Offers helpful shopping tips
            
            Keep response conversational and under 200 words."""
            
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            logger.error(f"Personalized assistant error: {e}")
            return "I'm here to help with your shopping! Let me know what you're looking for."
    
    def generate_bundle_suggestions(self, product_id: int) -> List[Dict]:
        """Generate smart product bundles using AI"""
        try:
            product = Product.objects.get(id=product_id)
            related_products = Product.objects.filter(
                category=product.category,
                is_active=True
            ).exclude(id=product_id)[:10]
            
            products_data = [{
                'id': p.id,
                'name': p.name,
                'price': float(p.price),
                'category': p.category.name if p.category else ''
            } for p in related_products]
            
            prompt = f"""Create smart product bundles for:
            Main Product: {product.name} (${product.price})
            Category: {product.category.name if product.category else 'General'}
            
            Related Products: {json.dumps(products_data, indent=2)}
            
            Suggest 3 bundles with:
            1. Bundle name
            2. Products included (2-4 items)
            3. Total savings
            4. Target customer type
            
            Format as JSON array."""
            
            response = self.model.generate_content(prompt)
            return {"bundles": response.text, "status": "success"}
        except Exception as e:
            logger.error(f"Bundle generation error: {e}")
            return {"bundles": "[]", "status": "error"}
    
    def smart_search_enhancement(self, search_query: str, search_results: List[Dict]) -> Dict[str, Any]:
        """Enhance search results with AI insights"""
        try:
            prompt = f"""Enhance these search results for query: "{search_query}"
            
            Search Results: {json.dumps(search_results[:5], indent=2)}
            
            Provide:
            1. Search intent analysis
            2. Alternative search suggestions
            3. Filter recommendations
            4. Related categories to explore
            
            Format as JSON with intent, suggestions, filters, categories fields."""
            
            response = self.model.generate_content(prompt)
            return {"enhancement": response.text, "status": "success"}
        except Exception as e:
            logger.error(f"Search enhancement error: {e}")
            return {"enhancement": "{}", "status": "error"}
    
    def generate_faq_responses(self, product: Dict, common_questions: List[str]) -> Dict[str, str]:
        """Generate FAQ responses for products"""
        try:
            prompt = f"""Generate helpful FAQ responses for:
            Product: {product.get('name')}
            Description: {product.get('description', '')}
            Price: ${product.get('price')}
            
            Questions: {json.dumps(common_questions)}
            
            Provide clear, helpful answers for each question.
            Format as JSON with question-answer pairs."""
            
            response = self.model.generate_content(prompt)
            return {"faq": response.text, "status": "success"}
        except Exception as e:
            logger.error(f"FAQ generation error: {e}")
            return {"faq": "{}", "status": "error"}

# Global instance
gemini_service = GeminiEnhancedService()