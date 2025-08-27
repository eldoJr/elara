import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import api from '../../config/api';
import Loading from '../common/Loading';
import Breadcrumb from '../common/Breadcrumb';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../contexts/ToastContext';

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
  const { updateCartCount } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await api.get('/api/cart/');
      setCartItems(response.data.cart_items);
      setTotal(response.data.total);
      updateCartCount();
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
      await api.post('/api/cart/update/', {
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
      await api.post('/api/cart/remove/', {
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
      await api.post('/api/orders/create/');
      updateCartCount();
      showToast('Order placed successfully!', 'success');
      navigate('/orders');
    } catch (error) {
      console.error('Error creating order:', error);
      showToast('Error placing order', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loading size="large" text="Loading cart..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <Breadcrumb items={[
          { label: 'Store', path: '/' },
          { label: 'Cart' }
        ]} />
        
        <div className="mt-8 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingCart className="w-6 h-6 text-blue-500" />
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Shopping Cart
            </h1>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
          </p>
        </div>
        
        {cartItems.length === 0 ? (
          <div className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
            <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Your cart is empty
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Add some products to get started
            </p>
            <button 
              onClick={() => navigate('/products')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image || '/placeholder-image.jpg'}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-grow min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {item.product_name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        ${item.price}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || updating === item.id}
                        className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      
                      <span className="text-sm font-medium text-gray-900 dark:text-white min-w-6 text-center">
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={updating === item.id}
                        className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        ${item.total}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={updating === item.id}
                      className="w-8 h-8 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 disabled:opacity-50 transition-colors"
                    >
                      {updating === item.id ? (
                        <div className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800 p-6 sticky top-8">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Order Summary
                </h2>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>${total}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Shipping</span>
                    <span className="text-green-600 dark:text-green-400">Free</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                    <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-white">
                      <span>Total</span>
                      <span>${total}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={checkout}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors"
                  >
                    Checkout
                  </button>
                  
                  <button
                    onClick={() => navigate('/products')}
                    className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
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