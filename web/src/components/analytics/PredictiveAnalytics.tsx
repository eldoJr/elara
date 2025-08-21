import React, { useState, useEffect } from 'react';
import { TrendingUp, Package, DollarSign, Users, BarChart3 } from 'lucide-react';
import axios from 'axios';

interface AnalyticsData {
  demandForecast?: any;
  inventoryOptimization?: any;
  priceAnalysis?: any;
  customerLTV?: any;
}

const PredictiveAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('demand');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [productId, setProductId] = useState('1');

  const fetchDemandForecast = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/api/analytics/demand-forecast/`, {
        params: { product_id: productId, days: 30 }
      });
      setAnalyticsData(prev => ({ ...prev, demandForecast: response.data }));
    } catch (error) {
      console.error('Demand forecast error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInventoryOptimization = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/analytics/inventory-optimization/');
      setAnalyticsData(prev => ({ ...prev, inventoryOptimization: response.data }));
    } catch (error) {
      console.error('Inventory optimization error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPriceAnalysis = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/api/analytics/price-analysis/`, {
        params: { product_id: productId }
      });
      setAnalyticsData(prev => ({ ...prev, priceAnalysis: response.data }));
    } catch (error) {
      console.error('Price analysis error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCustomerLTV = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/analytics/customer-ltv/');
      setAnalyticsData(prev => ({ ...prev, customerLTV: response.data }));
    } catch (error) {
      console.error('Customer LTV error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    switch (activeTab) {
      case 'demand':
        fetchDemandForecast();
        break;
      case 'inventory':
        fetchInventoryOptimization();
        break;
      case 'pricing':
        fetchPriceAnalysis();
        break;
      case 'customer':
        fetchCustomerLTV();
        break;
    }
  }, [activeTab, productId]);

  const tabs = [
    { id: 'demand', label: 'Demand Forecast', icon: TrendingUp },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
    { id: 'customer', label: 'Customer LTV', icon: Users }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center space-x-3 mb-8">
        <BarChart3 className="w-8 h-8 text-blue-500" />
        <h1 className="text-3xl font-bold text-gray-800">Predictive Analytics</h1>
      </div>

      {(activeTab === 'demand' || activeTab === 'pricing') && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product ID for Analysis
          </label>
          <input
            type="number"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter product ID"
          />
        </div>
      )}

      <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">Analyzing data...</span>
          </div>
        ) : (
          <div>
            {activeTab === 'demand' && analyticsData.demandForecast && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Demand Forecast</h2>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">AI Analysis:</p>
                  <div className="text-gray-800 whitespace-pre-wrap">
                    {analyticsData.demandForecast.ai_forecast}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'inventory' && analyticsData.inventoryOptimization && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Inventory Optimization</h2>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Analyzed {analyticsData.inventoryOptimization.analyzed_products} products
                  </p>
                  <div className="text-gray-800 whitespace-pre-wrap">
                    {analyticsData.inventoryOptimization.recommendations}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'pricing' && analyticsData.priceAnalysis && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Price Analysis</h2>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Current Price: ${analyticsData.priceAnalysis.current_price}
                  </p>
                  <div className="text-gray-800 whitespace-pre-wrap">
                    {analyticsData.priceAnalysis.analysis}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'customer' && analyticsData.customerLTV && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Customer Lifetime Value</h2>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        ${analyticsData.customerLTV.current_metrics?.total_spent || 0}
                      </div>
                      <div className="text-sm text-gray-600">Total Spent</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {analyticsData.customerLTV.current_metrics?.order_count || 0}
                      </div>
                      <div className="text-sm text-gray-600">Orders</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {analyticsData.customerLTV.current_metrics?.behavior_events || 0}
                      </div>
                      <div className="text-sm text-gray-600">Interactions</div>
                    </div>
                  </div>
                  <div className="text-gray-800 whitespace-pre-wrap">
                    {analyticsData.customerLTV.clv_prediction}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictiveAnalytics;