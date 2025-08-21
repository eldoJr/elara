import React, { useEffect, useRef, useState } from 'react';
import { Search, ArrowRight, Close } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../config/api';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  category: string;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const quickLinks = [
    { label: 'Popular Products', path: '/products?sort=popular' },
    { label: 'New Arrivals', path: '/products?sort=newest' },
    { label: 'Electronics', path: '/products?category=electronics' },
    { label: 'Best Sellers', path: '/products?sort=bestsellers' },
    { label: 'Sale Items', path: '/products?sale=true' }
  ];

  const searchProducts = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.get(`/api/products/?search=${encodeURIComponent(query)}&limit=6`);
      setSearchResults(response.data.products || []);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchProducts(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - only blurs content below header */}
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-20 z-40"
            style={{ top: '112px' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          
          {/* Search Content - positioned below header */}
          <motion.div 
            ref={overlayRef}
            className="absolute top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}

          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-2 right-4 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <Close className="h-4 w-4" />
              </button>
              
              {/* Search Input - left aligned, no border */}
              <div className="mb-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 text-base bg-transparent text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none"
                    autoFocus
                  />
                </div>
              </div>

              {/* Search Results */}
              {searchQuery && (
                <div className="mb-6">
                  {isLoading ? (
                    <div className="text-sm text-gray-500 dark:text-gray-400">Searching...</div>
                  ) : searchResults.length > 0 ? (
                    <div className="space-y-3">
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        Found {searchResults.length} products
                      </div>
                      {searchResults.map((product) => (
                        <Link
                          key={product.id}
                          to={`/products/${product.id}`}
                          onClick={onClose}
                          className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                          <img
                            src={product.thumbnail}
                            alt={product.title}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {product.title}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {product.category} • ${product.price}
                            </div>
                          </div>
                        </Link>
                      ))}
                      <Link
                        to={`/products?search=${encodeURIComponent(searchQuery)}`}
                        onClick={onClose}
                        className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors py-2"
                      >
                        <ArrowRight className="h-4 w-4 mr-2" />
                        View all results for "{searchQuery}"
                      </Link>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      No products found for "{searchQuery}"
                    </div>
                  )}
                </div>
              )}

              {/* Quick Links - only show when not searching */}
              {!searchQuery && (
                <div className="space-y-3">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    Quick Links
                  </div>
                  {quickLinks.map((link, index) => (
                    <Link
                      key={index}
                      to={link.path}
                      onClick={onClose}
                      className="flex items-center text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors py-2"
                    >
                      <ArrowRight className="h-4 w-4 text-gray-400 mr-3" />
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;