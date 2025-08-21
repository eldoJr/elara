import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import HeroSection from '../sections/HeroSection';
import SearchSection from '../sections/SearchSection';
import RecommendationsSection from '../sections/RecommendationsSection';
import AIAssistantModal from '../modals/AIAssistantModal';

interface Product {
  id: number;
  title: string;
  thumbnail: string;
  price: number;
}

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await api.get('/api/products/');
      const products = response.data.products || [];
      setFeaturedProducts(products.slice(0, 4));
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <HeroSection 
        featuredProducts={featuredProducts} 
        onAIAssistantClick={() => setShowAIAssistant(true)} 
      />
      <SearchSection />
      <RecommendationsSection />
      <AIAssistantModal 
        isOpen={showAIAssistant} 
        onClose={() => setShowAIAssistant(false)} 
      />
    </div>
  );
};

export default Home;