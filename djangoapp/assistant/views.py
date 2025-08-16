from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Conversation, Message
from .serializers import ConversationSerializer
from djangoapp.products.models import Product

class ConversationListView(generics.ListAPIView):
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Conversation.objects.filter(user=self.request.user)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def chat(request):
    message_content = request.data.get('message', '')
    conversation_id = request.data.get('conversation_id')
    
    # Get or create conversation
    if conversation_id:
        conversation = Conversation.objects.get(id=conversation_id, user=request.user)
    else:
        conversation = Conversation.objects.create(
            user=request.user,
            title=message_content[:50] + '...' if len(message_content) > 50 else message_content
        )
    
    # Save user message
    Message.objects.create(
        conversation=conversation,
        role='user',
        content=message_content
    )
    
    # Simple AI response (replace with actual AI integration)
    ai_response = generate_ai_response(message_content)
    
    # Save AI response
    Message.objects.create(
        conversation=conversation,
        role='assistant',
        content=ai_response
    )
    
    return Response(ConversationSerializer(conversation).data)

def generate_ai_response(user_message):
    # Simple rule-based responses (replace with actual AI)
    user_message = user_message.lower()
    
    if 'product' in user_message or 'buy' in user_message:
        products = Product.objects.filter(is_active=True)[:3]
        if products:
            product_names = ', '.join([p.name for p in products])
            return f"I recommend these products: {product_names}. Would you like more details about any of them?"
    
    if 'hello' in user_message or 'hi' in user_message:
        return "Hello! I'm your AI shopping assistant. How can I help you find the perfect product today?"
    
    if 'help' in user_message:
        return "I can help you find products, compare prices, and answer questions about our inventory. What are you looking for?"
    
    return "I understand you're interested in shopping. Let me help you find what you need. Could you tell me more about what you're looking for?"
