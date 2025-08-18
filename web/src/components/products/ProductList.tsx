import React, { useState, useEffect } from 'react';
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
    gender: '' as string,
    colors: [] as string[],
    discount: '' as string,
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
    if (products.length > 0) {
      const filters = {
        categories: activeFilters.categories.map(c => c.name),
        brands: activeFilters.brands,
        gender: activeFilters.gender,
        colors: activeFilters.colors,
        discount: activeFilters.discount,
        rating: activeFilters.rating,
        priceRange: activeFilters.priceRange
      };
      handleFiltersChange(filters);
    }
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
    
    // Filter by gender
    if (filters.gender) {
      filtered = filtered.filter(product => 
        product.category?.toLowerCase().includes(filters.gender.toLowerCase()) ||
        product.title?.toLowerCase().includes(filters.gender.toLowerCase())
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
      colors: filters.colors,
      discount: filters.discount,
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
        newFilters.gender = '';
        break;
      case 'color':
        newFilters.colors = newFilters.colors.filter(c => c !== value);
        break;
      case 'discount':
        newFilters.discount = '';
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
      colors: newFilters.colors,
      discount: newFilters.discount,
      rating: newFilters.rating,
      priceRange: newFilters.priceRange
    });
  };

  const handleClearAllFilters = () => {
    const emptyFilters = {
      categories: [],
      brands: [],
      gender: '',
      colors: [],
      discount: '',
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

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <Loading size="large" text="Loading products..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-1">
          <Breadcrumb items={[
            { label: 'Store', path: '/' },
            { label: 'Products' }
          ]} />
          <h1 className="text-lg font-bold bg-gradient-to-r from-pink-600 via-orange-500 to-blue-600 bg-clip-text text-transparent">
            Our Products
          </h1>
        </div>
        
        <div className="flex gap-6 pb-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block">
            <FilterSidebar 
              onFiltersChange={handleFiltersChange}
              activeFilters={activeFilters}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="mb-6">
              <SearchAutocomplete
                onSearch={setSearchQuery}
                placeholder="Search products..."
              />
            </div>

            {/* Filter Chips */}
            <div className="mb-4">
              <FilterChips
                activeFilters={activeFilters}
                onRemoveFilter={handleRemoveFilter}
                onClearAll={handleClearAllFilters}
              />
            </div>

            {/* Product Sorting */}
            <div className="mb-6">
              <ProductSorting
                sortBy={sortBy}
                onSortChange={handleSortChange}
                totalProducts={filteredProducts.length}
                view={view}
                onViewChange={setView}
              />
            </div>

            {/* Products Grid */}
            <div>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your filters or search terms
                </p>
              </div>
            ) : (
              <>
                <div className={`grid gap-6 mb-8 ${
                  view === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                    : 'grid-cols-1'
                }`}>
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={addToCart}
                      onQuickView={setQuickViewProduct}
                      onToggleCompare={handleToggleCompare}
                      isInComparison={comparisonProducts.some(p => p.id === product.id)}
                      view={view}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(filteredProducts.length / itemsPerPage)}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
            </div>
          </div>
        </div>

        {/* Mobile Filter Button */}
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 bg-gradient-to-r from-pink-500 to-orange-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-50"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </button>

        {/* Mobile Filter Drawer */}
        <MobileFilterDrawer
          open={mobileFilterOpen}
          onClose={() => setMobileFilterOpen(false)}
          onFiltersChange={handleFiltersChange}
          activeFilters={activeFilters}
        />

        {/* Quick View Modal */}
        {quickViewProduct && (
          <QuickViewModal
            product={quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
            onAddToCart={addToCart}
          />
        )}

        {/* Product Comparison */}
        {comparisonProducts.length > 0 && (
          <div className="fixed bottom-6 left-6 z-50">
            <button
              onClick={() => setIsComparisonOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <span>Compare ({comparisonProducts.length})</span>
            </button>
          </div>
        )}

        {isComparisonOpen && (
          <ProductComparison
            products={comparisonProducts}
            onClose={() => setIsComparisonOpen(false)}
            onRemoveProduct={(id) => handleToggleCompare(id, false)}
          />
        )}

        <URLFilterSync activeFilters={activeFilters} />
      </div>
    </div>
  );
};

export default ProductList;