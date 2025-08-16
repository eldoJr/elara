from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from djangoapp.models import Category, Product, UserProfile, Cart
from decimal import Decimal
import json
import os
from django.conf import settings


class Command(BaseCommand):
    help = 'Populate database with initial data'

    def handle(self, *args, **options):
        self.stdout.write('Populating database...')
        
        # Load products from local data.json
        try:
            data_file = os.path.join(settings.BASE_DIR, 'data.json')
            self.stdout.write(f'Loading data from: {data_file}')
            with open(data_file, 'r') as f:
                data = json.load(f)
            
            self.stdout.write(f'Found {len(data["products"])} products in data.json')
            for product_data in data['products']:
                # Get or create category
                category, created = Category.objects.get_or_create(
                    name=product_data['category'].title(),
                    defaults={'description': f'{product_data["category"].title()} products'}
                )
                if created:
                    self.stdout.write(f'Created category: {category.name}')
                
                # Create product
                product, created = Product.objects.get_or_create(
                    name=product_data['title'],
                    defaults={
                        'description': product_data['description'],
                        'price': Decimal(str(product_data['price'])),
                        'category': category,
                        'stock_quantity': product_data['stock'],
                        'image_url': product_data.get('thumbnail'),
                        'images': product_data.get('images', []),
                        'brand': product_data.get('brand', ''),
                        'sku': product_data.get('sku', ''),
                        'rating': Decimal(str(product_data.get('rating', 0))),
                        'discount_percentage': Decimal(str(product_data.get('discountPercentage', 0))),
                        'availability_status': product_data.get('availabilityStatus', 'In Stock')
                    }
                )
                if created:
                    self.stdout.write(f'Created product: {product.name}')
        except Exception as e:
            self.stdout.write(f'Error loading products: {e}')

        # Create admin user if doesn't exist
        if not User.objects.filter(username='admin').exists():
            admin_user = User.objects.create_superuser(
                username='admin',
                email='admin@elara.com',
                password='admin123'
            )
            UserProfile.objects.create(user=admin_user)
            Cart.objects.create(user=admin_user)
            self.stdout.write('Created admin user')

        # Create demo user if doesn't exist
        if not User.objects.filter(username='demo').exists():
            demo_user = User.objects.create_user(
                username='demo',
                email='demo@elara.com',
                password='demo123'
            )
            UserProfile.objects.create(user=demo_user)
            Cart.objects.create(user=demo_user)
            self.stdout.write('Created demo user')

        self.stdout.write(self.style.SUCCESS('Database populated successfully!'))