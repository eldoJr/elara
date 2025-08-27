import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Eye, Plus } from 'lucide-react';
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
        <Star 
          key={i} 
          className={`w-3 h-3 ${i < fullStars ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  if (view === 'list') {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-sm transition-all flex">
        <div className="relative w-24 h-24 flex-shrink-0">
          <Link to={`/products/${product.id}`}>
            <img
              src={product.thumbnail || '/placeholder-image.jpg'}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </Link>
          {hasDiscount && (
            <div className="absolute top-1 right-1 bg-red-500 text-white px-1.5 py-0.5 rounded text-xs font-medium">
              -{Math.round(product.discountPercentage || 0)}%
            </div>
          )}
        </div>

        <div className="flex-1 p-3 flex flex-col justify-between">
          <div>
            {product.brand && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {product.brand}
              </p>
            )}
            <Link to={`/products/${product.id}`}>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400">
                {product.title}
              </h3>
            </Link>
            {product.rating && (
              <div className="flex items-center gap-1 mb-2">
                <div className="flex">
                  {renderStars(product.rating)}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ({product.rating.toFixed(1)})
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-semibold text-gray-900 dark:text-white">
                ${hasDiscount ? discountedPrice.toFixed(2) : product.price.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
            
            <button
              onClick={() => onAddToCart(product.id)}
              disabled={product.availabilityStatus === 'Out of Stock' || product.stock === 0}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-1.5 px-3 rounded-lg text-sm font-medium transition-colors"
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
    <div className="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-sm transition-all flex flex-col h-full">
      {/* Product Image */}
      <div className="relative overflow-hidden">
        <Link to={`/products/${product.id}`}>
          <img
            src={product.thumbnail || '/placeholder-image.jpg'}
            alt={product.title}
            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </Link>
        
        {hasDiscount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-1.5 py-0.5 rounded text-xs font-medium">
            -{Math.round(product.discountPercentage || 0)}%
          </div>
        )}
        
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          {onQuickView && (
            <button
              onClick={() => onQuickView(product)}
              className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 p-1.5 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              title="Quick View"
            >
              <Eye className="w-4 h-4" />
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
      <div className="p-3 flex flex-col flex-grow">
        {product.brand && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            {product.brand}
          </p>
        )}

        <Link to={`/products/${product.id}`} className="flex-grow">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {product.title}
          </h3>
        </Link>

        {product.rating && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {renderStars(product.rating)}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({product.rating.toFixed(1)})
            </span>
          </div>
        )}

        <div className="flex items-baseline gap-1.5 mb-3">
          <span className="text-base font-semibold text-gray-900 dark:text-white">
            ${hasDiscount ? discountedPrice.toFixed(2) : product.price.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        <button
          onClick={() => onAddToCart(product.id)}
          disabled={product.availabilityStatus === 'Out of Stock' || product.stock === 0}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1 mt-auto"
        >
          <Plus className="w-4 h-4" />
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