from .models import Category, Product
from decimal import Decimal


def populate_data():
    """Populate initial categories and products"""
    
    # Create categories
    categories_data = [
        {
            'name': 'Electronics',
            'description': 'Latest electronic devices and gadgets'
        },
        {
            'name': 'Clothing',
            'description': 'Fashion and apparel for all occasions'
        },
        {
            'name': 'Books',
            'description': 'Books, magazines, and educational materials'
        },
        {
            'name': 'Home & Garden',
            'description': 'Home improvement and garden supplies'
        },
        {
            'name': 'Sports',
            'description': 'Sports equipment and fitness gear'
        }
    ]
    
    categories = {}
    for cat_data in categories_data:
        category, created = Category.objects.get_or_create(
            name=cat_data['name'],
            defaults={'description': cat_data['description']}
        )
        categories[cat_data['name']] = category
    
    # Create products
    products_data = [
        {
            'name': 'Smartphone Pro Max',
            'description': 'Latest flagship smartphone with advanced features',
            'price': Decimal('999.99'),
            'category': 'Electronics',
            'stock_quantity': 50
        },
        {
            'name': 'Wireless Headphones',
            'description': 'Premium noise-cancelling wireless headphones',
            'price': Decimal('299.99'),
            'category': 'Electronics',
            'stock_quantity': 100
        },
        {
            'name': 'Designer T-Shirt',
            'description': 'Premium cotton t-shirt with modern design',
            'price': Decimal('49.99'),
            'category': 'Clothing',
            'stock_quantity': 200
        },
        {
            'name': 'Programming Guide',
            'description': 'Complete guide to modern programming languages',
            'price': Decimal('39.99'),
            'category': 'Books',
            'stock_quantity': 75
        },
        {
            'name': 'Coffee Maker',
            'description': 'Automatic coffee maker with programmable features',
            'price': Decimal('129.99'),
            'category': 'Home & Garden',
            'stock_quantity': 30
        },
        {
            'name': 'Yoga Mat',
            'description': 'Non-slip yoga mat for fitness and meditation',
            'price': Decimal('29.99'),
            'category': 'Sports',
            'stock_quantity': 150
        }
    ]
    
    for prod_data in products_data:
        Product.objects.get_or_create(
            name=prod_data['name'],
            defaults={
                'description': prod_data['description'],
                'price': prod_data['price'],
                'category': categories[prod_data['category']],
                'stock_quantity': prod_data['stock_quantity']
            }
        )
    
    print("Sample data populated successfully!")


def initiate():
    """Initialize the database with sample data"""
    populate_data()