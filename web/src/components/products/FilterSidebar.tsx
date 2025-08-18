import React, { useState, useEffect } from 'react';
import { Checkbox, FormControlLabel, FormGroup, Typography, Slider, Button } from '@mui/material';
import api from '../../config/api';

interface FilterSidebarProps {
  onFiltersChange: (filters: any) => void;
  activeFilters?: any;
}

interface Category {
  id: number;
  name: string;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFiltersChange, activeFilters }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedGender, setSelectedGender] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);

  const genderOptions = ['Men', 'Women', 'Boys', 'Girls'];
  const ratingOptions = [4, 3, 2, 1];

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  useEffect(() => {
    onFiltersChange({
      categories: selectedCategories,
      brands: selectedBrands,
      gender: selectedGender,
      rating: selectedRating,
      priceRange
    });
  }, [selectedCategories, selectedBrands, selectedGender, selectedRating, priceRange]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/categories/');
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await api.get('/api/products/');
      const products = response.data.products || [];
      const uniqueBrands = Array.from(new Set(products.map((p: any) => p.brand).filter(Boolean))) as string[];
      setBrands(uniqueBrands);
    } catch (error) {
      console.error('Error fetching brands:', error);
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

  const handleGenderChange = (gender: string) => {
    setSelectedGender(prev => 
      prev.includes(gender) 
        ? prev.filter(g => g !== gender)
        : [...prev, gender]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedGender([]);
    setSelectedRating(null);
    setPriceRange([0, 1000]);
  };

  return (
    <div className="w-64 bg-white dark:bg-gray-800 p-6 border-r border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h6" className="font-semibold">Filters</Typography>
        <Button onClick={clearAllFilters} size="small" color="primary">
          Clear All
        </Button>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <Typography variant="subtitle1" className="font-medium mb-3">Categories</Typography>
        <FormGroup>
          {categories.map((category) => (
            <FormControlLabel
              key={category.id}
              control={
                <Checkbox
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => handleCategoryChange(category.id)}
                  size="small"
                />
              }
              label={category.name}
              className="text-sm"
            />
          ))}
        </FormGroup>
      </div>

      {/* Brands */}
      <div className="mb-6">
        <Typography variant="subtitle1" className="font-medium mb-3">Brands</Typography>
        <FormGroup className="max-h-48 overflow-y-auto">
          {brands.map((brand) => (
            <FormControlLabel
              key={brand}
              control={
                <Checkbox
                  checked={selectedBrands.includes(brand)}
                  onChange={() => handleBrandChange(brand)}
                  size="small"
                />
              }
              label={brand}
              className="text-sm"
            />
          ))}
        </FormGroup>
      </div>

      {/* Gender */}
      <div className="mb-6">
        <Typography variant="subtitle1" className="font-medium mb-3">Gender</Typography>
        <FormGroup>
          {genderOptions.map((gender) => (
            <FormControlLabel
              key={gender}
              control={
                <Checkbox
                  checked={selectedGender.includes(gender)}
                  onChange={() => handleGenderChange(gender)}
                  size="small"
                />
              }
              label={gender}
              className="text-sm"
            />
          ))}
        </FormGroup>
      </div>

      {/* Rating */}
      <div className="mb-6">
        <Typography variant="subtitle1" className="font-medium mb-3">Rating</Typography>
        <FormGroup>
          {ratingOptions.map((rating) => (
            <FormControlLabel
              key={rating}
              control={
                <Checkbox
                  checked={selectedRating === rating}
                  onChange={() => setSelectedRating(selectedRating === rating ? null : rating)}
                  size="small"
                />
              }
              label={`${rating}+ Stars`}
              className="text-sm"
            />
          ))}
        </FormGroup>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <Typography variant="subtitle1" className="font-medium mb-3">Price Range</Typography>
        <Slider
          value={priceRange}
          onChange={(_, newValue) => setPriceRange(newValue as number[])}
          valueLabelDisplay="auto"
          min={0}
          max={1000}
          className="mt-4"
        />
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;