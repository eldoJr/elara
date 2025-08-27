import api from '../config/api';

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  products?: Product[];
  suggestions?: string[];
  status?: 'sending' | 'sent' | 'delivered' | 'failed';
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

      const products = await this.extractProducts(message);
      
      return {
        id: Date.now().toString(),
        text: response.data.response,
        isUser: false,
        timestamp: new Date(),
        products,
        suggestions: response.data.suggestions || []
      };
    } catch (error) {
      throw new Error('Failed to send message');
    }
  }

  async getProductBundles(productId: number) {
    try {
      const response = await api.get(`/api/ai/bundles/?product_id=${productId}`);
      return response.data;
    } catch (error) {
      return null;
    }
  }

  private async extractProducts(userMessage: string): Promise<Product[]> {
    const keywords = ['laptop', 'phone', 'electronics', 'clothing', 'beauty', 'mascara'];
    const hasProductQuery = keywords.some(keyword => 
      userMessage.toLowerCase().includes(keyword)
    );

    if (!hasProductQuery) return [];

    try {
      const response = await api.get('/api/products/', { params: { limit: 3 } });
      return response.data.products.map((product: any) => ({
        id: product.id,
        name: product.name || product.title,
        price: product.price,
        image: product.thumbnail,
        category: product.category,
        rating: product.rating
      }));
    } catch (error) {
      return [];
    }
  }

  getSessionId(): string {
    return this.sessionId;
  }
}

export const chatService = new ChatService();