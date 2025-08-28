import json
import os
import logging
from typing import Dict, List, Optional, Tuple
from datetime import datetime, timedelta
import google.generativeai as genai

logger = logging.getLogger(__name__)

class ProfessionalAIService:
    """Professional AI Shopping Assistant for Elara E-Commerce"""
    
    def __init__(self):
        self.api_key = "AIzaSyDEVfJYhLbe6NELrNZuJ63Hqj1rY-LBJto"
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Load product catalog
        self.products_file = os.path.join(os.path.dirname(__file__), '../../database/data/products.json')
        self.products = self._load_product_catalog()
        
        # Session management
        self.sessions = {}
        self.session_timeout = 1800  # 30 minutes
        
        # Category mapping
        self.categories = {
            1: {"name": "Beauty", "keywords": ["makeup", "beauty", "cosmetic", "mascara", "lipstick", "eyeshadow", "powder"]},
            2: {"name": "Fragrances", "keywords": ["perfume", "fragrance", "scent", "cologne", "eau de"]},
            3: {"name": "Furniture", "keywords": ["furniture", "bed", "chair", "table", "sofa", "desk"]}
        }
    
    def _load_product_catalog(self) -> List[Dict]:
        """Load and index complete product catalog"""
        try:
            with open(self.products_file, 'r', encoding='utf-8') as f:
                products = json.load(f)
            
            # Index products for intelligent search
            for product in products:
                product['search_index'] = self._create_search_index(product)
                product['price_tier'] = self._classify_price_tier(product['price'])
            
            logger.info(f"Loaded {len(products)} products into catalog")
            return products
        except Exception as e:
            logger.error(f"Failed to load product catalog: {e}")
            return []
    
    def _create_search_index(self, product: Dict) -> str:
        """Create comprehensive search index for product"""
        return " ".join([
            product['name'].lower(),
            product['description'].lower(),
            product.get('brand', '').lower(),
            str(product.get('category_id', '')),
            str(product.get('price', ''))
        ])
    
    def _classify_price_tier(self, price: float) -> str:
        """Classify product into price tiers"""
        if price < 20:
            return "budget"
        elif price < 100:
            return "mid-range"
        else:
            return "premium"
    
    def process_user_query(self, message: str, session_id: str, user_id: Optional[int] = None) -> Dict:
        """Main entry point for processing user queries"""
        try:
            # Clean and validate input
            message = message.strip()
            if not message:
                return self._get_default_response()
            
            # Get session context
            context = self._get_session_context(session_id)
            
            # Analyze user intent
            intent = self._analyze_intent(message, context)
            
            # Find relevant products
            products = self._find_relevant_products(message, intent)
            
            # Generate intelligent response
            response = self._generate_response(message, products, intent, context)
            
            # Update session
            self._update_session(session_id, message, response, products)
            
            return {
                "response": response["text"],
                "products": products[:3],  # Maximum 3 products
                "suggestions": response["suggestions"],
                "actions": response.get("actions", [])
            }
            
        except Exception as e:
            logger.error(f"Error processing query: {e}")
            return self._get_error_response()
    
    def _analyze_intent(self, message: str, context: Dict) -> Dict:
        """Analyze user intent from message and context"""
        message_lower = message.lower()
        
        intent = {
            "type": "general",
            "category": None,
            "price_focus": False,
            "comparison": False,
            "specific_product": False,
            "urgency": "normal"
        }
        
        # Detect category intent
        for cat_id, cat_info in self.categories.items():
            if any(keyword in message_lower for keyword in cat_info["keywords"]):
                intent["category"] = cat_id
                intent["type"] = "category_browse"
                break
        
        # Detect price-focused queries
        price_keywords = ["cheap", "affordable", "budget", "expensive", "price", "cost", "deal", "discount"]
        if any(keyword in message_lower for keyword in price_keywords):
            intent["price_focus"] = True
        
        # Detect comparison intent
        comparison_keywords = ["compare", "vs", "versus", "difference", "better", "best"]
        if any(keyword in message_lower for keyword in comparison_keywords):
            intent["comparison"] = True
        
        # Detect urgency
        urgent_keywords = ["urgent", "quickly", "asap", "immediately", "now"]
        if any(keyword in message_lower for keyword in urgent_keywords):
            intent["urgency"] = "high"
        
        return intent
    
    def _find_relevant_products(self, message: str, intent: Dict) -> List[Dict]:
        """Find products relevant to user query"""
        message_lower = message.lower()
        scored_products = []
        
        for product in self.products:
            score = 0
            
            # Category match (highest priority)
            if intent["category"] and product.get("category_id") == intent["category"]:
                score += 50
            
            # Name match
            if any(word in product["name"].lower() for word in message_lower.split()):
                score += 30
            
            # Brand match
            if product.get("brand") and product["brand"].lower() in message_lower:
                score += 25
            
            # Description match
            if any(word in product["description"].lower() for word in message_lower.split()):
                score += 15
            
            # Price tier preference
            if intent["price_focus"]:
                if "cheap" in message_lower or "budget" in message_lower:
                    if product["price_tier"] == "budget":
                        score += 20
                elif "premium" in message_lower or "luxury" in message_lower:
                    if product["price_tier"] == "premium":
                        score += 20
            
            # Rating boost for quality-focused queries
            if "best" in message_lower or "top" in message_lower:
                score += product.get("rating", 0) * 5
            
            if score > 0:
                product_copy = product.copy()
                product_copy["relevance_score"] = score
                scored_products.append(product_copy)
        
        # Sort by relevance and return top results
        scored_products.sort(key=lambda x: x["relevance_score"], reverse=True)
        return scored_products[:10]
    
    def _generate_response(self, message: str, products: List[Dict], intent: Dict, context: Dict) -> Dict:
        """Generate intelligent, concise response"""
        try:
            # Build context for AI
            context_str = self._build_ai_context(message, products, intent, context)
            
            # Generate response using Gemini
            prompt = f"""You are Elara's professional shopping assistant. Be concise, helpful, and direct.

Context: {context_str}

User Query: "{message}"

Guidelines:
- Maximum 25 words
- Be specific and actionable
- Professional but friendly tone
- Focus on helping the customer decide quickly

Response:"""

            response = self.model.generate_content(prompt)
            ai_text = response.text.strip()
            
            # Ensure response length
            words = ai_text.split()
            if len(words) > 25:
                ai_text = " ".join(words[:25]) + "..."
            
            # Generate intelligent suggestions
            suggestions = self._generate_smart_suggestions(message, products, intent)
            
            # Generate actionable items
            actions = self._generate_actions(products, intent)
            
            return {
                "text": ai_text,
                "suggestions": suggestions,
                "actions": actions
            }
            
        except Exception as e:
            logger.error(f"Response generation error: {e}")
            return self._get_fallback_response(products, intent)
    
    def _build_ai_context(self, message: str, products: List[Dict], intent: Dict, context: Dict) -> str:
        """Build context string for AI"""
        context_parts = []
        
        if products:
            context_parts.append(f"Found {len(products)} relevant products")
            if products[0].get("category_id"):
                cat_name = self.categories.get(products[0]["category_id"], {}).get("name", "")
                if cat_name:
                    context_parts.append(f"Category: {cat_name}")
        
        if intent["price_focus"]:
            context_parts.append("Price-focused query")
        
        if context.get("recent_products"):
            context_parts.append("Continuing previous conversation")
        
        return ". ".join(context_parts)
    
    def _generate_smart_suggestions(self, message: str, products: List[Dict], intent: Dict) -> List[str]:
        """Generate contextually relevant suggestions"""
        suggestions = []
        message_lower = message.lower()
        
        if intent["category"]:
            cat_name = self.categories.get(intent["category"], {}).get("name", "")
            if cat_name:
                suggestions.extend([f"Browse {cat_name}", f"Top {cat_name}", f"{cat_name} Deals"])
        
        if products:
            suggestions.append(f"View {products[0]['name'][:20]}...")
            if len(products) > 1:
                suggestions.append("Compare Options")
        
        if intent["price_focus"]:
            suggestions.extend(["View Deals", "Filter by Price", "Budget Options"])
        else:
            suggestions.extend(["Best Sellers", "New Arrivals", "Customer Favorites"])
        
        # Limit to 4 suggestions
        return suggestions[:4]
    
    def _generate_actions(self, products: List[Dict], intent: Dict) -> List[Dict]:
        """Generate actionable items for the user"""
        actions = []
        
        if products:
            actions.append({
                "type": "view_product",
                "product_id": products[0]["id"],
                "label": f"View {products[0]['name'][:30]}..."
            })
            
            actions.append({
                "type": "add_to_cart",
                "product_id": products[0]["id"],
                "label": "Add to Cart"
            })
        
        if intent["category"]:
            actions.append({
                "type": "browse_category",
                "category_id": intent["category"],
                "label": f"Browse {self.categories[intent['category']]['name']}"
            })
        
        return actions[:3]  # Maximum 3 actions
    
    def _get_session_context(self, session_id: str) -> Dict:
        """Get conversation context for session"""
        if session_id not in self.sessions:
            return {}
        
        session = self.sessions[session_id]
        
        # Check if session expired
        if datetime.now() - session["created_at"] > timedelta(seconds=self.session_timeout):
            del self.sessions[session_id]
            return {}
        
        return {
            "recent_messages": session["messages"][-3:],
            "recent_products": session.get("recent_products", []),
            "preferences": session.get("preferences", {})
        }
    
    def _update_session(self, session_id: str, message: str, response: Dict, products: List[Dict]):
        """Update session with new interaction"""
        if session_id not in self.sessions:
            self.sessions[session_id] = {
                "messages": [],
                "recent_products": [],
                "preferences": {},
                "created_at": datetime.now()
            }
        
        session = self.sessions[session_id]
        session["messages"].append({
            "user": message,
            "ai": response["text"],
            "timestamp": datetime.now()
        })
        
        if products:
            session["recent_products"] = products[:3]
        
        # Keep only last 10 messages
        if len(session["messages"]) > 10:
            session["messages"] = session["messages"][-10:]
    
    def _get_default_response(self) -> Dict:
        """Default response for empty queries"""
        return {
            "response": "How can I help you find the perfect product today?",
            "products": self.products[:3],  # Show trending products
            "suggestions": ["Browse Categories", "View Deals", "Best Sellers", "New Arrivals"],
            "actions": []
        }
    
    def _get_error_response(self) -> Dict:
        """Error response"""
        return {
            "response": "I'm having trouble right now. Please try again.",
            "products": [],
            "suggestions": ["Browse Products", "View Categories", "Contact Support"],
            "actions": []
        }
    
    def _get_fallback_response(self, products: List[Dict], intent: Dict) -> Dict:
        """Fallback response when AI generation fails"""
        if products:
            text = f"Found {len(products)} products for you. Check out {products[0]['name']}."
        else:
            text = "Let me help you find what you're looking for."
        
        return {
            "text": text,
            "suggestions": ["Browse Categories", "View Deals", "Best Sellers"],
            "actions": []
        }
    
    def cleanup_expired_sessions(self):
        """Clean up expired sessions"""
        now = datetime.now()
        expired = [
            sid for sid, session in self.sessions.items()
            if now - session["created_at"] > timedelta(seconds=self.session_timeout)
        ]
        
        for sid in expired:
            del self.sessions[sid]
        
        if expired:
            logger.info(f"Cleaned up {len(expired)} expired sessions")

# Global instance
professional_ai_service = ProfessionalAIService()