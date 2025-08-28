import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Mic, ShoppingCart, Eye, Package, Clock, CheckCircle, AlertCircle, Zap, Star, TrendingUp } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { useCart } from '../../contexts/CartContext';
import { chatService, ChatMessage, Product, ChatAction } from '../../services/chatService';
import EnhancedChatProductCard from './EnhancedChatProductCard';

interface ProfessionalChatProps {
  hideHeader?: boolean;
  className?: string;
}

const ProfessionalChat: React.FC<ProfessionalChatProps> = ({ hideHeader = false, className = '' }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Welcome to Elara! I'm your personal shopping assistant. How can I help you find the perfect products today?",
      isUser: false,
      timestamp: new Date(),
      suggestions: ['Browse Beauty', 'Find Deals', 'Trending Now', 'New Arrivals'],
      status: 'delivered'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(() => Math.random().toString(36).substr(2, 9));
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();
  const { addToCart } = useCart();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const messageText = text || inputMessage;
    if (!messageText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
      timestamp: new Date(),
      status: 'sending'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const aiMessage = await chatService.sendMessage(messageText);
      
      // Update user message status
      setMessages(prev => prev.map(msg => 
        msg.id === userMessage.id ? { ...msg, status: 'delivered' } : msg
      ));
      
      // Realistic typing delay
      const typingDelay = Math.min(Math.max(aiMessage.text.length * 40, 1000), 2500);
      
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { ...aiMessage, status: 'delivered' }]);
      }, typingDelay);

    } catch (error) {
      console.error('AI chat error:', error);
      setIsTyping(false);
      showToast('Connection issue. Please try again.', 'error');
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "I'm experiencing technical difficulties. Please try again or browse our products directly.",
        isUser: false,
        timestamp: new Date(),
        suggestions: ['Browse Products', 'View Categories', 'Contact Support']
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const handleAction = async (action: ChatAction) => {
    try {
      switch (action.type) {
        case 'add_to_cart':
          if (action.product_id) {
            await addToCart(action.product_id, 1);
            showToast('Added to cart successfully!', 'success');
          }
          break;
        case 'view_product':
          if (action.product_id) {
            window.open(`/products/${action.product_id}`, '_blank');
          }
          break;
        case 'browse_category':
          if (action.category_id) {
            window.open(`/products?category=${action.category_id}`, '_blank');
          }
          break;
      }
    } catch (error) {
      showToast('Action failed. Please try again.', 'error');
    }
  };

  const handleQuickFeedback = (messageId: string, isHelpful: boolean) => {
    showToast(isHelpful ? 'Thanks for your feedback!' : 'We\'ll improve our responses', 'info');
  };

  const getSmartSuggestions = () => {
    const timeOfDay = new Date().getHours();
    const isEvening = timeOfDay >= 18;
    const isMorning = timeOfDay < 12;
    
    if (isMorning) {
      return [
        { icon: <Zap className="w-4 h-4" />, label: 'Daily Deals', query: 'Show me today\'s best deals' },
        { icon: <TrendingUp className="w-4 h-4" />, label: 'Trending', query: 'What\'s trending now?' },
        { icon: <Star className="w-4 h-4" />, label: 'Beauty', query: 'Browse beauty products' }
      ];
    } else if (isEvening) {
      return [
        { icon: <Package className="w-4 h-4" />, label: 'New Arrivals', query: 'Show me new arrivals' },
        { icon: <Star className="w-4 h-4" />, label: 'Fragrances', query: 'Browse fragrances' },
        { icon: <ShoppingCart className="w-4 h-4" />, label: 'My Cart', query: 'Check my cart status' }
      ];
    } else {
      return [
        { icon: <TrendingUp className="w-4 h-4" />, label: 'Popular', query: 'Show popular products' },
        { icon: <Zap className="w-4 h-4" />, label: 'Flash Sale', query: 'Current flash sales' },
        { icon: <Package className="w-4 h-4" />, label: 'Categories', query: 'Browse all categories' }
      ];
    }
  };

  return (
    <div className={`flex flex-col h-full bg-gradient-to-b from-gray-50 to-white ${className}`}>
      {/* Professional Header */}
      {!hideHeader && (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center shadow-lg">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Elara AI Assistant</h3>
              <p className="text-xs text-gray-600 flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Online • Ready to help
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {messages.map((message, index) => (
          <div key={message.id} className="animate-slideUp" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className={`flex items-start gap-4 ${message.isUser ? 'flex-row-reverse' : ''}`}>
              {/* Professional Avatar */}
              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${
                message.isUser 
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                  : 'bg-gradient-to-br from-indigo-600 to-purple-700'
              }`}>
                {message.isUser ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              
              {/* Enhanced Message Content */}
              <div className={`flex-1 max-w-[75%] ${message.isUser ? 'text-right' : ''}`}>
                <div className={`inline-block px-5 py-3 rounded-2xl text-sm shadow-sm border ${
                  message.isUser
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-500 rounded-br-md'
                    : 'bg-white text-gray-800 border-gray-200 rounded-bl-md'
                }`}>
                  <p className="leading-relaxed">{message.text}</p>
                </div>
                
                {/* Professional Timestamp & Status */}
                <div className={`flex items-center gap-2 mt-2 text-xs text-gray-500 ${
                  message.isUser ? 'justify-end' : 'justify-start'
                }`}>
                  <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {message.isUser && message.status && (
                    <div className="flex items-center gap-1">
                      {message.status === 'sending' && <Clock className="w-3 h-3 text-amber-500" />}
                      {message.status === 'sent' && <CheckCircle className="w-3 h-3 text-blue-500" />}
                      {message.status === 'delivered' && <CheckCircle className="w-3 h-3 text-green-500" />}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Smart Suggestions */}
            {message.suggestions && message.suggestions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4 ml-13">
                {message.suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-full text-xs font-medium text-blue-700 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {/* Enhanced Product Cards */}
            {message.products && message.products.length > 0 && (
              <div className="mt-4 ml-13">
                <div className="flex items-center gap-2 mb-3">
                  <Package className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Recommended Products</span>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {message.products.map((product) => (
                    <EnhancedChatProductCard 
                      key={product.id}
                      product={product}
                      onViewProduct={(id) => handleAction({ type: 'view_product', product_id: id, label: 'View Product' })}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {message.actions && message.actions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4 ml-13">
                {message.actions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAction(action)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    {action.type === 'add_to_cart' && <ShoppingCart className="w-4 h-4" />}
                    {action.type === 'view_product' && <Eye className="w-4 h-4" />}
                    {action.type === 'browse_category' && <Package className="w-4 h-4" />}
                    {action.label}
                  </button>
                ))}
              </div>
            )}

            {/* Feedback & Quick Actions */}
            {!message.isUser && (
              <div className="flex items-center justify-between mt-3 ml-13">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleQuickFeedback(message.id, true)}
                    className="flex items-center gap-1 px-3 py-1 text-xs text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-md transition-all"
                    title="This was helpful"
                  >
                    <CheckCircle className="w-3 h-3" />
                    Helpful
                  </button>
                  <button
                    onClick={() => handleQuickFeedback(message.id, false)}
                    className="flex items-center gap-1 px-3 py-1 text-xs text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                    title="This needs improvement"
                  >
                    <AlertCircle className="w-3 h-3" />
                    Improve
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {/* Professional Typing Indicator */}
        {isTyping && (
          <div className="flex items-start gap-4 animate-fadeIn">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center shadow-md">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-gray-200 px-5 py-3 rounded-2xl rounded-bl-md shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200"></div>
                </div>
                <span className="text-sm text-gray-600 font-medium">AI is analyzing...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Smart Quick Actions */}
      <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex gap-2 overflow-x-auto">
          {getSmartSuggestions().map((action, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(action.query)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-blue-300 hover:text-blue-700 transition-all whitespace-nowrap shadow-sm hover:shadow-md"
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Professional Input Area */}
      <div className="p-6 border-t border-gray-200 bg-white">
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-blue-400 focus-within:bg-white transition-all">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask about products, get recommendations, or browse categories..."
                className="flex-1 bg-transparent border-0 outline-none text-sm placeholder-gray-500"
                disabled={isLoading}
                maxLength={500}
              />
              
              <button
                onClick={() => showToast('Voice input coming soon!', 'info')}
                className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all"
                title="Voice input (coming soon)"
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center justify-between mt-2 px-2">
              <span className="text-xs text-gray-500">
                {inputMessage.length}/500 characters
              </span>
              <span className="text-xs text-gray-500">
                Press Enter to send
              </span>
            </div>
          </div>
          
          <button
            onClick={() => sendMessage()}
            disabled={!inputMessage.trim() || isLoading}
            className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100"
            title="Send message"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalChat;