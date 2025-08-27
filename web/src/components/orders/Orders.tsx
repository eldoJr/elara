import React, { useState, useEffect } from 'react';
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



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 flex items-center justify-center">
        <Loading size="large" text="Loading orders..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Breadcrumb items={[
          { label: 'Store', path: '/' },
          { label: 'Orders' }
        ]} />
        
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white text-center mb-8 mt-6">
          My Orders
        </h1>
        
        {orders.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              You haven't placed any orders yet
            </h3>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Order #{order.id}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Placed on {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 ${
                      order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                      order.status === 'SHIPPED' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                      order.status === 'DELIVERED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      order.status === 'CANCELLED' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {order.status}
                    </span>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      Total: ${order.total_amount}
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="text-base font-medium text-gray-900 dark:text-white mb-3">
                    Items:
                  </h4>
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between py-2 text-sm">
                      <span className="text-gray-700 dark:text-gray-300">{item.quantity}x {item.product_name}</span>
                      <span className="font-medium text-gray-900 dark:text-white">${item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;