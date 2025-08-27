import React from 'react';
import { ShoppingCart, Heart, Star, ExternalLink } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../contexts/ToastContext';

interface Product {
  id: number;
  name: string;
  price: number;
  image?: string;
  category?: string;
  rating?: number;
  discount?: number;
}

interface ChatProductCardProps {
  product: Product;
  onViewProduct?: (productId: number) => void;
}

const ChatProductCard: React.FC<ChatProductCardProps> = ({ product, onViewProduct }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await addToCart(product.id, 1);
      showToast(`Added ${product.name} to cart!`, 'success');
    } catch (error) {
      showToast('Failed to add to cart', 'error');
    }
  };

  const handleViewProduct = () => {
    if (onViewProduct) {
      onViewProduct(product.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-3 min-w-[180px] max-w-[200px] hover:shadow-lg transition-shadow">
      {/* Product Image */}
      <div className="relative mb-2">
        <img 
          src={product.image || '/api/placeholder/150/120'} 
          alt={product.name}
          className="w-full h-24 object-cover rounded cursor-pointer"
          onClick={handleViewProduct}
        />
        {product.discount && (
          <div className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded">
            -{product.discount}%
          </div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            showToast('Added to wishlist!', 'success');
          }}
          className="absolute top-1 left-1 p-1 bg-white/80 rounded-full hover:bg-white transition-colors"
        >
          <Heart className="w-3 h-3 text-gray-600 hover:text-red-500" />
        </button>
      </div>

      {/* Product Info */}
      <div className="space-y-1">
        <h4 
          className="font-medium text-sm text-gray-800 line-clamp-2 cursor-pointer hover:text-blue-600"
          onClick={handleViewProduct}
        >
          {product.name}
        </h4>
        
        {product.category && (
          <p className="text-xs text-gray-500">{product.category}</p>
        )}

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-xs text-gray-600">{product.rating}</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-600 font-bold text-sm">${product.price}</p>
            {product.discount && (
              <p className="text-xs text-gray-500 line-through">
                ${(product.price / (1 - product.discount / 100)).toFixed(2)}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-1 mt-2">
          <button 
            onClick={handleAddToCart}
            className="flex-1 bg-blue-500 text-white py-1 px-2 rounded text-xs hover:bg-blue-600 transition-colors flex items-center justify-center gap-1"
          >
            <ShoppingCart className="w-3 h-3" />
            Add
          </button>
          <button 
            onClick={handleViewProduct}
            className="p-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatProductCard;