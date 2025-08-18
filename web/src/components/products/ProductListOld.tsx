import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardMedia, CardContent, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import api from '../../config/api';
import Loading from '../common/Loading';
import Breadcrumb from '../common/Breadcrumb';

interface Product {
  id: number;
  title: string;
  name: string;
  description: string;
  price: number;
  discountPercentage: number;
  discountedPrice: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  availabilityStatus: string;
  sku: string;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const category = urlParams.get('category');
      const url = category ? `/api/products/?search=${category}` : '/api/products/';
      const response = await api.get(url);
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: number) => {
    try {
      await api.post('/api/cart/add', {
        product_id: productId,
        quantity: 1
      });
      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Please login to add items to cart');
    }
  };

  if (loading) {
    return (
      <Container className="py-16">
        <Loading size="large" text="Loading products..." />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="py-8">
      <Breadcrumb items={[
        { label: 'Store', path: '/' },
        { label: 'Products' }
      ]} />
      
      <h1 className="text-heading-1 text-primary text-center mb-12 mt-8">
        Our Products
      </h1>
      
      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
            <div className="card h-full flex flex-col">
              <div className="relative">
                <img
                  src={product.thumbnail || '/placeholder-image.jpg'}
                  alt={product.title}
                  className="h-48 w-full object-cover rounded-t-lg"
                />
                {(product.discountPercentage || 0) > 0 && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                    -{(product.discountPercentage || 0).toFixed(0)}%
                  </div>
                )}
              </div>
              <div className="spacing-sm flex-grow flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-gray-600 ml-1">{(product.rating || 0).toFixed(1)}</span>
                  </div>
                  <span className="text-xs text-gray-500">{product.brand}</span>
                </div>
                <h2 className="text-heading-3 text-primary mb-2">
                  {product.title}
                </h2>
                <p className="text-body-small text-secondary mb-2 flex-grow">
                  {(product.description || '').substring(0, 100)}...
                </p>
                <p className="text-caption text-tertiary mb-2">
                  {product.category || 'Uncategorized'}
                </p>
                <div className="flex items-center gap-2 mb-4">
                  {(product.discountPercentage || 0) > 0 ? (
                    <>
                      <span className="text-heading-3 text-accent">
                        ${((product.price || 0) * (1 - (product.discountPercentage || 0) / 100)).toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        ${(product.price || 0).toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className="text-heading-3 text-accent">
                      ${(product.price || 0).toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="flex gap-xs mt-auto">
                  <button
                    className="button-primary text-sm flex-1"
                    onClick={() => addToCart(product.id)}
                    disabled={(product.availabilityStatus || product.stock === 0) === 'Out of Stock'}
                  >
                    {(product.availabilityStatus === 'Out of Stock' || product.stock === 0) ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                  <Link
                    to={`/products/${product.id}`}
                    className="button-secondary text-sm px-3"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProductList;