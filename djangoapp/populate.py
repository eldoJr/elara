from .models import Category, Product
from decimal import Decimal
import random


def populate_data():
    """Populate comprehensive categories and products"""
    
    # Create categories
    categories_data = [
        {'name': 'Beauty', 'description': 'Cosmetics, skincare, and beauty products'},
        {'name': 'Fragrances', 'description': 'Perfumes and fragrances for all occasions'},
        {'name': 'Furniture', 'description': 'Home and office furniture'},
        {'name': 'Groceries', 'description': 'Fresh food and daily essentials'},
        {'name': 'Home Decoration', 'description': 'Decorative items for your home'},
        {'name': 'Kitchen Accessories', 'description': 'Kitchen tools and accessories'},
        {'name': 'Laptops', 'description': 'Computers and laptops'},
        {'name': 'Mens Shirts', 'description': 'Shirts for men'},
        {'name': 'Mens Shoes', 'description': 'Footwear for men'},
        {'name': 'Mens Watches', 'description': 'Watches and timepieces for men'},
        {'name': 'Mobile Accessories', 'description': 'Phone cases, chargers, and accessories'},
        {'name': 'Motorcycle', 'description': 'Motorcycles and related accessories'},
        {'name': 'Skin Care', 'description': 'Skincare products and treatments'},
        {'name': 'Smartphones', 'description': 'Mobile phones and smartphones'},
        {'name': 'Sports Accessories', 'description': 'Sports equipment and accessories'},
        {'name': 'Sunglasses', 'description': 'Sunglasses and eyewear'},
        {'name': 'Tablets', 'description': 'Tablets and e-readers'},
        {'name': 'Tops', 'description': 'Tops and blouses'},
        {'name': 'Vehicle', 'description': 'Cars and vehicles'},
        {'name': 'Womens Bags', 'description': 'Handbags and purses for women'},
        {'name': 'Womens Dresses', 'description': 'Dresses for women'},
        {'name': 'Womens Jewellery', 'description': 'Jewelry and accessories for women'},
        {'name': 'Womens Shoes', 'description': 'Footwear for women'},
        {'name': 'Womens Watches', 'description': 'Watches for women'}
    ]
    
    categories = {}
    for cat_data in categories_data:
        category, created = Category.objects.get_or_create(
            name=cat_data['name'],
            defaults={'description': cat_data['description']}
        )
        categories[cat_data['name']] = category
        if created:
            print(f"Created category: {cat_data['name']}")
    
    # Create comprehensive products
    products_data = [
        # Beauty Products
        {'name': 'Essence Mascara Lash Princess', 'description': 'Popular mascara known for volumizing and lengthening effects', 'price': Decimal('9.99'), 'category': 'Beauty', 'brand': 'Essence', 'rating': 4.94},
        {'name': 'Eyeshadow Palette with Mirror', 'description': 'Versatile eyeshadow palette with built-in mirror', 'price': Decimal('19.99'), 'category': 'Beauty', 'brand': 'Glamour Beauty', 'rating': 3.28},
        {'name': 'Powder Canister', 'description': 'Finely milled setting powder for makeup', 'price': Decimal('14.99'), 'category': 'Beauty', 'brand': 'Velvet Touch', 'rating': 3.82},
        {'name': 'Red Lipstick', 'description': 'Classic bold red lipstick with creamy formula', 'price': Decimal('12.99'), 'category': 'Beauty', 'brand': 'Chic Cosmetics', 'rating': 2.46},
        {'name': 'Red Nail Polish', 'description': 'Rich glossy red nail polish with quick-drying formula', 'price': Decimal('8.99'), 'category': 'Beauty', 'brand': 'Nail Couture', 'rating': 3.91},
        
        # Fragrances
        {'name': 'Calvin Klein CK One', 'description': 'Classic unisex fragrance with fresh and clean scent', 'price': Decimal('49.99'), 'category': 'Fragrances', 'brand': 'Calvin Klein', 'rating': 4.85},
        {'name': 'Chanel Coco Noir Eau De', 'description': 'Elegant fragrance with notes of grapefruit, rose, and sandalwood', 'price': Decimal('129.99'), 'category': 'Fragrances', 'brand': 'Chanel', 'rating': 4.13},
        {'name': 'Dior J\'adore', 'description': 'Luxurious floral fragrance with ylang-ylang, rose, and jasmine', 'price': Decimal('89.99'), 'category': 'Fragrances', 'brand': 'Dior', 'rating': 3.31},
        
        # Furniture
        {'name': 'Annibale Colombo Bed', 'description': 'Luxurious bed frame crafted with high-quality materials', 'price': Decimal('1899.99'), 'category': 'Furniture', 'brand': 'Annibale Colombo', 'rating': 4.14},
        {'name': 'Annibale Colombo Sofa', 'description': 'Sophisticated sofa with exquisite design and premium upholstery', 'price': Decimal('2499.99'), 'category': 'Furniture', 'brand': 'Annibale Colombo', 'rating': 3.08},
        {'name': 'Bedside Table African Cherry', 'description': 'Stylish bedside table providing convenient storage', 'price': Decimal('299.99'), 'category': 'Furniture', 'brand': 'Furniture Co.', 'rating': 4.48},
        
        # Groceries
        {'name': 'Apple', 'description': 'Fresh and crisp apples perfect for snacking', 'price': Decimal('1.99'), 'category': 'Groceries', 'brand': 'Generic', 'rating': 2.96},
        {'name': 'Beef Steak', 'description': 'High-quality beef steak great for grilling', 'price': Decimal('12.99'), 'category': 'Groceries', 'brand': 'Generic', 'rating': 2.83},
        {'name': 'Cat Food', 'description': 'Nutritious cat food for your feline friend', 'price': Decimal('8.99'), 'category': 'Groceries', 'brand': 'Generic', 'rating': 2.88},
        
        # Smartphones
        {'name': 'iPhone 9', 'description': 'An apple mobile with 64GB storage', 'price': Decimal('549.00'), 'category': 'Smartphones', 'brand': 'Apple', 'rating': 4.69},
        {'name': 'iPhone X', 'description': 'SIM-Free, Model A19211 6.5-inch screen', 'price': Decimal('899.00'), 'category': 'Smartphones', 'brand': 'Apple', 'rating': 4.44},
        {'name': 'Samsung Universe 9', 'description': 'Samsung\'s new variant with 128GB storage', 'price': Decimal('1249.00'), 'category': 'Smartphones', 'brand': 'Samsung', 'rating': 4.09},
        
        # Laptops
        {'name': 'MacBook Pro', 'description': 'MacBook Pro 2021 with mini-LED display', 'price': Decimal('1749.00'), 'category': 'Laptops', 'brand': 'Apple', 'rating': 4.57},
        {'name': 'Samsung Galaxy Book', 'description': 'Samsung Galaxy Book S (2020) Laptop', 'price': Decimal('1499.00'), 'category': 'Laptops', 'brand': 'Samsung', 'rating': 4.25},
        {'name': 'Microsoft Surface Laptop 4', 'description': 'Style and speed. Stand out on HD video calls', 'price': Decimal('1499.00'), 'category': 'Laptops', 'brand': 'Microsoft Surface', 'rating': 4.43},
        
        # Fashion Items
        {'name': 'Blue & Black Check Shirt', 'description': 'Casual shirt with blue and black check pattern', 'price': Decimal('29.95'), 'category': 'Mens Shirts', 'brand': 'Fashion Brand', 'rating': 4.19},
        {'name': 'Man Short Sleeve Shirt', 'description': 'Comfortable short sleeve shirt for men', 'price': Decimal('12.56'), 'category': 'Mens Shirts', 'brand': 'Fashion Brand', 'rating': 4.62},
        {'name': 'Red Dress', 'description': 'Elegant red dress perfect for special occasions', 'price': Decimal('34.95'), 'category': 'Womens Dresses', 'brand': 'Fashion Brand', 'rating': 4.06},
        
        # Accessories
        {'name': 'Sunglasses', 'description': 'Stylish sunglasses with UV protection', 'price': Decimal('120.00'), 'category': 'Sunglasses', 'brand': 'Sunglasses Brand', 'rating': 4.55},
        {'name': 'Women Handbag Black', 'description': 'Elegant black handbag for women', 'price': Decimal('57.00'), 'category': 'Womens Bags', 'brand': 'Bag Brand', 'rating': 4.71},
    ]
    
    for prod_data in products_data:
        product, created = Product.objects.get_or_create(
            name=prod_data['name'],
            defaults={
                'description': prod_data['description'],
                'price': prod_data['price'],
                'category': categories[prod_data['category']],
                'brand': prod_data.get('brand', ''),
                'rating': Decimal(str(prod_data.get('rating', 4.0))),
                'stock_quantity': random.randint(10, 100),
                'discount_percentage': Decimal(str(random.uniform(0, 20))),
                'image_url': f'https://cdn.dummyjson.com/product-images/{prod_data["name"].lower().replace(" ", "-")}/thumbnail.webp',
                'sku': f'SKU-{random.randint(1000, 9999)}',
                'availability_status': 'In Stock'
            }
        )
        if created:
            print(f"Created product: {prod_data['name']}")
    
    print(f"Database populated with {Category.objects.count()} categories and {Product.objects.count()} products!")


def initiate():
    """Initialize the database with comprehensive sample data"""
    populate_data()