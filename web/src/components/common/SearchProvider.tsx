import React, { createContext, useContext, useState } from 'react';

interface SearchContextType {
  isSearchActive: boolean;
  setIsSearchActive: (active: boolean) => void;
  toggleSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSearchActive, setIsSearchActive] = useState(false);

  const toggleSearch = () => {
    setIsSearchActive(prev => !prev);
  };

  return (
    <SearchContext.Provider value={{ isSearchActive, setIsSearchActive, toggleSearch }}>
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