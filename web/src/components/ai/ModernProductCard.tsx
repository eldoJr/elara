import React from 'react';
import { ShoppingCart, Heart, Star } from 'lucide-react';
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

interface ModernProductCardProps {
  product: Product;
  onViewProduct?: (productId: number) => void;
}

const ModernProductCard: React.FC<ModernProductCardProps> = ({ product, onViewProduct }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await addToCart(product.id, 1);
      showToast(`Added to cart`, 'success');
    } catch (error) {
      showToast('Failed to add', 'error');
    }
  };

  const handleViewProduct = () => {
    if (onViewProduct) {
      onViewProduct(product.id);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-3 min-w-[140px] max-w-[160px] hover:shadow-md transition-shadow">
      {/* Product Image */}
      <div className="relative mb-2">
        <img 
          src={product.image || '/api/placeholder/120/90'} 
          alt={product.name}
          className="w-full h-20 object-cover rounded-lg cursor-pointer"
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
            showToast('Added to wishlist', 'success');
          }}
          className="absolute top-1 left-1 p-1 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors"
        >
          <Heart className="w-3 h-3 text-gray-600 dark:text-gray-400 hover:text-red-500" />
        </button>
      </div>

      {/* Product Info */}
      <div className="space-y-1">
        <h4 
          className="font-medium text-xs text-gray-900 dark:text-white line-clamp-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
          onClick={handleViewProduct}
        >
          {product.name}
        </h4>
        
        {product.category && (
          <p className="text-xs text-gray-500 dark:text-gray-400">{product.category}</p>
        )}

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-xs text-gray-600 dark:text-gray-400">{product.rating}</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">${product.price}</p>
            {product.discount && (
              <p className="text-xs text-gray-500 dark:text-gray-400 line-through">
                ${(product.price / (1 - product.discount / 100)).toFixed(2)}
              </p>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button 
          onClick={handleAddToCart}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-1.5 px-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1"
        >
          <ShoppingCart className="w-3 h-3" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ModernProductCard;