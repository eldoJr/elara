from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.db import models
import json
import logging

from .models import Product
from .services.gemini_service import gemini_service

logger = logging.getLogger(__name__)


@csrf_exempt
def generate_product_bundles(request):
    """Generate AI-powered product bundles"""
    if request.method != 'GET':
        return JsonResponse({"error": "GET method required"}, status=405)
    
    product_id = request.GET.get('product_id')
    if not product_id:
        return JsonResponse({"error": "Product ID required"}, status=400)
    
    try:
        result = gemini_service.generate_bundle_suggestions(int(product_id))
        return JsonResponse(result)
    except Exception as e:
        logger.error(f"Bundle generation error: {e}")
        return JsonResponse({"error": "Failed to generate bundles"}, status=500)


@csrf_exempt
def enhance_search_results(request):
    """Enhance search results with AI insights"""
    if request.method != 'GET':
        return JsonResponse({"error": "GET method required"}, status=405)
    
    query = request.GET.get('q', '')
    if not query:
        return JsonResponse({"error": "Search query required"}, status=400)
    
    try:
        products = Product.objects.filter(
            models.Q(name__icontains=query) | 
            models.Q(description__icontains=query),
            is_active=True
        )[:10]
        
        search_results = [{
            'id': p.id,
            'name': p.name,
            'price': float(p.price),
            'category': p.category.name if p.category else 'General'
        } for p in products]
        
        enhancement = gemini_service.smart_search_enhancement(query, search_results)
        return JsonResponse({
            "results": search_results,
            "enhancement": enhancement
        })
    except Exception as e:
        logger.error(f"Search enhancement error: {e}")
        return JsonResponse({"error": "Failed to enhance search"}, status=500)


@csrf_exempt
def generate_marketing_content(request):
    """Generate AI marketing content for products"""
    if request.method != 'POST':
        return JsonResponse({"error": "POST method required"}, status=405)
    
    try:
        data = json.loads(request.body)
        product_id = data.get('product_id')
        target_audience = data.get('target_audience', 'general')
        
        if not product_id:
            return JsonResponse({"error": "Product ID required"}, status=400)
        
        product = Product.objects.get(id=product_id)
        product_data = {
            'name': product.name,
            'price': float(product.price),
            'category': product.category.name if product.category else 'General',
            'description': product.description
        }
        
        content = gemini_service.generate_marketing_content(product_data, target_audience)
        return JsonResponse(content)
        
    except Product.DoesNotExist:
        return JsonResponse({"error": "Product not found"}, status=404)
    except Exception as e:
        logger.error(f"Marketing content error: {e}")
        return JsonResponse({"error": "Failed to generate content"}, status=500)


@csrf_exempt
def analyze_product_sentiment(request):
    """Analyze customer sentiment for products"""
    if request.method != 'POST':
        return JsonResponse({"error": "POST method required"}, status=405)
    
    try:
        data = json.loads(request.body)
        reviews = data.get('reviews', [])
        
        if not reviews:
            return JsonResponse({"error": "Reviews required"}, status=400)
        
        analysis = gemini_service.analyze_customer_sentiment(reviews)
        return JsonResponse(analysis)
        
    except Exception as e:
        logger.error(f"Sentiment analysis error: {e}")
        return JsonResponse({"error": "Failed to analyze sentiment"}, status=500)


@csrf_exempt
def generate_product_description(request):
    """Generate enhanced product descriptions"""
    if request.method != 'POST':
        return JsonResponse({"error": "POST method required"}, status=405)
    
    try:
        data = json.loads(request.body)
        product_name = data.get('product_name', '')
        category = data.get('category', '')
        features = data.get('features', [])
        
        if not product_name:
            return JsonResponse({"error": "Product name required"}, status=400)
        
        description = gemini_service.generate_product_descriptions(
            product_name, category, features
        )
        
        return JsonResponse({
            "description": description,
            "status": "success"
        })
        
    except Exception as e:
        logger.error(f"Description generation error: {e}")
        return JsonResponse({"error": "Failed to generate description"}, status=500)