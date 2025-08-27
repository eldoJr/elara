import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import HeroSection from '../sections/HeroSection';
import FeaturedSection from '../sections/FeaturedSection';
import CategoryShowcase from '../sections/CategoryShowcase';
import RecommendationsSection from '../sections/RecommendationsSection';
import NewsletterSection from '../sections/NewsletterSection';
import AIAssistantModal from '../modals/AIAssistantModal';
import ModernLoading from './ModernLoading';

interface Product {
  id: number;
  title: string;
  thumbnail: string;
  price: number;
  brand?: string;
  category?: string;
  discountPercentage?: number;
}

interface Category {
  id: number;
  name: string;
  image?: string;
}

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        api.get('/api/products/'),
        api.get('/api/categories/')
      ]);
      
      const products = productsResponse.data.products || [];
      const cats = categoriesResponse.data || [];
      
      setFeaturedProducts(products.slice(0, 8));
      setCategories(cats.slice(0, 6));
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ModernLoading size="lg" variant="spinner" className="mb-4" />
          <p className="text-gray-600 font-light">Loading your personalized experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <HeroSection onAIAssistantClick={() => setShowAIAssistant(true)} />
      <FeaturedSection products={featuredProducts} />
      <CategoryShowcase categories={categories} />
      <RecommendationsSection />
      <NewsletterSection />
      <AIAssistantModal 
        isOpen={showAIAssistant} 
        onClose={() => setShowAIAssistant(false)} 
      />
    </div>
  );
};

export default Home;