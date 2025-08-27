#!/usr/bin/env python3
"""
Test script for Gemini AI integration in Elara e-commerce platform
"""

import os
import sys
import django

# Add the project directory to Python path
sys.path.append('/home/elldojr/Documents/GitHub/elara')

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'djangoproj.settings')
django.setup()

from djangoapp.services.ai_service import ai_service
from djangoapp.services.gemini_service import gemini_service

def test_basic_chat():
    """Test basic AI chat functionality"""
    print("Testing basic AI chat...")
    
    test_queries = [
        "Hello, I'm looking for electronics",
        "Show me laptops under $1000",
        "What clothing do you have?",
        "I need recommendations for home goods"
    ]
    
    sample_products = [
        {"id": 1, "name": "iPhone 15", "price": 999, "category": "Electronics"},
        {"id": 2, "name": "MacBook Pro", "price": 1299, "category": "Electronics"},
        {"id": 3, "name": "Nike Shoes", "price": 120, "category": "Clothing"},
        {"id": 4, "name": "Coffee Maker", "price": 89, "category": "Home"}
    ]
    
    user_context = {"username": "TestUser"}
    
    for query in test_queries:
        print(f"\nQuery: {query}")
        try:
            response = ai_service.process_shopping_query(query, sample_products, user_context)
            print(f"Response: {response}")
        except Exception as e:
            print(f"Error: {e}")

def test_gemini_features():
    """Test advanced Gemini features"""
    print("\n" + "="*50)
    print("Testing Gemini Enhanced Features")
    print("="*50)
    
    # Test product description generation
    print("\n1. Testing product description generation...")
    try:
        description = gemini_service.generate_product_descriptions(
            "Wireless Bluetooth Headphones",
            "Electronics",
            ["Noise Cancellation", "30-hour battery", "Premium sound quality"]
        )
        print(f"Generated description: {description}")
    except Exception as e:
        print(f"Error: {e}")
    
    # Test marketing content generation
    print("\n2. Testing marketing content generation...")
    try:
        product_data = {
            "name": "Smart Watch",
            "price": 299,
            "category": "Electronics",
            "description": "Advanced fitness tracking smartwatch"
        }
        content = gemini_service.generate_marketing_content(product_data, "fitness enthusiasts")
        print(f"Marketing content: {content}")
    except Exception as e:
        print(f"Error: {e}")
    
    # Test personalized shopping assistant
    print("\n3. Testing personalized shopping assistant...")
    try:
        sample_products = [
            {"id": 1, "name": "Running Shoes", "price": 150, "category": "Sports"},
            {"id": 2, "name": "Yoga Mat", "price": 45, "category": "Sports"},
            {"id": 3, "name": "Protein Powder", "price": 35, "category": "Health"}
        ]
        
        user_context = {
            "username": "FitnessUser",
            "recent_actions": [
                {"action": "VIEW", "product": "Running Shoes"},
                {"action": "SEARCH", "query": "fitness equipment"}
            ]
        }
        
        response = gemini_service.personalized_shopping_assistant(
            "I want to start a home workout routine",
            user_context,
            sample_products
        )
        print(f"Assistant response: {response}")
    except Exception as e:
        print(f"Error: {e}")

def test_api_connectivity():
    """Test Gemini API connectivity"""
    print("\n" + "="*50)
    print("Testing Gemini API Connectivity")
    print("="*50)
    
    try:
        import google.generativeai as genai
        genai.configure(api_key="AIzaSyDEVfJYhLbe6NELrNZuJ63Hqj1rY-LBJto")
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        response = model.generate_content("Hello, this is a test message for Elara e-commerce platform.")
        print(f"API Test Response: {response.text}")
        print("✅ Gemini API connectivity successful!")
        
    except Exception as e:
        print(f"❌ API connectivity failed: {e}")

if __name__ == "__main__":
    print("Elara E-commerce - Gemini AI Integration Test")
    print("=" * 50)
    
    # Test API connectivity first
    test_api_connectivity()
    
    # Test basic chat
    test_basic_chat()
    
    # Test advanced Gemini features
    test_gemini_features()
    
    print("\n" + "="*50)
    print("Test completed!")