import React, { useState } from 'react';
import { Plus, X, ShoppingCart, Sparkles } from 'lucide-react';
import axios from 'axios';

interface ShoppingListManagerProps {
  onListCreated?: (list: any) => void;
}

const ShoppingListManager: React.FC<ShoppingListManagerProps> = ({ onListCreated }) => {
  const [items, setItems] = useState<string[]>(['']);
  const [isCreating, setIsCreating] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState('');

  const addItem = () => {
    setItems([...items, '']);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  };

  const createShoppingList = async () => {
    const validItems = items.filter(item => item.trim() !== '');
    if (validItems.length === 0) return;

    setIsCreating(true);
    try {
      const response = await axios.post('http://localhost:8000/api/shopping-list/create/', {
        items: validItems
      });

      if (response.data.status === 'success') {
        setAiSuggestions(response.data.ai_suggestions);
        onListCreated?.(response.data);
      }
    } catch (error) {
      console.error('Shopping list creation error:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <ShoppingCart className="w-6 h-6 text-blue-500" />
        <h2 className="text-xl font-bold text-gray-800">AI Shopping List</h2>
      </div>

      <div className="space-y-3 mb-6">
        {items.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="text"
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              placeholder="Enter item..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {items.length > 1 && (
              <button
                onClick={() => removeItem(index)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex space-x-3 mb-6">
        <button
          onClick={addItem}
          className="flex items-center space-x-2 px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Item</span>
        </button>

        <button
          onClick={createShoppingList}
          disabled={isCreating || items.every(item => item.trim() === '')}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isCreating ? 'Creating...' : 'Get AI Suggestions'}</span>
        </button>
      </div>

      {aiSuggestions && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
            <Sparkles className="w-4 h-4 text-purple-500 mr-2" />
            AI Suggestions
          </h3>
          <div className="text-sm text-gray-700 whitespace-pre-wrap">
            {aiSuggestions}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingListManager;