import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useSearch } from './SearchProvider';
import SearchOverlay from './SearchOverlay';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { isSearchActive, setIsSearchActive, toggleSearch } = useSearch();
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('username') !== null;
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/');
  };

  return (
    <div className="relative">
      <div className="bg-gradient-to-r from-orange-50/50 via-pink-50/50 to-blue-50/50 dark:from-orange-950/20 dark:via-pink-950/20 dark:to-blue-950/20 border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            {/* Left Side - Welcome Message */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {isLoggedIn ? (
                    <span>
                      Welcome back, 
                      <span className="font-semibold bg-gradient-to-r from-orange-500 via-pink-500 to-blue-600 bg-clip-text text-transparent ml-1">
                        {username}
                      </span>
                    </span>
                  ) : (
                    <span>
                      Discover amazing products with 
                      <span className="font-semibold bg-gradient-to-r from-orange-500 via-pink-500 to-blue-600 bg-clip-text text-transparent ml-1">
                        AI recommendations
                      </span>
                    </span>
                  )}
                </p>
              </div>
            </div>
            
            {/* Right Side - Actions */}
            <div className="flex items-center space-x-1">
              <button
                onClick={toggleTheme}
                className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <Moon className="w-4 h-4" />
                ) : (
                  <Sun className="w-4 h-4" />
                )}
              </button>
              
              <Link 
                to="/products" 
                className="hidden sm:block text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              >
                Browse
              </Link>
              
              <button 
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                onClick={toggleSearch}
              >
                Search
              </button>
              
              {isLoggedIn ? (
                <div className="flex items-center space-x-1">
                  <Link 
                    to="/profile" 
                    className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-1">
                  <Link
                    to="/register"
                    className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                  >
                    Sign Up
                  </Link>
                  <Link
                    to="/login"
                    className="bg-gradient-to-r from-orange-500 via-pink-500 to-blue-600 hover:from-orange-600 hover:via-pink-600 hover:to-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Search Overlay */}
      <SearchOverlay 
        isOpen={isSearchActive} 
        onClose={() => setIsSearchActive(false)} 
      />
    </div>
  );
};

export default Header;