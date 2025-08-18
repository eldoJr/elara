import React from 'react';
import { Dialog, DialogContent, IconButton, Typography } from '@mui/material';
import { Close, Star, StarBorder } from '@mui/icons-material';

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
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (productId: number) => void;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
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
        <span key={i} className="text-yellow-400">
          {i < fullStars ? <Star fontSize="small" /> : <StarBorder fontSize="small" />}
        </span>
      );
    }
    return stars;
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        className: "rounded-lg overflow-hidden"
      }}
    >
      <DialogContent className="p-0">
        <div className="relative">
          <IconButton
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white"
          >
            <Close />
          </IconButton>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Product Image */}
            <div className="relative bg-gray-100 dark:bg-gray-800">
              <img
                src={product.thumbnail || '/placeholder-image.jpg'}
                alt={product.title}
                className="w-full h-80 md:h-96 object-cover"
              />
              {hasDiscount && (
                <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-md text-sm font-bold">
                  -{Math.round(product.discountPercentage || 0)}% OFF
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-6">
              <div className="mb-2">
                <Typography variant="caption" className="text-gray-500 uppercase tracking-wide">
                  {product.brand}
                </Typography>
              </div>
              
              <Typography variant="h5" className="font-semibold mb-3">
                {product.title}
              </Typography>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {renderStars(product.rating || 0)}
                </div>
                <span className="text-sm text-gray-600">
                  ({(product.rating || 0).toFixed(1)})
                </span>
              </div>

              <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                {product.description}
              </Typography>

              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
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
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
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
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-6 rounded-md font-medium transition-colors duration-200"
                >
                  {product.availabilityStatus === 'Out of Stock' || product.stock === 0 
                    ? 'Out of Stock' 
                    : 'Add to Cart'
                  }
                </button>
                <button className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-md font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                  ♡
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickViewModal;