import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'djangoproj.elara_project.settings')
django.setup()

from djangoapp.products.models import Category, Product

# Create categories
electronics = Category.objects.create(
    name="Electronics",
    slug="electronics",
    description="Electronic devices and gadgets"
)

clothing = Category.objects.create(
    name="Clothing",
    slug="clothing", 
    description="Fashion and apparel"
)

# Create products
Product.objects.create(
    name="Smartphone",
    slug="smartphone",
    description="Latest smartphone with advanced features",
    price=699.99,
    category=electronics,
    stock=50
)

Product.objects.create(
    name="T-Shirt",
    slug="t-shirt",
    description="Comfortable cotton t-shirt",
    price=29.99,
    category=clothing,
    stock=100
)

print("Sample data created successfully!")