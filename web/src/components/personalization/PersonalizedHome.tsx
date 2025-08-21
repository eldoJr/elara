import React, { useState, useEffect } from 'react';
import { User, Settings, Palette, Layout } from 'lucide-react';
import axios from 'axios';
import RecommendedProducts from '../products/RecommendedProducts';

interface PersonalizationData {
  layout_type: string;
  category_priorities: string[];
  color_scheme: string;
  ai_recommendations: string;
}

const PersonalizedHome: React.FC = () => {
  const [personalization, setPersonalization] = useState<PersonalizationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPersonalization();
  }, []);

  const fetchPersonalization = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/personalization/ui/');
      if (response.data.status === 'success') {
        setPersonalization(response.data);
      }
    } catch (error) {
      console.error('Personalization error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const isDarkMode = personalization?.color_scheme === 'dark';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        <div className={`rounded-lg p-6 mb-8 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } border`}>
          <div className="flex items-center space-x-3 mb-4">
            <User className="w-6 h-6 text-blue-500" />
            <h1 className="text-2xl font-bold">Your Personalized Experience</h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Layout className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium">Layout Preference</p>
                <p className="text-sm opacity-75 capitalize">{personalization?.layout_type || 'Default'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Palette className="w-5 h-5 text-purple-500" />
              <div>
                <p className="font-medium">Theme</p>
                <p className="text-sm opacity-75 capitalize">{personalization?.color_scheme || 'Light'} Mode</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Settings className="w-5 h-5 text-orange-500" />
              <div>
                <p className="font-medium">Personalization</p>
                <p className="text-sm opacity-75">AI-Optimized</p>
              </div>
            </div>
          </div>
        </div>

        {personalization?.category_priorities && personalization.category_priorities.length > 0 && (
          <div className={`rounded-lg p-6 mb-8 ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border`}>
            <h2 className="text-xl font-bold mb-4">Your Favorite Categories</h2>
            <div className="flex flex-wrap gap-3">
              {personalization.category_priorities.map((category, index) => (
                <span
                  key={index}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    isDarkMode 
                      ? 'bg-blue-900 text-blue-200' 
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        )}

        {personalization?.ai_recommendations && (
          <div className={`rounded-lg p-6 mb-8 ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border`}>
            <h2 className="text-xl font-bold mb-4">AI Personalization Insights</h2>
            <div className={`p-4 rounded-lg ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {personalization.ai_recommendations}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-12">
          <RecommendedProducts type="personalized" limit={8} />
          <RecommendedProducts type="trending" limit={6} />
        </div>
      </div>
    </div>
  );
};

export default PersonalizedHome;