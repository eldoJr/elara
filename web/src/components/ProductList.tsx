import React, { useState, useEffect } from 'react';
import { productAPI } from '../services/api';

interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
  slug: string;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productAPI.getProducts();
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-2 text-gray-900">{product.name}</h3>
            <p className="text-gray-600 mb-4 prose">{product.description}</p>
            <p className="text-2xl font-bold text-blue-600">${product.price}</p>
            <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;