import React, { useState, useEffect } from 'react';
import { Star, TrendingUp, Users, Sparkles } from 'lucide-react';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

interface RecommendedProductsProps {
  type: 'personalized' | 'trending' | 'similar' | 'frequently_bought' | 'top-rated';
  productId?: number;
  limit?: number;
  title?: string;
}

const RecommendedProducts: React.FC<RecommendedProductsProps> = ({
  type,
  productId,
  limit = 6,
  title
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, [type, productId, limit]);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    try {
      const params: any = { type, limit };
      if (productId) {
        params.product_id = productId;
      }

      const response = await axios.get('http://localhost:8000/api/recommendations/', {
        params
      });
      
      setProducts(response.data.recommendations || []);
    } catch (error) {
      console.error('Recommendations error:', error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'personalized':
        return <Sparkles className="w-6 h-6 text-purple-500" />;
      case 'trending':
        return <TrendingUp className="w-6 h-6 text-orange-500" />;
      case 'similar':
        return <Star className="w-6 h-6 text-blue-500" />;
      case 'frequently_bought':
        return <Users className="w-6 h-6 text-green-500" />;
      case 'top-rated':
        return <Star className="w-6 h-6 text-yellow-500" />;
      default:
        return <Star className="w-6 h-6 text-gray-500" />;
    }
  };

  const getDefaultTitle = () => {
    switch (type) {
      case 'personalized':
        return 'Recommended for You';
      case 'trending':
        return 'Trending Now';
      case 'similar':
        return 'Similar Products';
      case 'frequently_bought':
        return 'Frequently Bought Together';
      case 'top-rated':
        return 'Top Rated Products';
      default:
        return 'Recommendations';
    }
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: limit }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 aspect-square rounded-3xl mb-4"></div>
              <div className="h-4 bg-gray-200 rounded-full mb-2"></div>
              <div className="h-6 bg-gray-200 rounded-full w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="group cursor-pointer bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 hover:scale-102 overflow-hidden"
          >
            <div className="aspect-square overflow-hidden">
              <img
                src={product.image || '/api/placeholder/400/400'}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            
            <div className="p-6">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">
                {product.category}
              </p>
              
              <h3 className="font-medium text-gray-900 text-lg mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {product.name}
              </h3>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-light text-gray-900">
                  ${product.price}
                </span>
                
                {product.stock > 0 ? (
                  <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                    In Stock
                  </span>
                ) : (
                  <span className="text-xs text-red-600 font-medium bg-red-50 px-2 py-1 rounded-full">
                    Out of Stock
                  </span>
                )}
              </div>
              
              <button className="w-full bg-black hover:bg-gray-800 text-white py-3 px-6 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedProducts;