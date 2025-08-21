import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Chip } from '@mui/material';
import api from '../../config/api';
import Loading from '../common/Loading';
import Breadcrumb from '../common/Breadcrumb';

interface OrderItem {
  product_name: string;
  quantity: number;
  price: string;
}

interface Order {
  id: number;
  status: string;
  total_amount: string;
  created_at: string;
  items: OrderItem[];
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/api/orders/');
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'PROCESSING': return 'info';
      case 'SHIPPED': return 'primary';
      case 'DELIVERED': return 'success';
      case 'CANCELLED': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Container className="py-16">
        <Loading size="large" text="Loading orders..." />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="py-8">
      <Breadcrumb items={[
        { label: 'Store', path: '/' },
        { label: 'Orders' }
      ]} />
      
      <h1 className="text-heading-1 text-primary text-center mb-12 mt-8">
        My Orders
      </h1>
      
      {orders.length === 0 ? (
        <div className="card spacing-lg text-center">
          <h3 className="text-heading-3 text-primary">
            You haven't placed any orders yet
          </h3>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="card spacing-md">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-heading-3 text-primary">
                    Order #{order.id}
                  </h3>
                  <p className="text-body-small text-secondary">
                    Placed on {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="text-right">
                  <Chip
                    label={order.status}
                    color={getStatusColor(order.status) as any}
                    className="mb-2"
                  />
                  <span className="text-heading-3 text-primary">
                    Total: ${order.total_amount}
                  </span>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="text-heading-3 text-primary mb-2">
                  Items:
                </h4>
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between py-1">
                    <span>{item.quantity}x {item.product_name}</span>
                    <span>${item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
};

export default Orders;