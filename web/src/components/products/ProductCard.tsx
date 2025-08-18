import React from 'react';
import { Link } from 'react-router-dom';
import { Star, StarBorder } from '@mui/icons-material';
import CompareButton from './CompareButton';

interface Product {
  id: number;
  title: string;
  name: string;
  description: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  availabilityStatus: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: number) => void;
  onQuickView?: (product: Product) => void;
  onToggleCompare?: (productId: number, isAdding: boolean) => void;
  isInComparison?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  onQuickView, 
  onToggleCompare,
  isInComparison = false
}) => {
  const discountedPrice = product.price * (1 - (product.discountPercentage || 0) / 100);
  const hasDiscount = (product.discountPercentage || 0) > 0;

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className="text-yellow-400 text-sm">
          {i < fullStars ? <Star fontSize="small" /> : <StarBorder fontSize="small" />}
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Product Image */}
      <div className="relative overflow-hidden">
        <Link to={`/products/${product.id}`}>
          <img
            src={product.thumbnail || '/placeholder-image.jpg'}
            alt={product.title}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-bold">
            -{Math.round(product.discountPercentage || 0)}% OFF
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Brand */}
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
          {product.brand}
        </p>

        {/* Product Name */}
        <Link to={`/products/${product.id}`}>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex">
            {renderStars(product.rating || 0)}
          </div>
          <span className="text-xs text-gray-500 ml-1">
            ({(product.rating || 0).toFixed(1)})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            ${hasDiscount ? discountedPrice.toFixed(2) : product.price.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-500 line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onAddToCart(product.id)}
            disabled={product.availabilityStatus === 'Out of Stock' || product.stock === 0}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200"
          >
            {product.availabilityStatus === 'Out of Stock' || product.stock === 0 
              ? 'Out of Stock' 
              : 'Add to Cart'
            }
          </button>
          <div className="flex gap-2">
            {onQuickView && (
              <button
                onClick={() => onQuickView(product)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                title="Quick View"
              >
                👁️
              </button>
            )}
            {onToggleCompare && (
              <CompareButton
                productId={product.id}
                isInComparison={isInComparison}
                onToggleCompare={onToggleCompare}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;