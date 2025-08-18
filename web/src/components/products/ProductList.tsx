import React, { useState, useEffect } from 'react';
import { Container, Grid } from '@mui/material';
import { useLocation } from 'react-router-dom';
import api from '../../config/api';
import Loading from '../common/Loading';
import Breadcrumb from '../common/Breadcrumb';
import FilterSidebar from './FilterSidebar';
import ProductCard from './ProductCard';
import ProductSorting from './ProductSorting';
import FilterChips from './FilterChips';
import MobileFilterDrawer from './MobileFilterDrawer';
import QuickViewModal from './QuickViewModal';
import URLFilterSync from './URLFilterSync';
import Pagination from './Pagination';
import SearchAutocomplete from './SearchAutocomplete';
import ProductComparison from './ProductComparison';
import useLocalStorage from '../../hooks/useLocalStorage';

interface Product {
  id: number;
  title: string;
  name: string;
  description: string;
  price: number;
  discountPercentage?: number;
  discountedPrice?: number;
  rating?: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images?: string[];
  availabilityStatus: string;
  sku?: string;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recommended');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [searchQuery, setSearchQuery] = useState('');
  const [comparisonProducts, setComparisonProducts] = useLocalStorage<Product[]>('comparisonProducts', []);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useLocalStorage('productFilters', {
    categories: [] as { id: number; name: string }[],
    brands: [] as string[],
    gender: [] as string[],
    rating: null as number | null,
    priceRange: [0, 1000] as number[]
  });
  const location = useLocation();

  useEffect(() => {
    fetchProducts();
  }, [location.search]);

  useEffect(() => {
    handleSortChange(sortBy);
  }, [sortBy]);
  
  useEffect(() => {
    handleFiltersChange({
      categories: activeFilters.categories.map(c => c.name),
      brands: activeFilters.brands,
      gender: activeFilters.gender,
      rating: activeFilters.rating,
      priceRange: activeFilters.priceRange
    });
  }, [searchQuery]);

  const fetchProducts = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const category = urlParams.get('category');
      const url = category ? `/api/products/?search=${category}` : '/api/products/';
      const response = await api.get(url);
      const productData = response.data.products || [];
      setProducts(productData);
      setFilteredProducts(productData);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (filters: any) => {
    let filtered = [...products];
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by categories
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product => 
        filters.categories.includes(product.category)
      );
    }
    
    // Filter by brands
    if (filters.brands.length > 0) {
      filtered = filtered.filter(product => 
        filters.brands.includes(product.brand)
      );
    }
    
    // Filter by gender (check if product category contains gender keywords)
    if (filters.gender.length > 0) {
      filtered = filtered.filter(product => 
        filters.gender.some((gender: string) => 
          product.category?.toLowerCase().includes(gender.toLowerCase()) ||
          product.title?.toLowerCase().includes(gender.toLowerCase())
        )
      );
    }
    
    // Filter by rating
    if (filters.rating !== null) {
      filtered = filtered.filter(product => 
        (product.rating || 0) >= filters.rating
      );
    }
    
    // Filter by price range
    filtered = filtered.filter(product => {
      const price = (product.discountPercentage || 0) > 0 
        ? product.price * (1 - (product.discountPercentage || 0) / 100)
        : product.price;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });
    
    // Update active filters for chips
    const categoryObjects = filters.categories.map((catName: string) => ({
      id: catName,
      name: catName
    }));
    
    setActiveFilters({
      categories: categoryObjects,
      brands: filters.brands,
      gender: filters.gender,
      rating: filters.rating,
      priceRange: filters.priceRange
    });
    
    setFilteredProducts(filtered);
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    let sorted = [...filteredProducts];
    
    switch (newSortBy) {
      case 'price_low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        sorted.sort((a, b) => b.id - a.id);
        break;
      default:
        break;
    }
    
    setFilteredProducts(sorted);
  };

  const handleRemoveFilter = (type: string, value: any) => {
    const newFilters = { ...activeFilters };
    
    switch (type) {
      case 'category':
        newFilters.categories = newFilters.categories.filter(c => c.id !== value);
        break;
      case 'brand':
        newFilters.brands = newFilters.brands.filter(b => b !== value);
        break;
      case 'gender':
        newFilters.gender = newFilters.gender.filter(g => g !== value);
        break;
      case 'rating':
        newFilters.rating = null;
        break;
      case 'priceRange':
        newFilters.priceRange = [0, 1000];
        break;
    }
    
    setActiveFilters(newFilters);
    handleFiltersChange({
      categories: newFilters.categories.map(c => c.name),
      brands: newFilters.brands,
      gender: newFilters.gender,
      rating: newFilters.rating,
      priceRange: newFilters.priceRange
    });
  };

  const handleClearAllFilters = () => {
    const emptyFilters = {
      categories: [],
      brands: [],
      gender: [],
      rating: null,
      priceRange: [0, 1000]
    };
    setActiveFilters(emptyFilters);
    handleFiltersChange(emptyFilters);
  };

  const handleToggleCompare = (productId: number, isAdding: boolean) => {
    if (isAdding) {
      if (comparisonProducts.length >= 3) {
        alert('You can compare up to 3 products at a time');
        return;
      }
      const product = products.find(p => p.id === productId);
      if (product) {
        setComparisonProducts(prev => [...prev, product]);
      }
    } else {
      setComparisonProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  const addToCart = async (productId: number) => {
    try {
      await api.post('/api/cart/add', {
        product_id: productId,
        quantity: 1
      });
      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Please login to add items to cart');
    }
  };

  if (loading) {
    return (
      <Container className="py-16">
        <Loading size="large" text="Loading products..." />
      </Container>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Container maxWidth="xl" className="py-8">
        <Breadcrumb items={[
          { label: 'Store', path: '/' },
          { label: 'Products' }
        ]} />
        
        <h1 className="text-heading-1 text-primary text-center mb-8 mt-4">
          Our Products
        </h1>
        
        <div className="flex gap-6">
          {/* Desktop Filter Sidebar */}
          <div className="hidden md:block">
            <FilterSidebar 
              onFiltersChange={handleFiltersChange}
              activeFilters={activeFilters}
            />
          </div>
          
          {/* Mobile Filter Drawer */}
          <MobileFilterDrawer
            isOpen={mobileFilterOpen}
            onClose={() => setMobileFilterOpen(!mobileFilterOpen)}
            onFiltersChange={handleFiltersChange}
            activeFilters={activeFilters}
          />
          
          <div className="flex-1">
            <div className="mb-6">
              <SearchAutocomplete
                onSearch={setSearchQuery}
                suggestions={Array.from(new Set(products.map(p => p.brand))).slice(0, 10)}
                placeholder="Search products, brands, categories..."
              />
            </div>
            
            <FilterChips
              activeFilters={activeFilters}
              onRemoveFilter={handleRemoveFilter}
              onClearAll={handleClearAllFilters}
            />
            
            <div className="flex items-center justify-between mb-6">
              <ProductSorting 
                sortBy={sortBy}
                onSortChange={handleSortChange}
                totalProducts={filteredProducts.length}
                view={view}
                onViewChange={setView}
              />
              
              {comparisonProducts.length > 0 && (
                <button
                  onClick={() => setIsComparisonOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Compare ({comparisonProducts.length})
                </button>
              )}
            </div>
            
            {/* Paginated Products */}
            {(() => {
              const startIndex = (currentPage - 1) * itemsPerPage;
              const endIndex = startIndex + itemsPerPage;
              const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
              const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
              
              return (
                <>
                  {view === 'grid' ? (
                    <Grid container spacing={3}>
                      {paginatedProducts.map((product) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
                          <ProductCard 
                            product={product} 
                            onAddToCart={addToCart}
                            onQuickView={(product) => setQuickViewProduct(product)}
                            onToggleCompare={handleToggleCompare}
                            isInComparison={comparisonProducts.some(p => p.id === product.id)}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <div className="space-y-4">
                      {paginatedProducts.map((product) => (
                        <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 flex gap-4 hover:shadow-md transition-shadow">
                          <img
                            src={product.thumbnail || '/placeholder-image.jpg'}
                            alt={product.title}
                            className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 dark:text-white mb-1">{product.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{product.brand}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">{product.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                                <span className="text-yellow-400">★ {(product.rating || 0).toFixed(1)}</span>
                              </div>
                              <button
                                onClick={() => addToCart(product.id)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                              >
                                Add to Cart
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    totalItems={filteredProducts.length}
                  />
                </>
              );
            })()}
            

            
            {filteredProducts.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No products found matching your filters.
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* URL Filter Synchronization */}
        <URLFilterSync
          activeFilters={activeFilters}
          onFiltersChange={handleFiltersChange}
        />
        
        {/* Quick View Modal */}
        <QuickViewModal
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={addToCart}
        />
        
        {/* Product Comparison Modal */}
        <ProductComparison
          products={comparisonProducts}
          isOpen={isComparisonOpen}
          onClose={() => setIsComparisonOpen(false)}
          onAddToCart={addToCart}
        />
      </Container>
    </div>
  );
};

export default ProductList;