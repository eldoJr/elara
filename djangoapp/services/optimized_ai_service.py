import google.generativeai as genai
import logging
from typing import Dict, List
from .optimized_product_service import product_service
from .conversation_manager import conversation_manager

logger = logging.getLogger(__name__)

class OptimizedAIService:
    def __init__(self):
        self.api_key = "AIzaSyDEVfJYhLbe6NELrNZuJ63Hqj1rY-LBJto"
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')
    
    def generate_concise_response(self, user_query: str, session_id: str) -> Dict:
        """Generate concise AI response with products and suggestions"""
        try:
            # Get relevant products
            products = product_service.get_by_intent(user_query)
            
            # Get conversation context
            context = conversation_manager.get_context(session_id)
            
            # Generate AI response
            ai_text = self._generate_short_response(user_query, products, context)
            
            # Generate smart suggestions
            suggestions = self._generate_suggestions(user_query, products)
            
            # Prepare response
            response = {
                'text': ai_text,
                'products': products[:3],  # Max 3 products
                'suggestions': suggestions
            }
            
            # Save to conversation history
            conversation_manager.add_message(session_id, user_query, ai_text)
            conversation_manager.set_last_products(session_id, products[:3])
            
            return response
            
        except Exception as e:
            logger.error(f"AI response generation error: {e}")
            return {
                'text': "Desculpe, tive um problema. Pode tentar novamente?",
                'products': [],
                'suggestions': ["Ver produtos", "Categorias", "Ofertas"]
            }
    
    def _generate_short_response(self, user_query: str, products: List[Dict], context: Dict) -> str:
        """Generate short, contextual response"""
        try:
            # Build context string
            context_str = ""
            if context.get('recent_context'):
                last_messages = context['recent_context'][-2:]
                context_str = f"Conversa anterior: {last_messages}"
            
            # Build products summary
            products_summary = ""
            if products:
                products_summary = f"Encontrei {len(products)} produtos relevantes: {products[0]['name']}"
                if len(products) > 1:
                    products_summary += f" e mais {len(products)-1} itens"
            
            prompt = f"""
Você é um assistente de compras amigável e direto.

{context_str}

Usuário perguntou: "{user_query}"
{products_summary}

REGRAS IMPORTANTES:
- Responda em máximo 2 frases curtas (máximo 40 palavras)
- Seja útil e específico
- Use linguagem casual e brasileira
- Se encontrou produtos, mencione brevemente
- Se é continuação da conversa, seja natural

Resposta:
"""
            
            response = self.model.generate_content(prompt)
            ai_text = response.text.strip()
            
            # Limit response length
            words = ai_text.split()
            if len(words) > 40:
                ai_text = ' '.join(words[:40]) + "..."
            
            return ai_text
            
        except Exception as e:
            logger.error(f"Short response generation error: {e}")
            if products:
                return f"Encontrei {len(products)} produtos para você! Dá uma olhada."
            else:
                return "Posso te ajudar a encontrar o que precisa. O que está procurando?"
    
    def _generate_suggestions(self, user_query: str, products: List[Dict]) -> List[str]:
        """Generate smart suggestions based on query and products"""
        query_lower = user_query.lower()
        
        # Query-based suggestions
        if any(word in query_lower for word in ['preço', 'barato', 'desconto', 'promoção']):
            return ["Ver ofertas", "Produtos em promoção", "Filtrar por preço", "Mais baratos"]
        
        elif any(word in query_lower for word in ['categoria', 'tipo', 'seção']):
            return ["Beauty", "Fragrâncias", "Móveis", "Ver todas"]
        
        elif any(word in query_lower for word in ['melhor', 'top', 'recomenda']):
            return ["Mais vendidos", "Melhor avaliados", "Trending", "Favoritos"]
        
        elif products:
            suggestions = []
            if len(products) > 0:
                suggestions.append(f"Ver {products[0]['name'][:20]}...")
            suggestions.extend(["Produtos similares", "Comparar preços", "Ver categoria"])
            return suggestions
        
        else:
            return ["Ver categorias", "Produtos populares", "Ofertas do dia", "Ajuda"]

# Global instance
optimized_ai_service = OptimizedAIService()