#!/usr/bin/env python3
"""
Test script to verify all API endpoints are working correctly
"""
import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_endpoint(endpoint, method="GET", data=None):
    """Test an API endpoint"""
    url = f"{BASE_URL}{endpoint}"
    try:
        if method == "GET":
            response = requests.get(url)
        elif method == "POST":
            response = requests.post(url, json=data)
        
        print(f"\n{method} {endpoint}")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            if endpoint == "/products/" or "/products/?" in endpoint:
                print(f"Products count: {len(result.get('products', []))}")
                if result.get('products'):
                    product = result['products'][0]
                    print(f"Sample product: {product['title']} - ${product['price']}")
                    print(f"Brand: {product['brand']}, Rating: {product['rating']}")
            elif endpoint.startswith("/products/"):
                print(f"Product: {result['title']} - ${result['price']}")
                print(f"Brand: {result['brand']}, Stock: {result['stock']}")
            elif endpoint == "/categories/":
                print(f"Categories count: {len(result.get('categories', []))}")
                if result.get('categories'):
                    print(f"Sample category: {result['categories'][0]['name']}")
            else:
                print(f"Response: {json.dumps(result, indent=2)[:200]}...")
        else:
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"Error testing {endpoint}: {e}")

def main():
    print("Testing Elara E-Commerce API Endpoints")
    print("=" * 50)
    
    # Test product endpoints
    test_endpoint("/products/")
    test_endpoint("/products/294/")  # Test specific product
    
    # Test categories
    test_endpoint("/categories/")
    
    # Test search functionality
    test_endpoint("/products/?search=iPhone")
    test_endpoint("/products/?category=28")  # Beauty category
    
    # Test product with discount
    test_endpoint("/products/295/")  # Test another product
    
    print("\n" + "=" * 50)
    print("API endpoint testing completed!")

if __name__ == "__main__":
    main()