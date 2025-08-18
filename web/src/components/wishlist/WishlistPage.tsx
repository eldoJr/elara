import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Button } from '@mui/material';
import { Share, Delete } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import ProductCard from '../products/ProductCard';
import Breadcrumb from '../common/Breadcrumb';

interface Product {
  id: number;
  title: string;
  name: string;
  description: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  availabilityStatus: string;
}

const WishlistPage: React.FC = () => {
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = () => {
    const stored = localStorage.getItem('wishlist');
    if (stored) {
      setWishlistProducts(JSON.parse(stored));
    }
    setLoading(false);
  };

  const removeFromWishlist = (productId: number) => {
    const updated = wishlistProducts.filter(p => p.id !== productId);
    setWishlistProducts(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
  };

  const clearWishlist = () => {
    setWishlistProducts([]);
    localStorage.removeItem('wishlist');
  };

  const shareWishlist = () => {
    const url = `${window.location.origin}/wishlist/shared/${Date.now()}`;
    navigator.clipboard.writeText(url);
    alert('Wishlist link copied to clipboard!');
  };

  const addToCart = (productId: number) => {
    alert('Product added to cart!');
  };

  if (loading) {
    return (
      <Container className="py-16">
        <div className="text-center">Loading wishlist...</div>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="py-8">
      <Breadcrumb items={[
        { label: 'Home', path: '/' },
        { label: 'Wishlist' }
      ]} />
      
      <div className="flex items-center justify-between mb-8 mt-4">
        <Typography variant="h4" className="font-semibold">
          My Wishlist ({wishlistProducts.length})
        </Typography>
        
        {wishlistProducts.length > 0 && (
          <div className="flex gap-3">
            <Button
              onClick={shareWishlist}
              startIcon={<Share />}
              variant="outlined"
              size="small"
            >
              Share
            </Button>
            <Button
              onClick={clearWishlist}
              startIcon={<Delete />}
              variant="outlined"
              color="error"
              size="small"
            >
              Clear All
            </Button>
          </div>
        )}
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">💝</div>
          <Typography variant="h5" className="mb-4 text-gray-600 dark:text-gray-400">
            Your wishlist is empty
          </Typography>
          <Typography variant="body1" className="mb-6 text-gray-500 dark:text-gray-500">
            Save items you love to your wishlist and never lose track of them.
          </Typography>
          <Button
            component={Link}
            to="/products"
            variant="contained"
            size="large"
          >
            Start Shopping
          </Button>
        </div>
      ) : (
        <Grid container spacing={3}>
          {wishlistProducts.map((product) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
              <ProductCard
                product={product}
                onAddToCart={addToCart}
              />
              <Button
                onClick={() => removeFromWishlist(product.id)}
                variant="outlined"
                color="error"
                size="small"
                className="w-full mt-2"
              >
                Remove from Wishlist
              </Button>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default WishlistPage;