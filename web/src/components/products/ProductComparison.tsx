import React, { useState } from 'react';
import { Dialog, DialogContent, IconButton, Typography, Button } from '@mui/material';
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
  availabilityStatus: string;
}

interface ProductComparisonProps {
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (productId: number) => void;
}

const ProductComparison: React.FC<ProductComparisonProps> = ({
  products,
  isOpen,
  onClose,
  onAddToCart
}) => {
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

  const getDiscountedPrice = (product: Product) => {
    return product.price * (1 - (product.discountPercentage || 0) / 100);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        className: "rounded-lg overflow-hidden max-h-[90vh]"
      }}
    >
      <DialogContent className="p-0">
        <div className="relative">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <Typography variant="h5" className="font-semibold">
              Compare Products ({products.length})
            </Typography>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="p-4 font-medium text-gray-600 dark:text-gray-400 w-32">
                    Product
                  </td>
                  {products.map((product) => (
                    <td key={product.id} className="p-4 text-center min-w-64">
                      <div className="space-y-3">
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className="w-24 h-24 object-cover rounded-lg mx-auto"
                        />
                        <div>
                          <h3 className="font-medium text-sm mb-1">{product.title}</h3>
                          <p className="text-xs text-gray-500">{product.brand}</p>
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
                        <div className="text-lg font-bold">
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
                        <div className="flex">
                          {renderStars(product.rating || 0)}
                        </div>
                        <span className="text-sm text-gray-600 ml-1">
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
                    <td key={product.id} className="p-4 text-center text-sm">
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
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.stock > 0 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Description */}
                <tr className="border-b border-gray-200 dark:border-gray-700">
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

                {/* Actions */}
                <tr>
                  <td className="p-4 font-medium text-gray-600 dark:text-gray-400">
                    Actions
                  </td>
                  {products.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      <Button
                        onClick={() => onAddToCart(product.id)}
                        disabled={product.stock === 0}
                        variant="contained"
                        size="small"
                        className="w-full"
                      >
                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </Button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductComparison;