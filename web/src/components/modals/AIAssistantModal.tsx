import React from 'react';
import { X, Sparkles } from 'lucide-react';
import EnhancedChat from '../ai/EnhancedChat';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl h-[85vh] overflow-hidden shadow-2xl border border-gray-100">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">AI Shopping Assistant</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-200 p-2 rounded-full transition-colors"
            title="Close assistant"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="h-[calc(85vh-5rem)]">
          <EnhancedChat hideHeader={true} />
        </div>
      </div>
    </div>
  );
};

export default AIAssistantModal;