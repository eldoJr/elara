import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Button, IconButton } from '@mui/material';
import { Delete, Add, Remove } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
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
    
    try {
      await axios.post('/api/cart/update/', {
        item_id: itemId,
        quantity: newQuantity
      });
      fetchCart();
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      await axios.post('/api/cart/remove/', {
        item_id: itemId
      });
      fetchCart();
    } catch (error) {
      console.error('Error removing item:', error);
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
      <Container className="py-16">
        <Loading size="large" text="Loading cart..." />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="py-8">
      <Breadcrumb items={[
        { label: 'Store', path: '/' },
        { label: 'Cart' }
      ]} />
      
      <h1 className="text-heading-1 text-primary text-center mb-12 mt-8">
        Shopping Cart
      </h1>
      
      {cartItems.length === 0 ? (
        <div className="card spacing-lg text-center">
          <h3 className="text-heading-3 text-primary mb-4">
            Your cart is empty
          </h3>
          <button className="button-primary" onClick={() => navigate('/products')}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="card spacing-sm">
              <div className="flex items-center gap-4">
                <img
                  src={item.image || '/placeholder-image.jpg'}
                  alt={item.product_name}
                  className="w-20 h-20 object-cover rounded"
                />
                
                <div className="flex-grow">
                  <h3 className="text-heading-3 text-primary">{item.product_name}</h3>
                  <p className="text-body-small text-secondary">
                    ${item.price} each
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <IconButton
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <Remove />
                  </IconButton>
                  
                  <span className="text-body text-primary mx-2">
                    {item.quantity}
                  </span>
                  
                  <IconButton
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Add />
                  </IconButton>
                </div>
                
                <span className="text-heading-3 text-primary min-w-20 text-right">
                  ${item.total}
                </span>
                
                <IconButton
                  onClick={() => removeItem(item.id)}
                  color="error"
                >
                  <Delete />
                </IconButton>
              </div>
            </div>
          ))}
          
          <div className="card spacing-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-heading-2 text-primary">Total: ${total}</h2>
              <div className="flex gap-sm">
                <button
                  className="button-secondary"
                  onClick={() => navigate('/products')}
                >
                  Continue Shopping
                </button>
                <button
                  className="button-primary"
                  onClick={checkout}
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default Cart;