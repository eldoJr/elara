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

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/');
  };

  return (
    <div className="relative">
      <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Elara Store</h1>
            
            <div className="flex items-center space-x-6">
              <button
                onClick={toggleTheme}
                className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>
              <Link to="/products" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Browse
              </Link>
              <button 
                className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                onClick={toggleSearch}
              >
                Search
              </button>
              
              {isLoggedIn ? (
                <div className="flex items-center space-x-4">
                  <Link to="/profile" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Log In
                </Link>
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