import requests
import json
from typing import List, Dict, Any
from django.conf import settings
import logging

try:
    import numpy as np
    from sklearn.metrics.pairwise import cosine_similarity
    HAS_ML_LIBS = True
except ImportError:
    HAS_ML_LIBS = False

logger = logging.getLogger(__name__)

class SemanticSearchService:
    def __init__(self):
        self.api_key = getattr(settings, 'DEEPSEEK_API_KEY', '')
        self.base_url = 'https://api.deepseek.com/v1'
        self.headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        }
    
    def get_text_embedding(self, text: str) -> List[float]:
        """Generate embeddings for text using DeepSeek API"""
        try:
            payload = {
                'model': 'deepseek-chat',
                'messages': [
                    {'role': 'system', 'content': 'Generate a semantic representation of this text for search purposes.'},
                    {'role': 'user', 'content': f'Text: {text}'}
                ],
                'max_tokens': 100
            }
            
            response = requests.post(
                f'{self.base_url}/chat/completions',
                headers=self.headers,
                json=payload,
                timeout=10
            )
            
            if response.status_code == 200:
                # Simulate embedding generation (in production, use proper embedding API)
                return [hash(text + str(i)) % 1000 / 1000.0 for i in range(384)]
            return []
            
        except Exception as e:
            logger.error(f"Embedding generation error: {str(e)}")
            return []
    
    def semantic_search(self, query: str, products: List[Dict]) -> List[Dict]:
        """Perform semantic search on products"""
        if not products:
            return []
        
        # Generate query embedding
        query_embedding = self.get_text_embedding(query)
        if not query_embedding:
            return self._fallback_search(query, products)
        
        # Calculate similarities
        scored_products = []
        for product in products:
            product_text = f"{product.get('name', '')} {product.get('description', '')} {product.get('category', '')}"
            product_embedding = self.get_text_embedding(product_text)
            
            if product_embedding:
                similarity = self._calculate_similarity(query_embedding, product_embedding)
                scored_products.append({
                    **product,
                    'similarity_score': similarity
                })
        
        # Sort by similarity and return top results
        return sorted(scored_products, key=lambda x: x.get('similarity_score', 0), reverse=True)[:20]
    
    def _calculate_similarity(self, embedding1: List[float], embedding2: List[float]) -> float:
        """Calculate cosine similarity between embeddings"""
        if not HAS_ML_LIBS:
            return 0.5  # Default similarity
        try:
            arr1 = np.array(embedding1).reshape(1, -1)
            arr2 = np.array(embedding2).reshape(1, -1)
            return cosine_similarity(arr1, arr2)[0][0]
        except:
            return 0.0
    
    def _fallback_search(self, query: str, products: List[Dict]) -> List[Dict]:
        """Fallback to basic text search"""
        query_lower = query.lower()
        results = []
        
        for product in products:
            score = 0
            name = product.get('name', '').lower()
            description = product.get('description', '').lower()
            category = product.get('category', '').lower()
            
            if query_lower in name:
                score += 3
            elif any(word in name for word in query_lower.split()):
                score += 2
            
            if query_lower in description:
                score += 2
            elif any(word in description for word in query_lower.split()):
                score += 1
            
            if query_lower in category:
                score += 1
            
            if score > 0:
                results.append({**product, 'similarity_score': score})
        
        return sorted(results, key=lambda x: x.get('similarity_score', 0), reverse=True)[:20]
    
    def generate_search_suggestions(self, query: str) -> List[str]:
        """Generate intelligent search suggestions"""
        try:
            payload = {
                'model': 'deepseek-chat',
                'messages': [
                    {'role': 'system', 'content': 'Generate 5 related search suggestions for e-commerce based on the user query.'},
                    {'role': 'user', 'content': f'Query: {query}'}
                ],
                'max_tokens': 200
            }
            
            response = requests.post(
                f'{self.base_url}/chat/completions',
                headers=self.headers,
                json=payload,
                timeout=10
            )
            
            if response.status_code == 200:
                suggestions_text = response.json()['choices'][0]['message']['content']
                # Parse suggestions from response
                suggestions = [s.strip() for s in suggestions_text.split('\n') if s.strip() and not s.startswith('#')]
                return suggestions[:5]
            
        except Exception as e:
            logger.error(f"Search suggestions error: {str(e)}")
        
        return []

# Global instance
search_service = SemanticSearchService()