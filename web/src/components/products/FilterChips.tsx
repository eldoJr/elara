import React from 'react';

interface FilterChipsProps {
  activeFilters: {
    categories: { id: number; name: string }[];
    brands: string[];
    priceRange: number[];
    gender: string;
    colors: string[];
    discount: string;
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
    (activeFilters.categories?.length > 0) ||
    (activeFilters.brands?.length > 0) ||
    activeFilters.gender ||
    (activeFilters.colors?.length > 0) ||
    activeFilters.discount ||
    activeFilters.rating !== null ||
    (activeFilters.priceRange && (activeFilters.priceRange[0] > 0 || activeFilters.priceRange[1] < 1000));

  if (!hasActiveFilters) return null;

  const ChipComponent = ({ label, onRemove, color }: { label: string; onRemove: () => void; color: string }) => (
    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all hover:shadow-md ${color}`}>
      <span>{label}</span>
      <button
        onClick={onRemove}
        className="ml-1 hover:bg-black/10 rounded-full p-0.5 transition-colors"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );

  return (
    <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
          Active Filters
        </h3>
        <button
          onClick={onClearAll}
          className="text-sm text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300 font-medium transition-colors"
        >
          Clear All
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {/* Category Chips */}
        {activeFilters.categories?.map((category) => (
          <ChipComponent
            key={`category-${category.id}`}
            label={category.name}
            onRemove={() => onRemoveFilter('category', category.id)}
            color="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
          />
        ))}

        {/* Brand Chips */}
        {activeFilters.brands?.map((brand) => (
          <ChipComponent
            key={`brand-${brand}`}
            label={brand}
            onRemove={() => onRemoveFilter('brand', brand)}
            color="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
          />
        ))}

        {/* Gender Chip */}
        {activeFilters.gender && (
          <ChipComponent
            key={`gender-${activeFilters.gender}`}
            label={activeFilters.gender}
            onRemove={() => onRemoveFilter('gender', '')}
            color="bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300"
          />
        )}

        {/* Color Chips */}
        {activeFilters.colors?.map((color) => (
          <ChipComponent
            key={`color-${color}`}
            label={color}
            onRemove={() => onRemoveFilter('color', color)}
            color="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
          />
        ))}

        {/* Discount Chip */}
        {activeFilters.discount && (
          <ChipComponent
            key={`discount-${activeFilters.discount}`}
            label={`${activeFilters.discount}% off`}
            onRemove={() => onRemoveFilter('discount', '')}
            color="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
          />
        )}

        {/* Price Range Chip */}
        {activeFilters.priceRange && (activeFilters.priceRange[0] > 0 || activeFilters.priceRange[1] < 1000) && (
          <ChipComponent
            label={`$${activeFilters.priceRange?.[0] || 0} - $${activeFilters.priceRange?.[1] || 1000}`}
            onRemove={() => onRemoveFilter('priceRange', [0, 1000])}
            color="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
          />
        )}

        {/* Rating Chip */}
        {activeFilters.rating !== null && activeFilters.rating !== undefined && (
          <ChipComponent
            label={`${activeFilters.rating}+ Stars`}
            onRemove={() => onRemoveFilter('rating', null)}
            color="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
          />
        )}
      </div>
    </div>
  );
};

export default FilterChips;