# Elara E-Commerce Platform

AI-powered e-commerce solution with Django backend and React TypeScript frontend.

## Features

-  Product catalog with categories
-  Shopping cart functionality
-  User authentication and profiles
-  AI shopping assistant
-  Responsive design with Tailwind CSS
-  Secure API endpoints

## Tech Stack

**Backend:**
- Django 4.2.7
- Django REST Framework
- SQLite (development) / PostgreSQL (production)
- Python 3.11+

**Frontend:**
- React 18 with TypeScript
- Tailwind CSS 3.4.17
- Axios for API calls
- Material-UI components

## Quick Start

### Development Setup

1. **Backend Setup:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py populate_db
python manage.py runserver
```

2. **Frontend Setup:**
```bash
cd web
npm install
npm start
```

3. **Admin Access:**
- Username: `admin`
- Password: `admin123`
- URL: `http://localhost:8000/admin/`

### Quick Setup (All-in-one)
```bash
# Backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py populate_db

# Frontend
cd web && npm install && cd ..

# Start backend
python manage.py runserver
```

### Docker Setup

```bash
docker-compose up --build
```

## API Endpoints

- `GET /api/products/` - List products
- `GET /api/categories/` - List categories
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `GET /api/cart/` - View cart
- `POST /api/cart/add/` - Add to cart
- `POST /api/assistant/chat/` - AI chat

## Project Structure

```
elara/
├── djangoapp/          # Django application
│   ├── migrations/     # Database migrations
│   ├── templates/      # HTML templates
│   ├── models.py       # Data models (Product, Cart, Order, etc.)
│   ├── views.py        # API endpoints
│   ├── urls.py         # URL routing
│   ├── admin.py        # Admin interface
│   └── populate.py     # Initial data setup
├── djangoproj/         # Django project settings
│   ├── settings.py     # Configuration
│   ├── urls.py         # Main URL routing
│   ├── wsgi.py         # WSGI config
│   └── asgi.py         # ASGI config
├── web/                # React TypeScript frontend
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── App.tsx     # Main app component
│   │   └── index.tsx   # Entry point
│   ├── public/         # Static assets
│   └── package.json    # Frontend dependencies
├── static/             # Collected static files
├── venv/               # Python virtual environment
├── requirements.txt    # Python dependencies
├── manage.py           # Django management
├── Dockerfile          # Container configuration
├── deployment.yaml     # Kubernetes deployment
└── entrypoint.sh       # Container startup script
```

## Deployment

### Kubernetes
```bash
kubectl apply -f deployment.yaml
```

### Railway/Heroku
- Connect your GitHub repository
- Set environment variables
- Deploy automatically

## Environment Variables

```
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=yourdomain.com
DATABASE_URL=postgres://user:pass@host:port/db
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License