import React from 'react';
import { Link } from 'react-router-dom';
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
  view?: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  onQuickView, 
  onToggleCompare,
  isInComparison = false,
  view = 'grid'
}) => {
  const discountedPrice = product.price * (1 - (product.discountPercentage || 0) / 100);
  const hasDiscount = (product.discountPercentage || 0) > 0;

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={`${i < fullStars ? 'text-orange-400' : 'text-gray-300'}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  if (view === 'list') {
    return (
      <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg hover:border-pink-200 dark:hover:border-pink-700 transition-all duration-300 flex flex-col sm:flex-row">
        {/* Product Image */}
        <div className="relative w-full sm:w-32 md:w-40 lg:w-48 h-48 sm:h-32 md:h-40 lg:h-48 flex-shrink-0">
          <Link to={`/products/${product.id}`}>
            <img
              src={product.thumbnail || '/placeholder-image.jpg'}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
          {hasDiscount && (
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              -{Math.round(product.discountPercentage || 0)}%
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
          <div>
            <p className="text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-1 font-medium">
              {product.brand}
            </p>
            <Link to={`/products/${product.id}`}>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 hover:text-pink-600 transition-colors line-clamp-2">
                {product.title}
              </h3>
            </Link>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex text-sm">
                {renderStars(product.rating || 0)}
              </div>
              <span className="text-sm text-gray-500">
                ({(product.rating || 0).toFixed(1)})
              </span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent">
                ${hasDiscount ? discountedPrice.toFixed(2) : product.price.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-base sm:text-lg text-gray-500 line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
            
            <button
              onClick={() => onAddToCart(product.id)}
              disabled={product.availabilityStatus === 'Out of Stock' || product.stock === 0}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white py-2 px-4 sm:px-6 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg min-h-[44px] flex items-center justify-center"
            >
              {product.availabilityStatus === 'Out of Stock' || product.stock === 0 
                ? 'Out of Stock' 
                : 'Add to Cart'
              }
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:border-pink-200 dark:hover:border-pink-700 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
      {/* Product Image */}
      <div className="relative overflow-hidden flex-shrink-0">
        <Link to={`/products/${product.id}`}>
          <img
            src={product.thumbnail || '/placeholder-image.jpg'}
            alt={product.title}
            className="w-full h-40 sm:h-48 object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </Link>
        
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-bold shadow-lg">
            -{Math.round(product.discountPercentage || 0)}%
          </div>
        )}
        
        {/* Quick Actions */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-1 sm:gap-2">
          {onQuickView && (
            <button
              onClick={() => onQuickView(product)}
              className="bg-white/90 hover:bg-white text-gray-700 p-1.5 sm:p-2 rounded-full shadow-md transition-all duration-200 hover:scale-110 min-h-[36px] min-w-[36px] flex items-center justify-center"
              title="Quick View"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
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

      {/* Product Info */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        {/* Brand */}
        <p className="text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-1 font-medium">
          {product.brand}
        </p>

        {/* Product Name */}
        <Link to={`/products/${product.id}`} className="flex-grow">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-pink-600 transition-colors min-h-[2.5rem] flex items-start">
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex text-sm">
            {renderStars(product.rating || 0)}
          </div>
          <span className="text-xs text-gray-500 ml-1">
            ({(product.rating || 0).toFixed(1)})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <span className="text-base sm:text-lg font-bold bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent">
            ${hasDiscount ? discountedPrice.toFixed(2) : product.price.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-500 line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart(product.id)}
          disabled={product.availabilityStatus === 'Out of Stock' || product.stock === 0}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white py-2.5 sm:py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg min-h-[44px] flex items-center justify-center mt-auto"
        >
          {product.availabilityStatus === 'Out of Stock' || product.stock === 0 
            ? 'Out of Stock' 
            : 'Add to Cart'
          }
        </button>
      </div>
    </div>
  );
};

export default ProductCard;