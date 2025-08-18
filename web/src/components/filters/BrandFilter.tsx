import React, { useState } from 'react';

interface BrandFilterProps {
  brands: string[];
  selectedBrands: string[];
  onBrandChange: (brand: string) => void;
}

const BrandFilter: React.FC<BrandFilterProps> = ({ 
  brands, 
  selectedBrands, 
  onBrandChange 
}) => {
  const [showAll, setShowAll] = useState(false);
  const displayBrands = showAll ? brands : brands.slice(0, 6);
  const remainingCount = brands.length - 6;

  return (
    <div>
      <h4 className="text-xs font-medium text-gray-900 dark:text-white mb-2 uppercase tracking-wide">
        Brand
      </h4>
      <div className="space-y-1 max-h-32 overflow-y-auto">
        {displayBrands.map((brand) => (
          <label key={brand} className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={selectedBrands.includes(brand)}
              onChange={() => onBrandChange(brand)}
              className="w-3 h-3 text-pink-600 border-gray-300 rounded focus:ring-pink-500 focus:ring-1"
            />
            <span className="ml-2 text-xs text-gray-700 dark:text-gray-300">
              {brand}
            </span>
          </label>
        ))}
        {!showAll && remainingCount > 0 && (
          <button
            onClick={() => setShowAll(true)}
            className="text-xs text-pink-600 hover:text-pink-700 font-medium"
          >
            +{remainingCount} more
          </button>
        )}
      </div>
    </div>
  );
};

export default BrandFilter;