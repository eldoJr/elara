from django.core.management.base import BaseCommand
import requests
import json
from djangoapp.models import Category, Product

class Command(BaseCommand):
    help = 'Sync data from database API to Django models'

    def handle(self, *args, **options):
        # Get data from database API
        try:
            # Categories
            categories_response = requests.get('http://localhost:3031/api/categories')
            categories_data = categories_response.json()
            
            for cat_data in categories_data:
                Category.objects.get_or_create(
                    id=cat_data['id'],
                    defaults={
                        'name': cat_data['name'],
                        'description': cat_data['description'],
                        'is_active': cat_data['is_active']
                    }
                )
            
            # Products
            products_response = requests.get('http://localhost:3031/api/products?limit=100')
            products_data = products_response.json()
            
            for prod_data in products_data:
                category = Category.objects.filter(id=prod_data['category_id']).first()
                if category:
                    Product.objects.get_or_create(
                        id=prod_data['id'],
                        defaults={
                            'name': prod_data['name'],
                            'description': prod_data['description'],
                            'price': prod_data['price'],
                            'category': category,
                            'brand': prod_data['brand'],
                            'sku': prod_data['sku'],
                            'stock_quantity': prod_data['stock_quantity'],
                            'rating': prod_data['rating'],
                            'discount_percentage': prod_data['discount_percentage'],
                            'image_url': prod_data['image_url'],
                            'images': prod_data['images'],
                            'is_active': prod_data['is_active'],
                            'availability_status': prod_data['availability_status']
                        }
                    )
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully synced {len(categories_data)} categories and {len(products_data)} products'
                )
            )
            
        except requests.exceptions.ConnectionError:
            self.stdout.write(
                self.style.ERROR('Database API not running. Start it with: cd database && node app.js')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error syncing data: {e}')
            )