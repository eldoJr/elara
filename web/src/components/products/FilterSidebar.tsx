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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    gender: true,
    categories: true,
    brands: true,
    price: true,
    colors: true,
    discount: true
  });
  
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
    { name: 'Orange', hex: '#f97316' },
    { name: 'Gray', hex: '#6b7280' },
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

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
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

  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedGender) count++;
    if (selectedCategories.length > 0) count += selectedCategories.length;
    if (selectedBrands.length > 0) count += selectedBrands.length;
    if (priceRange[0] > 0 || priceRange[1] < 1000) count++;
    if (selectedColors.length > 0) count += selectedColors.length;
    if (selectedDiscount) count++;
    return count;
  };

  const FilterSection = ({ title, isExpanded, onToggle, children, hasActiveFilter }: {
    title: string;
    isExpanded: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    hasActiveFilter?: boolean;
  }) => (
    <div className="border-b border-gray-100 dark:border-gray-700 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
      >
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium transition-colors ${
            hasActiveFilter 
              ? 'text-pink-600 dark:text-pink-400' 
              : 'text-gray-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400'
          }`}>
            {title}
          </span>
          {hasActiveFilter && (
            <span className="bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 text-xs px-1.5 py-0.5 rounded-full font-medium">
              {title === 'Categories' ? selectedCategories.length :
               title === 'Brands' ? selectedBrands.length :
               title === 'Colors' ? selectedColors.length : '1'}
            </span>
          )}
        </div>
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          } ${hasActiveFilter ? 'text-pink-600 dark:text-pink-400' : 'text-gray-400'}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-3 pb-3">
          {children}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 sticky top-4 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-pink-50 to-orange-50 dark:from-pink-900/20 dark:to-orange-900/20 rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            {!isCollapsed && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Filters</h3>
                {hasActiveFilters && (
                  <p className="text-xs text-pink-600 dark:text-pink-400 font-medium">
                    {getActiveFilterCount()} active
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            {!isCollapsed && hasActiveFilters && (
              <button 
                onClick={clearAllFilters}
                className="text-xs text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300 transition-colors font-medium px-2 py-1 rounded-md hover:bg-pink-100 dark:hover:bg-pink-900/30"
              >
                Clear All
              </button>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded-md hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <svg className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform ${
                isCollapsed ? 'rotate-180' : ''
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      {!isCollapsed && (
        <div>
          <FilterSection
            title="Gender"
            isExpanded={expandedSections.gender}
            onToggle={() => toggleSection('gender')}
            hasActiveFilter={!!selectedGender}
          >
            <GenderFilter
              selectedGender={selectedGender}
              onGenderChange={setSelectedGender}
            />
          </FilterSection>

          <FilterSection
            title="Categories"
            isExpanded={expandedSections.categories}
            onToggle={() => toggleSection('categories')}
            hasActiveFilter={selectedCategories.length > 0}
          >
            <CategoryFilter
              categories={categories}
              selectedCategories={selectedCategories}
              onCategoryChange={handleCategoryChange}
            />
          </FilterSection>

          <FilterSection
            title="Brands"
            isExpanded={expandedSections.brands}
            onToggle={() => toggleSection('brands')}
            hasActiveFilter={selectedBrands.length > 0}
          >
            <BrandFilter
              brands={brands}
              selectedBrands={selectedBrands}
              onBrandChange={handleBrandChange}
            />
          </FilterSection>

          <FilterSection
            title="Price Range"
            isExpanded={expandedSections.price}
            onToggle={() => toggleSection('price')}
            hasActiveFilter={priceRange[0] > 0 || priceRange[1] < 1000}
          >
            <PriceFilter
              priceRange={priceRange}
              onPriceChange={setPriceRange}
            />
          </FilterSection>

          <FilterSection
            title="Colors"
            isExpanded={expandedSections.colors}
            onToggle={() => toggleSection('colors')}
            hasActiveFilter={selectedColors.length > 0}
          >
            <ColorFilter
              colors={colors}
              selectedColors={selectedColors}
              onColorChange={handleColorChange}
            />
          </FilterSection>

          <FilterSection
            title="Discount"
            isExpanded={expandedSections.discount}
            onToggle={() => toggleSection('discount')}
            hasActiveFilter={!!selectedDiscount}
          >
            <DiscountFilter
              selectedDiscount={selectedDiscount}
              onDiscountChange={setSelectedDiscount}
            />
          </FilterSection>
        </div>
      )}

      {/* Collapsed State */}
      {isCollapsed && hasActiveFilters && (
        <div className="p-2">
          <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center mx-auto">
            <span className="text-white text-xs font-bold">{getActiveFilterCount()}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSidebar;