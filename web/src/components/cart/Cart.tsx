import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShoppingCart } from 'lucide-react';
import axios from 'axios';
import Loading from '../common/Loading';
import Breadcrumb from '../common/Breadcrumb';

interface CartItem {
  id: number;
  product_id: number;
  product_name: string;
  price: string;
  quantity: number;
  total: string;
  image: string | null;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState('0.00');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await axios.get('/api/cart/');
      setCartItems(response.data.cart_items);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setUpdating(itemId);
    try {
      await axios.post('/api/cart/update/', {
        item_id: itemId,
        quantity: newQuantity
      });
      fetchCart();
    } catch (error) {
      console.error('Error updating cart:', error);
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (itemId: number) => {
    setUpdating(itemId);
    try {
      await axios.post('/api/cart/remove/', {
        item_id: itemId
      });
      fetchCart();
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setUpdating(null);
    }
  };

  const checkout = async () => {
    try {
      const response = await axios.post('/api/orders/create/');
      alert('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error placing order');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <Loading size="large" text="Loading cart..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <Breadcrumb items={[
          { label: 'Store', path: '/' },
          { label: 'Cart' }
        ]} />
        
        <div className="mt-8 mb-12">
          <div className="flex items-center gap-3 mb-4">
            <ShoppingCart className="w-8 h-8 text-orange-500" />
            <h1 className="text-4xl font-light text-gray-900 dark:text-white">
              Shopping Cart
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
        
        {cartItems.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 p-12 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-light text-gray-900 dark:text-white mb-4">
              Your cart is empty
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Discover amazing products and add them to your cart
            </p>
            <button 
              onClick={() => navigate('/products')}
              className="bg-gradient-to-r from-orange-500 via-pink-500 to-blue-600 hover:from-orange-600 hover:via-pink-600 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 mx-auto"
            >
              <ShoppingBag className="w-5 h-5" />
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={item.image || '/placeholder-image.jpg'}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-grow min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                        {item.product_name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        ${item.price} each
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || updating === item.id}
                        className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      
                      <span className="text-lg font-medium text-gray-900 dark:text-white min-w-8 text-center">
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={updating === item.id}
                        className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-xl font-semibold text-gray-900 dark:text-white">
                        ${item.total}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={updating === item.id}
                      className="w-10 h-10 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {updating === item.id ? (
                        <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-6 sticky top-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Order Summary
                </h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>${total}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Shipping</span>
                    <span className="text-green-600 dark:text-green-400">Free</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex justify-between text-xl font-semibold text-gray-900 dark:text-white">
                      <span>Total</span>
                      <span>${total}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={checkout}
                    className="w-full bg-gradient-to-r from-orange-500 via-pink-500 to-blue-600 hover:from-orange-600 hover:via-pink-600 hover:to-blue-700 text-white py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={() => navigate('/products')}
                    className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;