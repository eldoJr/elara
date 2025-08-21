import requests
import json
import logging
from django.conf import settings
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)

class DeepSeekAIService:
    def __init__(self):
        self.api_key = getattr(settings, 'DEEPSEEK_API_KEY', '')
        self.base_url = 'https://api.deepseek.com/v1'
        self.headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        }
    
    def chat_completion(self, messages: List[Dict[str, str]], max_tokens: int = 1000) -> str:
        """Generate chat completion using DeepSeek API"""
        try:
            payload = {
                'model': 'deepseek-chat',
                'messages': messages,
                'max_tokens': max_tokens,
                'temperature': 0.7
            }
            
            response = requests.post(
                f'{self.base_url}/chat/completions',
                headers=self.headers,
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                return data['choices'][0]['message']['content']
            else:
                logger.error(f"DeepSeek API error: {response.status_code} - {response.text}")
                return "I'm sorry, I'm having trouble processing your request right now."
                
        except Exception as e:
            logger.error(f"DeepSeek API exception: {str(e)}")
            return "I'm sorry, I'm having trouble processing your request right now."
    
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
        """Process natural language shopping queries"""
        system_prompt = """You are an AI shopping assistant for Elara e-commerce platform.
        Help users find products, answer questions about items, and provide shopping advice.
        Be helpful, friendly, and focus on the user's needs."""
        
        context_info = f"User context: {json.dumps(user_context)}" if user_context else ""
        products_info = f"Available products: {json.dumps(products[:15])}"
        
        user_prompt = f"""
        User query: {query}
        {context_info}
        {products_info}
        
        Please help the user with their shopping query. If they're looking for specific products,
        recommend relevant items from the catalog with explanations.
        """
        
        messages = [
            {'role': 'system', 'content': system_prompt},
            {'role': 'user', 'content': user_prompt}
        ]
        
        return self.chat_completion(messages)

# Global instance
ai_service = DeepSeekAIService()