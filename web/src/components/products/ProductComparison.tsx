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
  availabilityStatus: string;
}

interface ProductComparisonProps {
  products: Product[];
  onClose: () => void;
  onRemoveProduct: (productId: number) => void;
}

const ProductComparison: React.FC<ProductComparisonProps> = ({
  products,
  onClose,
  onRemoveProduct
}) => {
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

  const getDiscountedPrice = (product: Product) => {
    return product.price * (1 - (product.discountPercentage || 0) / 100);
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
          className="bg-white dark:bg-gray-800 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Compare Products ({products.length})
            </h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="p-4 font-medium text-gray-600 dark:text-gray-400 w-32">
                    Product
                  </td>
                  {products.map((product) => (
                    <td key={product.id} className="p-4 text-center min-w-64 relative">
                      <button
                        onClick={() => onRemoveProduct(product.id)}
                        className="absolute top-2 right-2 p-1 bg-red-100 hover:bg-red-200 text-red-600 rounded-full transition-colors"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <div className="space-y-3">
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className="w-24 h-24 object-cover rounded-xl mx-auto shadow-md"
                        />
                        <div>
                          <h3 className="font-semibold text-sm mb-1 text-gray-900 dark:text-white">{product.title}</h3>
                          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>
              </thead>
              
              <tbody>
                {/* Price */}
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="p-4 font-medium text-gray-600 dark:text-gray-400">
                    Price
                  </td>
                  {products.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      <div className="space-y-1">
                        <div className="text-lg font-bold bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent">
                          ${(product.discountPercentage || 0) > 0 
                            ? getDiscountedPrice(product).toFixed(2)
                            : product.price.toFixed(2)
                          }
                        </div>
                        {(product.discountPercentage || 0) > 0 && (
                          <div className="text-sm text-gray-500 line-through">
                            ${product.price.toFixed(2)}
                          </div>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Rating */}
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="p-4 font-medium text-gray-600 dark:text-gray-400">
                    Rating
                  </td>
                  {products.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <div className="flex text-sm">
                          {renderStars(product.rating || 0)}
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                          ({(product.rating || 0).toFixed(1)})
                        </span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Category */}
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="p-4 font-medium text-gray-600 dark:text-gray-400">
                    Category
                  </td>
                  {products.map((product) => (
                    <td key={product.id} className="p-4 text-center text-sm text-gray-700 dark:text-gray-300">
                      {product.category}
                    </td>
                  ))}
                </tr>

                {/* Stock */}
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="p-4 font-medium text-gray-600 dark:text-gray-400">
                    Stock
                  </td>
                  {products.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        product.stock > 0 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                      }`}>
                        {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Description */}
                <tr>
                  <td className="p-4 font-medium text-gray-600 dark:text-gray-400">
                    Description
                  </td>
                  {products.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                        {product.description}
                      </p>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductComparison;