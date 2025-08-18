import React, { useState, useEffect } from 'react';
import GenderFilter from '../filters/GenderFilter';
import CategoryFilter from '../filters/CategoryFilter';
import BrandFilter from '../filters/BrandFilter';
import PriceFilter from '../filters/PriceFilter';
import ColorFilter from '../filters/ColorFilter';
import DiscountFilter from '../filters/DiscountFilter';
import api from '../../config/api';

interface FilterSidebarProps {
  onFiltersChange: (filters: any) => void;
  activeFilters?: any;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFiltersChange }) => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState<string[]>([]);
  
  // Filter states
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedDiscount, setSelectedDiscount] = useState('');

  const colors = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#ffffff' },
    { name: 'Red', hex: '#ef4444' },
    { name: 'Blue', hex: '#3b82f6' },
    { name: 'Green', hex: '#10b981' },
    { name: 'Pink', hex: '#ec4899' },
    { name: 'Yellow', hex: '#f59e0b' },
    { name: 'Purple', hex: '#8b5cf6' },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    onFiltersChange({
      gender: selectedGender,
      categories: selectedCategories,
      brands: selectedBrands,
      priceRange,
      colors: selectedColors,
      discount: selectedDiscount
    });
  }, [selectedGender, selectedCategories, selectedBrands, priceRange, selectedColors, selectedDiscount]);

  const fetchData = async () => {
    try {
      const [categoriesRes, productsRes] = await Promise.all([
        api.get('/api/categories/'),
        api.get('/api/products/')
      ]);
      
      setCategories(categoriesRes.data.categories || []);
      
      const products = productsRes.data.products || [];
      const uniqueBrands = Array.from(new Set(products.map((p: any) => p.brand).filter(Boolean))) as string[];
      setBrands(uniqueBrands);
    } catch (error) {
      console.error('Error fetching filter data:', error);
    }
  };

  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const handleColorChange = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  const clearAllFilters = () => {
    setSelectedGender('');
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 1000]);
    setSelectedColors([]);
    setSelectedDiscount('');
  };

  const hasActiveFilters = selectedGender || selectedCategories.length > 0 || selectedBrands.length > 0 || 
    (priceRange[0] > 0 || priceRange[1] < 1000) || selectedColors.length > 0 || selectedDiscount;

  return (
    <div className="w-56 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm h-[calc(100vh-50px)] flex flex-col">
      <div className="p-3 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Filters</h3>
          {hasActiveFilters && (
            <button 
              onClick={clearAllFilters}
              className="text-xs text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300 transition-colors font-medium"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="p-3 space-y-4 flex-1 overflow-y-auto">
        <GenderFilter
          selectedGender={selectedGender}
          onGenderChange={setSelectedGender}
        />

        <CategoryFilter
          categories={categories}
          selectedCategories={selectedCategories}
          onCategoryChange={handleCategoryChange}
        />

        <BrandFilter
          brands={brands}
          selectedBrands={selectedBrands}
          onBrandChange={handleBrandChange}
        />

        <PriceFilter
          priceRange={priceRange}
          onPriceChange={setPriceRange}
        />

        <ColorFilter
          colors={colors}
          selectedColors={selectedColors}
          onColorChange={handleColorChange}
        />

        <DiscountFilter
          selectedDiscount={selectedDiscount}
          onDiscountChange={setSelectedDiscount}
        />
      </div>
    </div>
  );
};

export default FilterSidebar;