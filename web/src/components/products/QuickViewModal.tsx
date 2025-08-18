import React from 'react';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images?: string[];
  availabilityStatus: string;
}

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (productId: number) => void;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart
}) => {
  if (!product) return null;

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

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div 
          className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 p-2 rounded-full shadow-md transition-all hover:scale-110"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* Product Image */}
              <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                <img
                  src={product.thumbnail || '/placeholder-image.jpg'}
                  alt={product.title}
                  className="w-full h-80 md:h-96 object-cover"
                />
                {hasDiscount && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-2 rounded-full text-sm font-bold shadow-lg">
                    -{Math.round(product.discountPercentage || 0)}% OFF
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6 flex flex-col">
                <div className="mb-2">
                  <p className="text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wide font-medium">
                    {product.brand}
                  </p>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {product.title}
                </h2>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-sm">
                    {renderStars(product.rating || 0)}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    ({(product.rating || 0).toFixed(1)})
                  </span>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed flex-1">
                  {product.description}
                </p>

                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent">
                    ${hasDiscount ? discountedPrice.toFixed(2) : product.price.toFixed(2)}
                  </span>
                  {hasDiscount && (
                    <span className="text-lg text-gray-500 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    product.availabilityStatus === 'In Stock' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  }`}>
                    {product.availabilityStatus}
                  </span>
                  {product.stock > 0 && (
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {product.stock} items available
                    </span>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      onAddToCart(product.id);
                      onClose();
                    }}
                    disabled={product.availabilityStatus === 'Out of Stock' || product.stock === 0}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    {product.availabilityStatus === 'Out of Stock' || product.stock === 0 
                      ? 'Out of Stock' 
                      : 'Add to Cart'
                    }
                  </button>
                  <button className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuickViewModal;