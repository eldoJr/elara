import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

interface URLFilterSyncProps {
  activeFilters: {
    categories: { id: number; name: string }[];
    brands: string[];
    gender: string[];
    rating: number | null;
    priceRange: number[];
  };
  onFiltersChange: (filters: any) => void;
}

const URLFilterSync: React.FC<URLFilterSyncProps> = ({ activeFilters, onFiltersChange }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (activeFilters.categories.length > 0) {
      params.set('categories', activeFilters.categories.map(c => c.name).join(','));
    }
    
    if (activeFilters.brands.length > 0) {
      params.set('brands', activeFilters.brands.join(','));
    }
    
    if (activeFilters.gender.length > 0) {
      params.set('gender', activeFilters.gender.join(','));
    }
    
    if (activeFilters.rating !== null) {
      params.set('rating', activeFilters.rating.toString());
    }
    
    if (activeFilters.priceRange[0] > 0 || activeFilters.priceRange[1] < 1000) {
      params.set('priceMin', activeFilters.priceRange[0].toString());
      params.set('priceMax', activeFilters.priceRange[1].toString());
    }
    
    setSearchParams(params, { replace: true });
  }, [activeFilters, setSearchParams]);

  // Load filters from URL on mount
  useEffect(() => {
    const categories = searchParams.get('categories')?.split(',').filter(Boolean) || [];
    const brands = searchParams.get('brands')?.split(',').filter(Boolean) || [];
    const gender = searchParams.get('gender')?.split(',').filter(Boolean) || [];
    const rating = searchParams.get('rating') ? parseInt(searchParams.get('rating')!) : null;
    const priceMin = parseInt(searchParams.get('priceMin') || '0');
    const priceMax = parseInt(searchParams.get('priceMax') || '1000');

    if (categories.length > 0 || brands.length > 0 || gender.length > 0 || rating !== null || priceMin > 0 || priceMax < 1000) {
      onFiltersChange({
        categories,
        brands,
        gender,
        rating,
        priceRange: [priceMin, priceMax]
      });
    }
  }, []);

  return null; // This component doesn't render anything
};

export default URLFilterSync;