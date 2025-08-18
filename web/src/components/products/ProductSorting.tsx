import React from 'react';
import { FormControl, Select, MenuItem, Typography } from '@mui/material';
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
    <div className="flex items-center justify-between mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <Typography variant="body2" className="text-gray-600 dark:text-gray-300">
        Showing {totalProducts} products
      </Typography>
      
      <div className="flex items-center gap-4">
        <ViewToggle view={view} onViewChange={onViewChange} />
        
        <Typography variant="body2" className="text-gray-600 dark:text-gray-300">
          Sort by:
        </Typography>
        <FormControl size="small" className="min-w-48">
          <Select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="text-sm"
          >
            {sortOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </div>
  );
};

export default ProductSorting;