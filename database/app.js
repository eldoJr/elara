const express = require('express');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3031;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Load data from JSON files
let products = [];
let categories = [];
let carts = new Map();
let orders = [];
let reviews = [];

try {
  products = JSON.parse(fs.readFileSync('./data/products.json', 'utf8'));
  categories = JSON.parse(fs.readFileSync('./data/categories.json', 'utf8'));
  console.log(`Loaded ${products.length} products and ${categories.length} categories`);
} catch (error) {
  console.log('No data files found. Run npm run load-data first.');
}

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Elara Database API' });
});

// Product routes
app.get('/api/products', (req, res) => {
  try {
    const { category, brand, search, limit = 20, offset = 0 } = req.query;
    let filteredProducts = products.filter(p => p.is_active);
    
    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category_id === parseInt(category));
    }
    if (brand) {
      filteredProducts = filteredProducts.filter(p => 
        p.brand.toLowerCase().includes(brand.toLowerCase())
      );
    }
    if (search) {
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    const startIndex = parseInt(offset);
    const endIndex = startIndex + parseInt(limit);
    const result = filteredProducts.slice(startIndex, endIndex);
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching products' });
  }
});

app.get('/api/products/:id', (req, res) => {
  try {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching product' });
  }
});

// Category routes
app.get('/api/categories', (req, res) => {
  try {
    const activeCategories = categories.filter(c => c.is_active);
    res.json(activeCategories);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching categories' });
  }
});

// Cart routes
app.get('/api/cart/:userId', (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const cart = carts.get(userId) || { user_id: userId, items: [] };
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching cart' });
  }
});

app.post('/api/cart/add', (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body;
    
    let cart = carts.get(user_id) || { user_id, items: [] };
    
    const existingItem = cart.items.find(item => item.product_id === product_id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product_id, quantity, added_at: new Date() });
    }
    
    carts.set(user_id, cart);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error adding to cart' });
  }
});

// Order routes
app.get('/api/orders/:userId', (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const userOrders = orders.filter(o => o.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.json(userOrders);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching orders' });
  }
});

app.post('/api/orders', (req, res) => {
  try {
    const orderData = req.body;
    const newId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1;
    
    const order = {
      ...orderData,
      id: newId,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    orders.push(order);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Error creating order' });
  }
});

// Review routes
app.get('/api/reviews/product/:productId', (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    const productReviews = reviews.filter(r => r.product_id === productId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.json(productReviews);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching reviews' });
  }
});

app.post('/api/reviews', (req, res) => {
  try {
    const reviewData = req.body;
    const newId = reviews.length > 0 ? Math.max(...reviews.map(r => r.id)) + 1 : 1;
    
    const review = {
      ...reviewData,
      id: newId,
      created_at: new Date()
    };
    
    reviews.push(review);
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: 'Error creating review' });
  }
});

app.listen(port, () => {
  console.log(`Elara Database API running on port ${port}`);
});