import React, { useState, useEffect } from 'react';
import { Search, Sparkles, TrendingUp } from 'lucide-react';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  similarity_score?: number;
}

interface SmartSearchProps {
  onProductSelect?: (product: Product) => void;
}

const SmartSearch: React.FC<SmartSearchProps> = ({ onProductSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [useSemanticSearch, setUseSemanticSearch] = useState(false);

  useEffect(() => {
    if (query.length > 2) {
      const timeoutId = setTimeout(() => {
        performSearch();
        getSuggestions();
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setResults([]);
      setSuggestions([]);
    }
  }, [query, useSemanticSearch]);

  const performSearch = async () => {
    setIsLoading(true);
    try {
      const endpoint = useSemanticSearch 
        ? '/api/search/semantic/' 
        : '/api/products/';
      
      const response = await axios.get(`http://localhost:8000${endpoint}`, {
        params: { q: query, limit: 10 }
      });
      
      setResults(response.data.products || []);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getSuggestions = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/search/suggestions/', {
        params: { q: query }
      });
      setSuggestions(response.data.suggestions || []);
    } catch (error) {
      console.error('Suggestions error:', error);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="flex items-center space-x-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products with AI..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <button
            onClick={() => setUseSemanticSearch(!useSemanticSearch)}
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
              useSemanticSearch
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI Search</span>
          </button>
        </div>

        {/* Search Suggestions */}
        {suggestions.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              Suggestions
            </h3>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(suggestion)}
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm hover:bg-blue-100 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        )}

        {/* Search Results */}
        {results.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">
              Search Results {useSemanticSearch && <span className="text-blue-500">(AI-Powered)</span>}
            </h3>
            <div className="grid gap-3">
              {results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => onProductSelect?.(product)}
                  className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <img
                    src={product.image || '/api/placeholder/60/60'}
                    alt={product.name}
                    className="w-15 h-15 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{product.name}</h4>
                    <p className="text-lg font-semibold text-blue-600">${product.price}</p>
                    {useSemanticSearch && product.similarity_score && (
                      <div className="text-xs text-gray-500">
                        Match: {(product.similarity_score * 100).toFixed(1)}%
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {query.length > 2 && !isLoading && results.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No products found for "{query}"</p>
            <p className="text-sm">Try different keywords or enable AI search</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartSearch;