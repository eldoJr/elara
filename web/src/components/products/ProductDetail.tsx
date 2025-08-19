import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  const [currentId, setCurrentId] = useState<string | null>(null);

  useEffect(() => {
    if (id && id !== currentId) {
      setCurrentId(id);
      setLoading(true);
      setProduct(null);
      setSelectedImage('');
      setQuantity(1);
      fetchProduct(parseInt(id));
    }
  }, [id, currentId]);

  const fetchProduct = async (productId: number) => {
    try {
      console.log('Fetching product with ID:', productId);
      const response = await api.get(`/api/products/${productId}/`);
      console.log('Product data received:', response.data);
      setProduct(response.data);
      setSelectedImage(response.data.thumbnail);
    } catch (error) {
      console.error('Error fetching product:', error);
      setProduct(null);
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <Loading size="large" text="Loading product..." />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Product not found
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb items={[
          { label: 'Store', path: '/' },
          { label: 'Products', path: '/products' },
          { label: product.title }
        ]} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Product Images */}
          <div className="space-y-4">
            <img
              src={selectedImage}
              alt={product.title}
              className="w-full h-[500px] object-cover rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg"
            />
            {product.images && product.images.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                <img
                  src={product.thumbnail}
                  alt="Thumbnail"
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition-all ${
                    selectedImage === product.thumbnail 
                      ? 'border-pink-500 ring-2 ring-pink-200' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-pink-300'
                  }`}
                  onClick={() => setSelectedImage(product.thumbnail)}
                />
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Product ${index + 1}`}
                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition-all ${
                      selectedImage === image 
                        ? 'border-pink-500 ring-2 ring-pink-200' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-pink-300'
                    }`}
                    onClick={() => setSelectedImage(image)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">{product.brand || 'Unknown Brand'}</span>
                <span className="text-sm text-gray-400">•</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">SKU: {product.sku || 'N/A'}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                {product.title}
              </h1>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center">
                  <span className="text-yellow-400 text-lg">★</span>
                  <span className="text-lg font-medium ml-1 text-gray-900 dark:text-white">{(product.rating || 0).toFixed(1)}</span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">{product.category || 'Uncategorized'}</span>
              </div>
            </div>

            <div className="border-t border-b border-gray-200 dark:border-gray-700 py-6">
              <div className="flex items-center gap-3">
                {(product.discountPercentage || 0) > 0 ? (
                  <>
                    <span className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent">
                      ${((product.price || 0) * (1 - (product.discountPercentage || 0) / 100)).toFixed(2)}
                    </span>
                    <span className="text-xl text-gray-500 line-through">
                      ${(product.price || 0).toFixed(2)}
                    </span>
                    <span className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {(product.discountPercentage || 0).toFixed(0)}% OFF
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent">
                    ${(product.price || 0).toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Description</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                product.availabilityStatus === 'In Stock' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {product.availabilityStatus}
              </span>
              {(product.stock || 0) > 0 && (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {product.stock || 0} items available
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 pt-4">
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                <button
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-l-lg"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span className="px-4 py-2 border-x border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium">{quantity}</span>
                <button
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-r-lg"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
              <button
                onClick={addToCart}
                disabled={product.availabilityStatus === 'Out of Stock' || (product.stock || 0) === 0}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {(product.availabilityStatus === 'Out of Stock' || (product.stock || 0) === 0) ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;