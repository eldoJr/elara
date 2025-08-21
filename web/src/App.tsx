import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from './contexts/ThemeContext';
import { SearchProvider, useSearch } from './components/common/SearchProvider';
import { CartProvider } from './contexts/CartContext';
import { ToastProvider } from './contexts/ToastContext';
import ToastContainer from './components/common/ToastContainer';
import Navbar from './components/common/Navbar';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './components/common/Home';
import ProductList from './components/products/ProductList';
import ProductDetail from './components/products/ProductDetail';
import Cart from './components/cart/Cart';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/profile/Profile';
import Orders from './components/orders/Orders';
import './App.css';

const MainContent: React.FC = () => {
  const { isSearchActive } = useSearch();
  
  return (
    <main className={`min-h-screen bg-surface-secondary transition-all duration-300 ${
      isSearchActive ? 'blur-sm' : ''
    }`}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </main>
  );
};

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <CartProvider>
          <SearchProvider>
            <MuiThemeProvider theme={theme}>
              <CssBaseline />
              <Router>
              <div className="App">
                <Navbar />
                <Header />
                <MainContent />
                <Footer />
                <ToastContainer />
              </div>
              </Router>
            </MuiThemeProvider>
          </SearchProvider>
        </CartProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;