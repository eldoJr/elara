import React, { createContext, useContext, useState, useCallback } from 'react';

interface SearchContextType {
  isSearchActive: boolean;
  searchQuery: string;
  setIsSearchActive: (active: boolean) => void;
  setSearchQuery: (query: string) => void;
  toggleSearch: () => void;
  openSearch: () => void;
  closeSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSearch = useCallback(() => {
    setIsSearchActive(prev => !prev);
  }, []);

  const openSearch = useCallback(() => {
    setIsSearchActive(true);
  }, []);

  const closeSearch = useCallback(() => {
    setIsSearchActive(false);
    setSearchQuery('');
  }, []);

  return (
    <SearchContext.Provider value={{ 
      isSearchActive, 
      searchQuery,
      setIsSearchActive, 
      setSearchQuery,
      toggleSearch,
      openSearch,
      closeSearch
    }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within SearchProvider');
  }
  return context;
};