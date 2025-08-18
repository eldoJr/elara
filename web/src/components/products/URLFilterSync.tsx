import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface URLFilterSyncProps {
  activeFilters: any;
}

const URLFilterSync: React.FC<URLFilterSyncProps> = ({ activeFilters }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams();
    
    if (activeFilters.categories?.length > 0) {
      params.set('categories', activeFilters.categories.map((c: any) => c.name).join(','));
    }
    
    if (activeFilters.brands?.length > 0) {
      params.set('brands', activeFilters.brands.join(','));
    }
    
    if (activeFilters.gender) {
      params.set('gender', activeFilters.gender);
    }
    
    if (activeFilters.priceRange && (activeFilters.priceRange[0] > 0 || activeFilters.priceRange[1] < 1000)) {
      params.set('price', `${activeFilters.priceRange[0]}-${activeFilters.priceRange[1]}`);
    }

    const newSearch = params.toString();
    if (newSearch !== location.search.slice(1)) {
      navigate(`${location.pathname}${newSearch ? `?${newSearch}` : ''}`, { replace: true });
    }
  }, [activeFilters, location.pathname, location.search, navigate]);

  return null;
};

export default URLFilterSync;