import React, { useState } from 'react';

interface Category {
  id: number;
  name: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategories: number[];
  onCategoryChange: (categoryId: number) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  categories, 
  selectedCategories, 
  onCategoryChange 
}) => {
  const [showAll, setShowAll] = useState(false);
  const displayCategories = showAll ? categories : categories.slice(0, 5);
  const remainingCount = categories.length - 5;

  return (
    <div>
      <h4 className="text-xs font-medium text-gray-900 dark:text-white mb-2 uppercase tracking-wide">
        Categories
      </h4>
      <div className="space-y-1 max-h-32 overflow-y-auto">
        {displayCategories.map((category) => (
          <label key={category.id} className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={selectedCategories.includes(category.id)}
              onChange={() => onCategoryChange(category.id)}
              className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-1"
            />
            <span className="ml-2 text-xs text-gray-700 dark:text-gray-300">
              {category.name}
            </span>
          </label>
        ))}
        {!showAll && remainingCount > 0 && (
          <button
            onClick={() => setShowAll(true)}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            +{remainingCount} more
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoryFilter;