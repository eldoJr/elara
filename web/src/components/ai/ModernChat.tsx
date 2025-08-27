import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Mic, ThumbsUp, Heart, ShoppingBag } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';
import { chatService, ChatMessage } from '../../services/chatService';
import ModernProductCard from './ModernProductCard';

const ModernChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hi! I'm your AI shopping assistant. I can help you find products and provide personalized recommendations. What are you looking for today?",
      isUser: false,
      timestamp: new Date(),
      suggestions: ['Electronics', 'Deals', 'Trending', 'Help me choose']
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isDark } = useTheme();
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
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const aiMessage = await chatService.sendMessage(messageText);
      
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, aiMessage]);
      }, 800);

    } catch (error) {
      setIsTyping(false);
      showToast('Failed to get response', 'error');
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble right now. Please try again.",
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
    showToast('Thanks for the feedback!', 'success');
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-black">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white text-sm">AI Assistant</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div key={message.id} className="space-y-2">
            <div className={`flex gap-2 ${message.isUser ? 'justify-end' : 'justify-start'}`}>
              {!message.isUser && (
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-3 h-3 text-white" />
                </div>
              )}
              
              <div className={`max-w-xs px-3 py-2 rounded-2xl text-sm ${
                message.isUser
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
              }`}>
                <p>{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.isUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              {message.isUser && (
                <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                </div>
              )}
            </div>

            {/* Product Cards */}
            {message.products && message.products.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2 ml-8">
                {message.products.map((product) => (
                  <ModernProductCard 
                    key={product.id} 
                    product={product}
                    onViewProduct={(id) => showToast(`Viewing product ${id}`, 'info')}
                  />
                ))}
              </div>
            )}

            {/* Suggestions */}
            {message.suggestions && message.suggestions.length > 0 && (
              <div className="flex flex-wrap gap-1 ml-8">
                {message.suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {/* Reactions */}
            {!message.isUser && (
              <div className="flex gap-1 ml-8">
                <button
                  onClick={() => handleReaction(message.id, 'like')}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                >
                  <ThumbsUp className="w-3 h-3 text-gray-400 hover:text-blue-500" />
                </button>
                <button
                  onClick={() => handleReaction(message.id, 'love')}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                >
                  <Heart className="w-3 h-3 text-gray-400 hover:text-red-500" />
                </button>
                <button
                  onClick={() => handleReaction(message.id, 'shop')}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                >
                  <ShoppingBag className="w-3 h-3 text-gray-400 hover:text-green-500" />
                </button>
              </div>
            )}
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex gap-2 justify-start">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <Bot className="w-3 h-3 text-white" />
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-2xl">
              <div className="flex items-center space-x-1">
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">typing</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Message..."
            className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-700 transition-all"
            disabled={isLoading}
          />
          <button
            onClick={() => showToast('Voice input coming soon', 'info')}
            className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
          >
            <Mic className="w-4 h-4" />
          </button>
          <button
            onClick={() => sendMessage()}
            disabled={!inputMessage.trim() || isLoading}
            className="p-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModernChat;