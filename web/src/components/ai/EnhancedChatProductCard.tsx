import React from 'react';
import { ShoppingCart, Eye, Star, Package, Zap } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../contexts/ToastContext';

interface Product {
  id: number;
  name: string;
  price: number;
  image?: string;
  category?: string;
  rating?: number;
  brand?: string;
  availability?: string;
}

interface EnhancedChatProductCardProps {
  product: Product;
  onViewProduct?: (productId: number) => void;
}

const EnhancedChatProductCard: React.FC<EnhancedChatProductCardProps> = ({ 
  product, 
  onViewProduct 
}) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await addToCart(product.id, 1);
      showToast(`${product.name} added to cart!`, 'success');
    } catch (error) {
      showToast('Failed to add to cart', 'error');
    }
  };

  const handleViewProduct = () => {
    if (onViewProduct) {
      onViewProduct(product.id);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const isInStock = product.availability === 'In Stock';
  const isOnSale = product.price < 50; // Simple sale logic

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 min-w-[200px] max-w-[220px] hover:shadow-lg transition-all duration-200 hover:scale-105">
      {/* Product Image */}
      <div className="relative mb-3 cursor-pointer" onClick={handleViewProduct}>
        <img 
          src={product.image || '/api/placeholder/180/140'} 
          alt={product.name}
          className="w-full h-32 object-cover rounded-lg"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isOnSale && (
            <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Sale
            </div>
          )}
          {!isInStock && (
            <div className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
              Out of Stock
            </div>
          )}
        </div>

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100">
          <Eye className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        {/* Brand & Category */}
        {product.brand && (
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
            {product.brand}
          </p>
        )}

        {/* Product Name */}
        <h4 
          className="font-semibold text-sm text-gray-800 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors"
          onClick={handleViewProduct}
          title={product.name}
        >
          {product.name}
        </h4>
        
        {/* Rating */}
        {product.rating && product.rating > 0 && (
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-xs text-gray-600 font-medium">
              {product.rating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </p>
            {product.category && (
              <p className="text-xs text-gray-500">{product.category}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-3">
          <button 
            onClick={handleAddToCart}
            disabled={!isInStock}
            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 text-white py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-3 h-3" />
            {isInStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
          
          <button 
            onClick={handleViewProduct}
            className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
            title="View Details"
          >
            <Eye className="w-3 h-3" />
          </button>
        </div>

        {/* Availability Status */}
        <div className="flex items-center gap-1 mt-2">
          <Package className="w-3 h-3 text-gray-400" />
          <span className={`text-xs font-medium ${
            isInStock ? 'text-green-600' : 'text-red-600'
          }`}>
            {product.availability || 'In Stock'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EnhancedChatProductCard;