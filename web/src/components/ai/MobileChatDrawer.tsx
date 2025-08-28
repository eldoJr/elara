import React, { useState, useEffect } from 'react';
import { X, ChevronDown, Maximize2 } from 'lucide-react';
import ProfessionalChat from './ProfessionalChat';

interface MobileChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileChatDrawer: React.FC<MobileChatDrawerProps> = ({ isOpen, onClose }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    
    // Close if dragged down more than 100px
    if (diff > 100) {
      onClose();
      setIsDragging(false);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl transform transition-transform duration-300 md:hidden ${
        isOpen ? 'translate-y-0' : 'translate-y-full'
      }`}>
        {/* Handle */}
        <div 
          className="flex justify-center py-3 cursor-pointer"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>
        
        {/* Enhanced Header */}
        <div className="flex items-center justify-between px-4 pb-2 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">AI</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AI Assistant</h3>
              <p className="text-xs text-gray-600">Online • Ready to help</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              title={isFullScreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              title="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Chat Content */}
        <div className={`${isFullScreen ? 'h-[90vh]' : 'h-[80vh]'} overflow-hidden transition-all duration-300`}>
          <ProfessionalChat hideHeader={true} />
        </div>
      </div>
    </>
  );
};

export default MobileChatDrawer;