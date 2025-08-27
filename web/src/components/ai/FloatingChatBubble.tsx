import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Minimize2 } from 'lucide-react';
import EnhancedChat from './EnhancedChat';
import MobileChatDrawer from './MobileChatDrawer';

const FloatingChatBubble: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      {/* Mobile Chat Drawer */}
      {isMobile ? (
        <MobileChatDrawer 
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)} 
        />
      ) : (
        /* Desktop Chat Window */
        isOpen && (
          <div className={`fixed bottom-20 right-6 z-50 transition-all duration-300 ${
            isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
          } max-w-[calc(100vw-2rem)] max-h-[calc(100vh-6rem)]`}>
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 h-full flex flex-col">
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-2xl">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <span className="font-medium">AI Assistant</span>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-1 hover:bg-white/20 rounded transition-colors"
                  >
                    <Minimize2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-white/20 rounded transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Chat Content */}
              {!isMinimized && (
                <div className="flex-1 overflow-hidden">
                  <EnhancedChat />
                </div>
              )}
            </div>
          </div>
        )
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 ${
          isOpen ? 'rotate-180' : ''
        }`}
      >
        {isOpen ? (
          <X className="w-8 h-8 mx-auto" />
        ) : (
          <div className="relative">
            <MessageCircle className="w-8 h-8 mx-auto" />
            {/* Notification Badge */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">1</span>
            </div>
            {/* Pulse Animation */}
            <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20"></div>
          </div>
        )}
      </button>
    </>
  );
};

export default FloatingChatBubble;