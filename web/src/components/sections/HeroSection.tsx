import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShoppingBag, Zap } from 'lucide-react';

interface HeroSectionProps {
  onAIAssistantClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onAIAssistantClick }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-100 to-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main heading */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-light tracking-tight text-gray-900 mb-6">
            Elara
          </h1>
          <div className="text-2xl md:text-4xl font-light text-gray-600 mb-4">
            The future of
            <span className="block mt-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-medium">
              intelligent shopping
            </span>
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl font-light text-gray-500 mb-12 max-w-3xl mx-auto leading-relaxed">
          Discover products that understand you. Experience shopping reimagined with AI-powered personalization.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link
            to="/products"
            className="group bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-full font-medium transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
          >
            <ShoppingBag className="w-5 h-5" />
            Explore Collection
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <button
            onClick={onAIAssistantClick}
            className="group bg-white hover:bg-gray-50 text-black px-8 py-4 rounded-full font-medium border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
          >
            <Sparkles className="w-5 h-5 text-purple-600" />
            AI Shopping Assistant
            <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform text-yellow-500" />
          </button>
        </div>

        {/* Features highlight */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="group">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">AI-Powered</h3>
            <p className="text-gray-600 font-light">Smart recommendations tailored to your preferences</p>
          </div>
          
          <div className="group">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Curated Selection</h3>
            <p className="text-gray-600 font-light">Premium products from trusted brands worldwide</p>
          </div>
          
          <div className="group">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Lightning Fast</h3>
            <p className="text-gray-600 font-light">Seamless shopping experience with instant delivery</p>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-300 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;