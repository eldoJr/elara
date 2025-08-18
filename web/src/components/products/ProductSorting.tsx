import React from 'react';
import ViewToggle from './ViewToggle';

interface ProductSortingProps {
  sortBy: string;
  onSortChange: (sortBy: string) => void;
  totalProducts: number;
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
}

const ProductSorting: React.FC<ProductSortingProps> = ({ 
  sortBy, 
  onSortChange, 
  totalProducts,
  view,
  onViewChange
}) => {
  const sortOptions = [
    { value: 'recommended', label: 'Recommended' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Customer Rating' },
    { value: 'newest', label: 'Newest First' },
  ];

  return (
    <div className="flex items-center justify-between mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {totalProducts}
        </span>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          products found
        </span>
      </div>
      
      <div className="flex items-center gap-4">
        <ViewToggle view={view} onViewChange={onViewChange} />
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Sort by:
          </span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProductSorting;