import React from 'react';

interface PriceFilterProps {
  priceRange: number[];
  onPriceChange: (range: number[]) => void;
  minPrice?: number;
  maxPrice?: number;
}

const PriceFilter: React.FC<PriceFilterProps> = ({ 
  priceRange, 
  onPriceChange,
  minPrice = 0,
  maxPrice = 1000
}) => {
  return (
    <div>
      <h4 className="text-xs font-medium text-gray-900 dark:text-white mb-2 uppercase tracking-wide">
        Price
      </h4>
      <div className="flex items-center gap-2 text-xs">
        <input
          type="number"
          value={priceRange[0]}
          onChange={(e) => onPriceChange([Number(e.target.value), priceRange[1]])}
          min={minPrice}
          max={maxPrice}
          className="w-16 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
        <span className="text-gray-400">-</span>
        <input
          type="number"
          value={priceRange[1]}
          onChange={(e) => onPriceChange([priceRange[0], Number(e.target.value)])}
          min={minPrice}
          max={maxPrice}
          className="w-16 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );
};

export default PriceFilter;