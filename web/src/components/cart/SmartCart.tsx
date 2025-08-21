import React, { useState, useEffect } from 'react';
import { ShoppingCart, Zap, Package, DollarSign, TrendingUp } from 'lucide-react';
import axios from 'axios';

interface Bundle {
  name: string;
  products: string[];
  original_total: number;
  discounted_total: number;
  savings: number;
  discount_percentage: number;
}

interface CartOptimization {
  current_total: number;
  optimization_suggestions: string;
  smart_bundles: Bundle[];
  potential_savings: number;
}

const SmartCart: React.FC = () => {
  const [optimization, setOptimization] = useState<CartOptimization | null>(null);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [recovery, setRecovery] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCartOptimization();
    fetchSmartBundles();
    fetchCartRecovery();
  }, []);

  const fetchCartOptimization = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/cart/optimize/');
      if (response.data.status === 'success') {
        setOptimization(response.data);
      }
    } catch (error) {
      console.error('Cart optimization error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSmartBundles = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/cart/bundles/');
      setBundles(response.data.bundles || []);
    } catch (error) {
      console.error('Smart bundles error:', error);
    }
  };

  const fetchCartRecovery = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/cart/recovery/');
      if (response.data.status === 'success') {
        setRecovery(response.data);
      }
    } catch (error) {
      console.error('Cart recovery error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Optimizing your cart...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center space-x-3 mb-8">
        <ShoppingCart className="w-8 h-8 text-blue-500" />
        <h1 className="text-3xl font-bold text-gray-800">Smart Cart</h1>
      </div>

      {/* Cart Optimization */}
      {optimization && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Zap className="w-6 h-6 text-yellow-500" />
            <h2 className="text-xl font-bold text-gray-800">Cart Optimization</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="w-5 h-5 text-blue-500" />
                <span className="font-medium text-gray-700">Current Total</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">${optimization.current_total}</p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span className="font-medium text-gray-700">Potential Savings</span>
              </div>
              <p className="text-2xl font-bold text-green-600">${optimization.potential_savings}</p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">AI Optimization Suggestions</h3>
            <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
              {optimization.optimization_suggestions}
            </p>
          </div>
        </div>
      )}

      {/* Smart Bundles */}
      {bundles.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <Package className="w-6 h-6 text-purple-500" />
            <h2 className="text-xl font-bold text-gray-800">Smart Bundles</h2>
          </div>
          
          <div className="grid gap-4">
            {bundles.map((bundle, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">{bundle.name}</h3>
                    <p className="text-sm text-gray-600">
                      {bundle.products.join(' + ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 line-through">
                      ${bundle.original_total}
                    </div>
                    <div className="text-lg font-bold text-green-600">
                      ${bundle.discounted_total}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      Save ${bundle.savings}
                    </span>
                    <span className="text-sm text-gray-600">
                      {bundle.discount_percentage}% off
                    </span>
                  </div>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm">
                    Add Bundle
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cart Recovery */}
      {recovery && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Complete Your Purchase</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-orange-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-700 mb-2">Cart Value</h3>
              <p className="text-2xl font-bold text-orange-600">${recovery.cart_value}</p>
              <p className="text-sm text-gray-600">{recovery.items_count} items</p>
            </div>
            
            <div className="bg-red-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-700 mb-2">Urgency Factors</h3>
              {recovery.urgency_factors?.map((factor: string, index: number) => (
                <p key={index} className="text-sm text-red-600 mb-1">{factor}</p>
              ))}
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Recovery Strategy</h3>
            <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
              {recovery.recovery_strategy}
            </p>
          </div>
          
          {recovery.suggested_incentives && recovery.suggested_incentives.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Available Incentives</h3>
              <div className="grid gap-3">
                {recovery.suggested_incentives.map((incentive: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-green-800 font-medium">{incentive.description}</span>
                    <span className="text-green-600 font-bold">Save ${incentive.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SmartCart;