import React from 'react';
import { Chip, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';

interface FilterChipsProps {
  activeFilters: {
    categories: { id: number; name: string }[];
    brands: string[];
    priceRange: number[];
    gender: string[];
    rating: number | null;
  };
  onRemoveFilter: (type: string, value: any) => void;
  onClearAll: () => void;
}

const FilterChips: React.FC<FilterChipsProps> = ({ 
  activeFilters, 
  onRemoveFilter, 
  onClearAll 
}) => {
  const hasActiveFilters = 
    activeFilters.categories.length > 0 ||
    activeFilters.brands.length > 0 ||
    activeFilters.gender.length > 0 ||
    activeFilters.rating !== null ||
    (activeFilters.priceRange[0] > 0 || activeFilters.priceRange[1] < 1000);

  if (!hasActiveFilters) return null;

  return (
    <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <Typography variant="subtitle2" className="font-medium text-gray-700 dark:text-gray-300">
          Active Filters
        </Typography>
        <button
          onClick={onClearAll}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Clear All
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {/* Category Chips */}
        {activeFilters.categories.map((category) => (
          <Chip
            key={`category-${category.id}`}
            label={category.name}
            onDelete={() => onRemoveFilter('category', category.id)}
            deleteIcon={<Close fontSize="small" />}
            size="small"
            className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
          />
        ))}

        {/* Brand Chips */}
        {activeFilters.brands.map((brand) => (
          <Chip
            key={`brand-${brand}`}
            label={brand}
            onDelete={() => onRemoveFilter('brand', brand)}
            deleteIcon={<Close fontSize="small" />}
            size="small"
            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
          />
        ))}

        {/* Gender Chips */}
        {activeFilters.gender.map((gender) => (
          <Chip
            key={`gender-${gender}`}
            label={gender}
            onDelete={() => onRemoveFilter('gender', gender)}
            deleteIcon={<Close fontSize="small" />}
            size="small"
            className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
          />
        ))}

        {/* Price Range Chip */}
        {(activeFilters.priceRange[0] > 0 || activeFilters.priceRange[1] < 1000) && (
          <Chip
            label={`$${activeFilters.priceRange[0]} - $${activeFilters.priceRange[1]}`}
            onDelete={() => onRemoveFilter('priceRange', [0, 1000])}
            deleteIcon={<Close fontSize="small" />}
            size="small"
            className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
          />
        )}

        {/* Rating Chip */}
        {activeFilters.rating !== null && (
          <Chip
            label={`${activeFilters.rating}+ Stars`}
            onDelete={() => onRemoveFilter('rating', null)}
            deleteIcon={<Close fontSize="small" />}
            size="small"
            className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
          />
        )}
      </div>
    </div>
  );
};

export default FilterChips;