import api from '../config/api';

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  products?: Product[];
  suggestions?: string[];
  actions?: ChatAction[];
  status?: 'sending' | 'sent' | 'delivered' | 'failed';
}

export interface ChatAction {
  type: 'view_product' | 'add_to_cart' | 'browse_category';
  product_id?: number;
  category_id?: number;
  label: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  image?: string;
  category?: string;
  rating?: number;
}

class ChatService {
  private sessionId: string;

  constructor() {
    this.sessionId = Math.random().toString(36).substr(2, 9);
  }

  async sendMessage(message: string): Promise<ChatMessage> {
    try {
      const response = await api.post('/api/assistant/chat/', {
        message,
        session_id: this.sessionId
      });

      // Transform backend products to frontend format
      const products = (response.data.products || []).map((product: any) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image || '/api/placeholder/150/120',
        category: this.getCategoryName(product.category),
        rating: product.rating || 0,
        brand: product.brand || '',
        availability: product.availability || 'In Stock'
      }));
      
      return {
        id: Date.now().toString(),
        text: response.data.response,
        isUser: false,
        timestamp: new Date(),
        products,
        suggestions: response.data.suggestions || [],
        actions: response.data.actions || []
      };
    } catch (error) {
      console.error('Chat service error:', error);
      throw new Error('Unable to process your request. Please try again.');
    }
  }

  private getCategoryName(categoryId: number): string {
    const categories: { [key: number]: string } = {
      1: 'Beauty',
      2: 'Fragrances',
      3: 'Furniture'
    };
    return categories[categoryId] || 'General';
  }

  async getProductBundles(productId: number) {
    try {
      const response = await api.get(`/api/ai/bundles/?product_id=${productId}`);
      return response.data;
    } catch (error) {
      return null;
    }
  }



  getSessionId(): string {
    return this.sessionId;
  }
}

export const chatService = new ChatService();