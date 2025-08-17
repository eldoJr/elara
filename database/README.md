# Elara Database Service

MongoDB-based database service for the Elara e-commerce platform, inspired by microservices architecture.

## Features

- **MongoDB** for scalable document storage
- **Express.js** API server with RESTful endpoints
- **Mongoose** ODM with schema validation
- **Docker** containerization support
- **Indexing** for optimized queries
- **Sample data** initialization

## Models

### Product
- Comprehensive product information
- Category relationships
- Stock management
- Rating and discount support
- Image gallery support

### Category
- Product categorization
- Hierarchical structure ready

### Order
- Complete order management
- Embedded order items
- Status tracking
- Shipping address support

### Cart
- User-specific shopping carts
- Embedded cart items
- Real-time updates

### Review
- Product reviews and ratings
- Verified purchase tracking
- Helpful votes system

## Quick Start

### Development
```bash
cd database
npm install
npm run load-data  # Load data from DummyJSON
npm run dev
```

### Docker
```bash
cd database
docker-compose up --build
# In another terminal:
npm run load-data
```

## API Endpoints

### Products
- `GET /api/products` - List products with filtering
- `GET /api/products/:id` - Get product details

### Categories
- `GET /api/categories` - List categories

### Cart
- `GET /api/cart/:userId` - Get user cart
- `POST /api/cart/add` - Add item to cart

### Orders
- `GET /api/orders/:userId` - Get user orders
- `POST /api/orders` - Create new order

### Reviews
- `GET /api/reviews/product/:productId` - Get product reviews
- `POST /api/reviews` - Create review

## Environment Variables

```
MONGODB_URL=mongodb://localhost:27017/elara_db
PORT=3030
NODE_ENV=development
```

## Integration with Django

The Django backend can integrate with this MongoDB service for:
- High-performance product searches
- Real-time inventory management
- Analytics and reporting
- Caching frequently accessed data