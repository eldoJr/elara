import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Grid, Button, Typography, Box } from '@mui/material';
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

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      fetchProduct(parseInt(id));
    }
  }, [id]);

  const fetchProduct = async (productId: number) => {
    try {
      const response = await api.get(`/api/products/${productId}/`);
      setProduct(response.data);
      setSelectedImage(response.data.thumbnail);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    if (!product) return;
    
    try {
      await api.post('/api/cart/add/', {
        product_id: product.id,
        quantity: quantity
      });
      alert(`Added ${quantity} ${product.title}(s) to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Please login to add items to cart');
    }
  };

  if (loading) {
    return (
      <Container className="py-16">
        <Loading size="large" text="Loading product..." />
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="py-16">
        <Typography variant="h4" className="text-center">
          Product not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="py-8">
      <Breadcrumb items={[
        { label: 'Store', path: '/' },
        { label: 'Products', path: '/products' },
        { label: product.title }
      ]} />

      <Grid container spacing={4} className="mt-4">
        {/* Product Images */}
        <Grid size={{ xs: 12, md: 6 }}>
          <div className="space-y-4">
            <img
              src={selectedImage}
              alt={product.title}
              className="w-full h-96 object-cover rounded-lg border"
            />
            {product.images && product.images.length > 0 && (
              <div className="flex gap-2 overflow-x-auto">
                <img
                  src={product.thumbnail}
                  alt="Thumbnail"
                  className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                    selectedImage === product.thumbnail ? 'border-blue-500' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedImage(product.thumbnail)}
                />
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Product ${index + 1}`}
                    className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                      selectedImage === image ? 'border-blue-500' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedImage(image)}
                  />
                ))}
              </div>
            )}
          </div>
        </Grid>

        {/* Product Info */}
        <Grid size={{ xs: 12, md: 6 }}>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-600">{product.brand}</span>
                <span className="text-sm text-gray-400">•</span>
                <span className="text-sm text-gray-600">SKU: {product.sku}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.title}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  <span className="text-yellow-400 text-lg">★</span>
                  <span className="text-lg font-medium ml-1">{product.rating.toFixed(1)}</span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-600">{product.category}</span>
              </div>
            </div>

            <div className="border-t border-b py-4">
              <div className="flex items-center gap-3">
                {product.discountPercentage > 0 ? (
                  <>
                    <span className="text-3xl font-bold text-green-600">
                      ${product.discountedPrice.toFixed(2)}
                    </span>
                    <span className="text-xl text-gray-500 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                      {product.discountPercentage.toFixed(0)}% OFF
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                product.availabilityStatus === 'In Stock' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {product.availabilityStatus}
              </span>
              {product.stock > 0 && (
                <span className="text-sm text-gray-600">
                  {product.stock} items available
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 pt-4">
              <div className="flex items-center border rounded">
                <button
                  className="px-3 py-2 hover:bg-gray-100"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span className="px-4 py-2 border-x">{quantity}</span>
                <button
                  className="px-3 py-2 hover:bg-gray-100"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
              <Button
                variant="contained"
                size="large"
                onClick={addToCart}
                disabled={product.availabilityStatus === 'Out of Stock'}
                className="flex-1"
              >
                {product.availabilityStatus === 'Out of Stock' ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </div>
          </div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetail;