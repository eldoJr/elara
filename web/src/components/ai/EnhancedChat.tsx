import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Mic, Sparkles, Check, CheckCheck, Clock, ShoppingBag, TrendingUp, Zap, Star, Lightbulb } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { chatService, ChatMessage, Product } from '../../services/chatService';
import ChatProductCard from './ChatProductCard';



interface EnhancedChatProps {
  hideHeader?: boolean;
}

const EnhancedChat: React.FC<EnhancedChatProps> = ({ hideHeader = false }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hello! I'm here to help you find the perfect products. What can I help you with today?",
      isUser: false,
      timestamp: new Date(),
      suggestions: ['Electronics', 'Deals', 'Trending', 'Categories'],
      status: 'delivered'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(() => Math.random().toString(36).substr(2, 9));
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

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
      
      // Simulate typing delay
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { ...aiMessage, status: 'delivered' }]);
      }, 1000);

    } catch (error) {
      console.error('AI chat error:', error);
      setIsTyping(false);
      showToast('Failed to get AI response', 'error');
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble right now. Please try again! 😊",
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const handleReaction = (messageId: string, reaction: string) => {
    showToast(`Reacted with ${reaction}`, 'success');
  };

  const getSmartSuggestions = () => {
    const timeOfDay = new Date().getHours();
    const isEvening = timeOfDay >= 18;
    const isMorning = timeOfDay < 12;
    
    if (isMorning) {
      return [
        { icon: <Zap className="w-2.5 h-2.5" />, label: 'Deals', query: 'Show me morning deals' },
        { icon: <User className="w-2.5 h-2.5" />, label: 'Work', query: 'Work essentials' },
        { icon: <TrendingUp className="w-2.5 h-2.5" />, label: 'Fitness', query: 'Fitness equipment' },
        { icon: <Sparkles className="w-2.5 h-2.5" />, label: 'Tech', query: 'Latest tech' }
      ];
    } else if (isEvening) {
      return [
        { icon: <Star className="w-2.5 h-2.5" />, label: 'Home', query: 'Home comfort items' },
        { icon: <ShoppingBag className="w-2.5 h-2.5" />, label: 'Kitchen', query: 'Kitchen essentials' },
        { icon: <Lightbulb className="w-2.5 h-2.5" />, label: 'Fun', query: 'Entertainment products' },
        { icon: <Clock className="w-2.5 h-2.5" />, label: 'Sleep', query: 'Sleep and relaxation' }
      ];
    } else {
      return [
        { icon: <TrendingUp className="w-2.5 h-2.5" />, label: 'Trending', query: 'What\'s trending?' },
        { icon: <Zap className="w-2.5 h-2.5" />, label: 'Deals', query: 'Show me the best deals' },
        { icon: <ShoppingBag className="w-2.5 h-2.5" />, label: 'Cart', query: 'Check my cart' },
        { icon: <Star className="w-2.5 h-2.5" />, label: 'Top', query: 'Top rated products' }
      ];
    }
  };



  return (
    <div className="flex flex-col h-full bg-white">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={message.id} className="animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className={`flex items-start gap-3 ${message.isUser ? 'flex-row-reverse' : ''}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.isUser 
                  ? 'bg-blue-500' 
                  : 'bg-gradient-to-br from-purple-500 to-blue-600'
              }`}>
                {message.isUser ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              
              {/* Message Content */}
              <div className={`flex-1 max-w-[80%] ${message.isUser ? 'text-right' : ''}`}>
                <div className={`inline-block px-4 py-2 rounded-2xl text-sm ${
                  message.isUser
                    ? 'bg-blue-500 text-white rounded-br-md'
                    : 'bg-gray-100 text-gray-800 rounded-bl-md'
                }`}>
                  {message.text}
                </div>
                
                {/* Timestamp & Status */}
                <div className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${
                  message.isUser ? 'justify-end' : 'justify-start'
                }`}>
                  <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {message.isUser && message.status && (
                    <div className="flex items-center">
                      {message.status === 'sending' && <Clock className="w-3 h-3 text-gray-400" />}
                      {message.status === 'sent' && <Check className="w-3 h-3 text-gray-400" />}
                      {message.status === 'delivered' && <CheckCheck className="w-3 h-3 text-blue-500" />}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Suggestions */}
            {message.suggestions && message.suggestions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3 ml-11">
                {message.suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-700 hover:bg-gray-50 hover:border-blue-300 transition-all duration-200"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {/* Product Cards */}
            {message.products && message.products.length > 0 && (
              <div className="flex gap-3 overflow-x-auto pb-2 mt-3 ml-11">
                {message.products.map((product) => (
                  <ChatProductCard 
                    key={product.id}
                    product={product}
                    onViewProduct={(id) => showToast(`Viewing product ${id}`, 'info')}
                  />
                ))}
              </div>
            )}

            {/* Quick Actions */}
            {!message.isUser && (
              <div className="flex gap-2 mt-2 ml-11">
                <button
                  onClick={() => handleReaction(message.id, 'helpful')}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all"
                >
                  <Star className="w-3 h-3" />
                  Helpful
                </button>
                <button
                  onClick={() => handleReaction(message.id, 'shop')}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-md transition-all"
                >
                  <ShoppingBag className="w-3 h-3" />
                  Shop
                </button>
              </div>
            )}
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gray-100 px-4 py-2 rounded-2xl rounded-bl-md">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
                <span className="text-xs text-gray-500">AI is typing...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2 border-t border-gray-100">
        <div className="flex gap-2 overflow-x-auto">
          {getSmartSuggestions().map((action, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(action.query)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-full text-xs whitespace-nowrap transition-all border border-gray-200 hover:border-gray-300"
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 bg-gray-50 rounded-full px-4 py-2">
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
            placeholder="Type your message..."
            className="flex-1 bg-transparent border-0 outline-none text-sm placeholder-gray-500"
            disabled={isLoading}
            maxLength={300}
          />
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => showToast('Voice input coming soon', 'info')}
              className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Mic className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => sendMessage()}
              disabled={!inputMessage.trim() || isLoading}
              className="p-1.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full transition-all"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedChat;