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
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../contexts/ToastContext';

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
  const [sortBy, setSortBy] = useState('newest');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [isMobile, setIsMobile] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const { updateCartCount } = useCart();
  const { showToast } = useToast();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [searchQuery, setSearchQuery] = useState('');
  const [comparisonProducts, setComparisonProducts] = useLocalStorage<Product[]>('comparisonProducts', []);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
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
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [location.search]);

  useEffect(() => {
    handleSortChange(sortBy);
  }, [sortBy]);

  useEffect(() => {
    if (searchQuery && products.length > 0) {
      const filtered = products.filter(product => 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else if (!searchQuery && products.length > 0) {
      setFilteredProducts(products);
    }
  }, [searchQuery, products]);
  


  const fetchProducts = async () => {
    try {
      const response = await api.get('/api/products/');
      const productData = response.data.products || [];
      const sortedData = productData.sort((a: Product, b: Product) => b.id - a.id);
      setProducts(sortedData);
      setFilteredProducts(sortedData);
      
      const urlParams = new URLSearchParams(window.location.search);
      const searchParam = urlParams.get('search');
      if (searchParam) {
        setSearchQuery(searchParam);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setFilteredProducts([]);
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
        showToast('You can compare up to 3 products at a time', 'warning');
        return;
      }
      const product = products.find(p => p.id === productId);
      if (product) {
        setComparisonProducts(prev => [...prev, product]);
        showToast('Product added to comparison', 'info');
      }
    } else {
      setComparisonProducts(prev => prev.filter(p => p.id !== productId));
      showToast('Product removed from comparison', 'info');
    }
  };

  const addToCart = async (productId: number) => {
    try {
      await api.post('/api/cart/add/', {
        product_id: productId,
        quantity: 1
      });
      updateCartCount();
      showToast('Product added to cart!', 'success');
    } catch (error) {
      console.error('Error adding to cart:', error);
      showToast('Please login to add items to cart', 'error');
    }
  };

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loading size="large" text="Loading products..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-2">
          <Breadcrumb items={[
            { label: 'Store', path: '/' },
            { label: 'Products' }
          ]} />
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            Our Products
          </h1>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 pb-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:w-64 xl:w-72 flex-shrink-0">
            <FilterSidebar 
              onFiltersChange={handleFiltersChange}
              activeFilters={activeFilters}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Search Bar */}
            <div className="mb-4 sm:mb-6">
              <SearchAutocomplete
                onSearch={setSearchQuery}
                placeholder="Search products..."
              />
            </div>

            {/* Filter Chips */}
            <div className="mb-3 sm:mb-4">
              <FilterChips
                activeFilters={activeFilters}
                onRemoveFilter={handleRemoveFilter}
                onClearAll={handleClearAllFilters}
              />
            </div>

            {/* Product Sorting */}
            <div className="mb-4 sm:mb-6">
              <ProductSorting
                sortBy={sortBy}
                onSortChange={handleSortChange}
                totalProducts={filteredProducts.length}
                view={isMobile ? 'list' : view}
                onViewChange={isMobile ? () => {} : setView}
              />
            </div>

            {/* Products Grid */}
            <div>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <div className="text-4xl sm:text-6xl mb-4">🔍</div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No products found
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 px-4">
                  Try adjusting your filters or search terms
                </p>
              </div>
            ) : (
              <>
                <div className={`grid gap-4 sm:gap-6 mb-6 sm:mb-8 ${
                  (isMobile || view === 'list')
                    ? 'grid-cols-1' 
                    : 'grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'
                }`}>
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={addToCart}
                      onQuickView={setQuickViewProduct}
                      onToggleCompare={handleToggleCompare}
                      isInComparison={comparisonProducts.some(p => p.id === product.id)}
                      view={isMobile ? 'list' : view}
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
          className="lg:hidden fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 sm:p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-50"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50">
            <button
              onClick={() => setIsComparisonOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm sm:text-base"
            >
              <span className="hidden xs:inline">Compare ({comparisonProducts.length})</span>
              <span className="xs:hidden">{comparisonProducts.length}</span>
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