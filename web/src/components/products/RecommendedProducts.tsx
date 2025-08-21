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
  type: 'personalized' | 'trending' | 'similar' | 'frequently_bought';
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
        return <Sparkles className="w-5 h-5 text-purple-500" />;
      case 'trending':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'similar':
        return <Star className="w-5 h-5 text-blue-500" />;
      case 'frequently_bought':
        return <Users className="w-5 h-5 text-orange-500" />;
      default:
        return <Star className="w-5 h-5 text-gray-500" />;
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
      default:
        return 'Recommendations';
    }
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex items-center space-x-2 mb-6">
          {getIcon()}
          <h2 className="text-xl font-bold text-gray-800">{title || getDefaultTitle()}</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: limit }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 aspect-square rounded-lg mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
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
      <div className="flex items-center space-x-2 mb-6">
        {getIcon()}
        <h2 className="text-xl font-bold text-gray-800">{title || getDefaultTitle()}</h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="group cursor-pointer bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="aspect-square overflow-hidden rounded-t-lg">
              <img
                src={product.image || '/api/placeholder/200/200'}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            
            <div className="p-3">
              <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                {product.name}
              </h3>
              
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-blue-600">
                  ${product.price}
                </span>
                
                {product.stock > 0 ? (
                  <span className="text-xs text-green-600 font-medium">
                    In Stock
                  </span>
                ) : (
                  <span className="text-xs text-red-600 font-medium">
                    Out of Stock
                  </span>
                )}
              </div>
              
              <p className="text-xs text-gray-500 mt-1">{product.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedProducts;