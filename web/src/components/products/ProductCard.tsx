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
      <div className="group bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:border-gray-200 dark:hover:border-pink-700 transition-all duration-700 hover:scale-102 flex flex-col sm:flex-row">
        {/* Product Image */}
        <div className="relative w-full sm:w-40 md:w-48 lg:w-56 h-48 sm:h-40 md:h-48 lg:h-56 flex-shrink-0">
          <Link to={`/products/${product.id}`}>
            <img
              src={product.thumbnail || '/placeholder-image.jpg'}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          </Link>
          {hasDiscount && (
            <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-2 rounded-full text-xs font-bold shadow-lg">
              -{Math.round(product.discountPercentage || 0)}% OFF
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            {product.brand && (
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">
                {product.brand}
              </p>
            )}
            <Link to={`/products/${product.id}`}>
              <h3 className="text-xl sm:text-2xl font-medium text-gray-900 dark:text-white mb-3 hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                {product.title}
              </h3>
            </Link>
            {product.rating && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-sm text-yellow-400">
                  {renderStars(product.rating)}
                </div>
                <span className="text-sm text-gray-500">
                  ({product.rating.toFixed(1)})
                </span>
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-light text-gray-900">
                ${hasDiscount ? discountedPrice.toFixed(2) : product.price.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-lg sm:text-xl text-gray-500 line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
            
            <button
              onClick={() => onAddToCart(product.id)}
              disabled={product.availabilityStatus === 'Out of Stock' || product.stock === 0}
              className="bg-black hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-8 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center"
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
    <div className="group bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-2xl hover:border-gray-200 dark:hover:border-pink-700 transition-all duration-700 hover:-translate-y-2 hover:scale-102 flex flex-col h-full">
      {/* Product Image */}
      <div className="relative overflow-hidden flex-shrink-0">
        <Link to={`/products/${product.id}`}>
          <img
            src={product.thumbnail || '/placeholder-image.jpg'}
            alt={product.title}
            className="w-full h-48 sm:h-56 object-cover group-hover:scale-110 transition-transform duration-700"
          />
        </Link>
        
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-2 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm">
            -{Math.round(product.discountPercentage || 0)}% OFF
          </div>
        )}
        
        {/* Quick Actions */}
        <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300 flex gap-2">
          {onQuickView && (
            <button
              onClick={() => onQuickView(product)}
              className="bg-white/95 backdrop-blur-sm hover:bg-white text-gray-700 p-2.5 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
              title="Quick View"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <div className="p-6 flex flex-col flex-grow">
        {/* Brand */}
        {product.brand && (
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">
            {product.brand}
          </p>
        )}

        {/* Product Name */}
        <Link to={`/products/${product.id}`} className="flex-grow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3 line-clamp-2 hover:text-blue-600 transition-colors leading-snug">
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-sm text-yellow-400">
              {renderStars(product.rating)}
            </div>
            <span className="text-sm text-gray-500">
              ({product.rating.toFixed(1)})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-6">
          <span className="text-2xl font-light text-gray-900">
            ${hasDiscount ? discountedPrice.toFixed(2) : product.price.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-lg text-gray-500 line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart(product.id)}
          disabled={product.availabilityStatus === 'Out of Stock' || product.stock === 0}
          className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-6 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center mt-auto"
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