from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import login, authenticate, logout
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from django.db import models
import json
import logging
from decimal import Decimal

from .models import Category, Product, Cart, CartItem, Order, OrderItem, UserProfile, UserBehavior, ConversationHistory
from .services.database_service import db_service
from .services.search_service import search_service
from .services.recommendation_service import recommendation_service

logger = logging.getLogger(__name__)


@csrf_exempt
def registration(request):
    """Handle user registration"""
    if request.method != 'POST':
        return JsonResponse({"error": "POST method required"}, status=405)
    
    data = json.loads(request.body)
    username = data.get('username')
    password = data.get('password')
    email = data.get('email', '')
    first_name = data.get('firstName', '')
    last_name = data.get('lastName', '')
    
    if User.objects.filter(username=username).exists():
        return JsonResponse({"error": "Username already exists"}, status=400)
    
    user = User.objects.create_user(
        username=username,
        password=password,
        email=email,
        first_name=first_name,
        last_name=last_name
    )
    
    # Create user profile and cart
    UserProfile.objects.create(user=user)
    Cart.objects.create(user=user)
    
    login(request, user)
    return JsonResponse({"username": username, "status": "Registered successfully"})


@csrf_exempt
def login_user(request):
    """Handle user login"""
    if request.method != 'POST':
        return JsonResponse({"error": "POST method required"}, status=405)
    
    data = json.loads(request.body)
    username = data.get('username')
    password = data.get('password')
    
    user = authenticate(username=username, password=password)
    if user is not None:
        login(request, user)
        return JsonResponse({"username": username, "status": "Authenticated"})
    else:
        return JsonResponse({"error": "Invalid credentials"}, status=401)


@csrf_exempt
def logout_request(request):
    """Handle user logout"""
    logout(request)
    return JsonResponse({"status": "Logged out successfully"})


def get_products(request):
    """Get all products from database API with fallback to local DB"""
    category = request.GET.get('category')
    search = request.GET.get('search')
    brand = request.GET.get('brand')
    limit = int(request.GET.get('limit', 1000))
    offset = int(request.GET.get('offset', 0))
    
    # Try external database service first
    try:
        products = db_service.get_products(
            category=int(category) if category else None,
            brand=brand,
            search=search,
            limit=limit,
            offset=offset
        )
        
        if products:
            # Transform external API data for frontend compatibility
            products_data = []
            for product in products:
                # Get category name
                category_name = 'Uncategorized'
                try:
                    category = Category.objects.get(id=product.get('category_id'))
                    category_name = category.name
                except Category.DoesNotExist:
                    pass
                
                products_data.append({
                    'id': product['id'],
                    'title': product['name'],
                    'name': product['name'],
                    'description': product['description'],
                    'price': product['price'],
                    'discountPercentage': product.get('discount_percentage', 0),
                    'rating': product.get('rating', 0),
                    'stock': product.get('stock_quantity', 0),
                    'brand': product.get('brand', ''),
                    'category': category_name,
                    'thumbnail': product.get('image_url', ''),
                    'images': product.get('images', []),
                    'availabilityStatus': product.get('availability_status', 'In Stock'),
                    'sku': product.get('sku', ''),
                })
            
            return JsonResponse({
                "products": products_data,
                "total": len(products_data),
                "skip": offset,
                "limit": limit
            })
    except Exception as e:
        logger.warning(f"External database service failed: {e}. Using local database.")
    
    # Fallback to local database
    queryset = Product.objects.filter(is_active=True)
    
    if category:
        queryset = queryset.filter(category_id=category)
    if brand:
        queryset = queryset.filter(brand__icontains=brand)
    if search:
        queryset = queryset.filter(
            models.Q(name__icontains=search) | 
            models.Q(description__icontains=search)
        )
    
    total_count = queryset.count()
    products = queryset[offset:offset + limit]
    
    products_data = []
    for product in products:
        products_data.append({
            'id': product.id,
            'title': product.name,
            'name': product.name,
            'description': product.description,
            'price': float(product.price),
            'discountPercentage': float(product.discount_percentage or 0),
            'rating': float(product.rating or 0),
            'stock': product.stock_quantity,
            'brand': product.brand or '',
            'category': product.category.name if product.category else 'Uncategorized',
            'thumbnail': product.image_url or '',
            'images': [product.image_url] if product.image_url else [],
            'availabilityStatus': product.availability_status,
            'sku': product.sku or f'SKU-{product.id}',
        })
    
    return JsonResponse({
        "products": products_data,
        "total": total_count,
        "skip": offset,
        "limit": limit
    })


def get_product_detail(request, product_id):
    """Get detailed information about a specific product with fallback to local DB"""
    # Try external database service first
    try:
        product = db_service.get_product(int(product_id))
        
        if product:
            # Track product view behavior
            if request.user.is_authenticated:
                try:
                    product_obj = Product.objects.get(id=product_id)
                    UserBehavior.objects.create(
                        user=request.user,
                        action='VIEW',
                        product=product_obj,
                        metadata={'source': 'external_api'}
                    )
                except Product.DoesNotExist:
                    pass
            
            product_data = {
                'id': product['id'],
                'title': product['name'],
                'name': product['name'],
                'description': product['description'],
                'price': product['price'],
                'discountPercentage': product.get('discount_percentage', 0),
                'rating': product.get('rating', 0),
                'stock': product.get('stock_quantity', 0),
                'brand': product.get('brand', ''),
                'thumbnail': product.get('image_url', ''),
                'images': product.get('images', []),
                'availabilityStatus': product.get('availability_status', 'In Stock'),
                'sku': product.get('sku', ''),
            }
            return JsonResponse(product_data)
    except Exception as e:
        logger.warning(f"External database service failed: {e}. Using local database.")
    
    # Fallback to local database
    try:
        product = Product.objects.get(id=product_id, is_active=True)
        
        # Track product view behavior
        if request.user.is_authenticated:
            UserBehavior.objects.create(
                user=request.user,
                action='VIEW',
                product=product,
                metadata={'source': 'local_db'}
            )
        
        product_data = {
            'id': product.id,
            'title': product.name,
            'name': product.name,
            'description': product.description,
            'price': float(product.price),
            'discountPercentage': float(product.discount_percentage or 0),
            'rating': float(product.rating or 0),
            'stock': product.stock_quantity,
            'brand': product.brand or '',
            'thumbnail': product.image_url or '',
            'images': [product.image_url] if product.image_url else [],
            'availabilityStatus': product.availability_status,
            'sku': product.sku or f'SKU-{product.id}',
        }
        return JsonResponse(product_data)
    except Product.DoesNotExist:
        return JsonResponse({"error": "Product not found"}, status=404)


def get_categories(request):
    """Get all categories from database API with fallback to local DB"""
    # Try external database service first
    try:
        categories = db_service.get_categories()
        
        if categories:
            categories_data = []
            for category in categories:
                categories_data.append({
                    'id': category['id'],
                    'name': category['name'],
                    'description': category.get('description', ''),
                    'image': category.get('image_url', ''),
                })
            
            return JsonResponse({"categories": categories_data})
    except Exception as e:
        logger.warning(f"External database service failed: {e}. Using local database.")
    
    # Fallback to local database
    categories = Category.objects.filter(is_active=True)
    categories_data = []
    
    for category in categories:
        categories_data.append({
            'id': category.id,
            'name': category.name,
            'description': category.description or '',
            'image': category.image.url if category.image else '',
        })
    
    return JsonResponse({"categories": categories_data})


@login_required
def get_cart(request):
    """Get user's cart items"""
    try:
        cart = Cart.objects.get(user=request.user)
        cart_items = CartItem.objects.filter(cart=cart)
        
        items_data = []
        total = Decimal('0.00')
        
        for item in cart_items:
            item_total = item.product.price * item.quantity
            total += item_total
            
            items_data.append({
                'id': item.id,
                'product_id': item.product.id,
                'product_name': item.product.name,
                'price': str(item.product.price),
                'quantity': item.quantity,
                'total': str(item_total),
                'image': item.product.image_url if hasattr(item.product, 'image_url') and item.product.image_url else (item.product.image.url if hasattr(item.product, 'image') and item.product.image else None),
            })
        
        return JsonResponse({
            "cart_items": items_data,
            "total": str(total)
        })
    except Cart.DoesNotExist:
        return JsonResponse({"cart_items": [], "total": "0.00"})


@csrf_exempt
@login_required
def add_to_cart(request):
    """Add product to cart"""
    if request.method != 'POST':
        return JsonResponse({"error": "POST method required"}, status=405)
    
    data = json.loads(request.body)
    product_id = data.get('product_id')
    quantity = data.get('quantity', 1)
    
    try:
        product = Product.objects.get(id=product_id, is_active=True)
        cart, created = Cart.objects.get_or_create(user=request.user)
        
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={'quantity': quantity}
        )
        
        if not created:
            cart_item.quantity += quantity
            cart_item.save()
        
        return JsonResponse({"status": "Added to cart successfully"})
    except Product.DoesNotExist:
        return JsonResponse({"error": "Product not found"}, status=404)


@csrf_exempt
@login_required
def update_cart_item(request):
    """Update cart item quantity"""
    if request.method != 'POST':
        return JsonResponse({"error": "POST method required"}, status=405)
    
    data = json.loads(request.body)
    item_id = data.get('item_id')
    quantity = data.get('quantity')
    
    try:
        cart_item = CartItem.objects.get(id=item_id, cart__user=request.user)
        cart_item.quantity = quantity
        cart_item.save()
        return JsonResponse({"status": "Cart updated successfully"})
    except CartItem.DoesNotExist:
        return JsonResponse({"error": "Cart item not found"}, status=404)


@csrf_exempt
@login_required
def remove_from_cart(request):
    """Remove item from cart"""
    if request.method != 'POST':
        return JsonResponse({"error": "POST method required"}, status=405)
    
    data = json.loads(request.body)
    item_id = data.get('item_id')
    
    try:
        cart_item = CartItem.objects.get(id=item_id, cart__user=request.user)
        cart_item.delete()
        return JsonResponse({"status": "Item removed from cart"})
    except CartItem.DoesNotExist:
        return JsonResponse({"error": "Cart item not found"}, status=404)


@login_required
def get_orders(request):
    """Get user's orders"""
    orders = Order.objects.filter(user=request.user).order_by('-created_at')
    orders_data = []
    
    for order in orders:
        order_items = OrderItem.objects.filter(order=order)
        items_data = []
        
        for item in order_items:
            items_data.append({
                'product_name': item.product.name,
                'quantity': item.quantity,
                'price': str(item.price),
            })
        
        orders_data.append({
            'id': order.id,
            'status': order.status,
            'total_amount': str(order.total_amount),
            'created_at': order.created_at.isoformat(),
            'items': items_data,
        })
    
    return JsonResponse({"orders": orders_data})


@csrf_exempt
@login_required
def create_order(request):
    """Create order from cart"""
    if request.method != 'POST':
        return JsonResponse({"error": "POST method required"}, status=405)
    
    try:
        cart = Cart.objects.get(user=request.user)
        cart_items = CartItem.objects.filter(cart=cart)
        
        if not cart_items.exists():
            return JsonResponse({"error": "Cart is empty"}, status=400)
        
        # Calculate total
        total_amount = sum(item.product.price * item.quantity for item in cart_items)
        
        # Create order
        order = Order.objects.create(
            user=request.user,
            total_amount=total_amount
        )
        
        # Create order items
        for cart_item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                quantity=cart_item.quantity,
                price=cart_item.product.price
            )
        
        # Clear cart
        cart_items.delete()
        
        return JsonResponse({
            "status": "Order created successfully",
            "order_id": order.id
        })
    except Cart.DoesNotExist:
        return JsonResponse({"error": "Cart not found"}, status=404)


def get_profile(request):
    """Get user profile"""
    logger.info(f"Profile request - User authenticated: {request.user.is_authenticated}")
    logger.info(f"Profile request - User: {request.user}")
    
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Authentication required"}, status=401)
    
    try:
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        profile_data = {
            'username': request.user.username,
            'email': request.user.email,
            'first_name': request.user.first_name,
            'last_name': request.user.last_name,
            'phone': profile.phone or '',
            'address': profile.address or '',
            'date_of_birth': profile.date_of_birth.isoformat() if profile.date_of_birth else None,
        }
        logger.info(f"Profile data: {profile_data}")
        return JsonResponse({"profile": profile_data})
    except Exception as e:
        logger.error(f"Error getting profile: {e}")
        return JsonResponse({"error": "Error retrieving profile"}, status=500)


@csrf_exempt
def update_profile(request):
    """Update user profile"""
    if request.method != 'POST':
        return JsonResponse({"error": "POST method required"}, status=405)
    
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Authentication required"}, status=401)
    
    try:
        data = json.loads(request.body)
        logger.info(f"Update profile data: {data}")
        
        # Update user fields
        user = request.user
        user.first_name = data.get('first_name', user.first_name)
        user.last_name = data.get('last_name', user.last_name)
        user.email = data.get('email', user.email)
        user.save()
        
        # Update profile fields
        profile, created = UserProfile.objects.get_or_create(user=user)
        profile.phone = data.get('phone', profile.phone or '')
        profile.address = data.get('address', profile.address or '')
        if data.get('date_of_birth'):
            profile.date_of_birth = data.get('date_of_birth')
        profile.save()
        
        logger.info("Profile updated successfully")
        return JsonResponse({"status": "Profile updated successfully"})
    except Exception as e:
        logger.error(f"Error updating profile: {e}")
        return JsonResponse({"error": "Error updating profile"}, status=500)


@csrf_exempt
def ai_chat(request):
    """Enhanced AI Assistant chat endpoint with DeepSeek integration"""
    if request.method != 'POST':
        return JsonResponse({"error": "POST method required"}, status=405)
    
    try:
        from .services.ai_service import ai_service
        
        data = json.loads(request.body)
        message = data.get('message', '')
        session_id = data.get('session_id', '')
        
        # Get recent products for context
        products = Product.objects.filter(is_active=True)[:20]
        products_data = [{
            'id': p.id,
            'name': p.name,
            'price': float(p.price),
            'category': p.category.name,
            'brand': p.brand or '',
            'rating': float(p.rating or 0)
        } for p in products]
        
        # Get user context if authenticated
        user_context = {}
        if request.user.is_authenticated:
            # Get recent user behaviors
            recent_behaviors = UserBehavior.objects.filter(
                user=request.user
            ).order_by('-timestamp')[:10]
            
            user_context = {
                'username': request.user.username,
                'recent_actions': [{
                    'action': b.action,
                    'product': b.product.name if b.product else None,
                    'metadata': b.metadata
                } for b in recent_behaviors]
            }
            
            # Track AI chat behavior
            UserBehavior.objects.create(
                user=request.user,
                action='AI_CHAT',
                metadata={'message': message, 'session_id': session_id},
                session_id=session_id
            )
        
        # Generate AI response
        ai_response = ai_service.process_shopping_query(
            query=message,
            products=products_data,
            user_context=user_context
        )
        
        # Save conversation history
        if request.user.is_authenticated:
            ConversationHistory.objects.create(
                user=request.user,
                session_id=session_id,
                message=message,
                response=ai_response,
                context={'products_count': len(products_data)}
            )
        
        return JsonResponse({
            "response": ai_response,
            "suggestions": [
                "Show me trending products",
                "What's on sale today?",
                "Help me find electronics",
                "Recommend products for me"
            ]
        })


@csrf_exempt
def semantic_search(request):
    """Semantic search endpoint"""
    if request.method != 'GET':
        return JsonResponse({"error": "GET method required"}, status=405)
    
    query = request.GET.get('q', '')
    if not query:
        return JsonResponse({"products": []})
    
    # Get all products for semantic search
    products = Product.objects.filter(is_active=True)
    products_data = [{
        'id': p.id,
        'name': p.name,
        'description': p.description,
        'category': p.category.name if p.category else '',
        'price': float(p.price),
        'image': p.image_url if hasattr(p, 'image_url') else '',
        'stock': p.stock_quantity,
        'brand': p.brand or ''
    } for p in products]
    
    results = search_service.semantic_search(query, products_data)
    return JsonResponse({"products": results})


def get_recommendations(request):
    """Get personalized product recommendations"""
    user_id = request.user.id if request.user.is_authenticated else None
    rec_type = request.GET.get('type', 'personalized')
    limit = int(request.GET.get('limit', 10))
    
    if rec_type == 'personalized' and user_id:
        recommendations = recommendation_service.get_personalized_recommendations(user_id, limit)
    elif rec_type == 'trending':
        recommendations = recommendation_service.get_trending_products(limit)
    elif rec_type == 'similar':
        product_id = request.GET.get('product_id')
        if product_id:
            recommendations = recommendation_service.get_similar_products(int(product_id), limit)
        else:
            recommendations = []
    elif rec_type == 'frequently_bought':
        product_id = request.GET.get('product_id')
        if product_id:
            recommendations = recommendation_service.get_frequently_bought_together(int(product_id), limit)
        else:
            recommendations = []
    else:
        recommendations = recommendation_service.get_trending_products(limit)
    
    return JsonResponse({'recommendations': recommendations})


def search_suggestions(request):
    """Get intelligent search suggestions"""
    query = request.GET.get('q', '')
    if query:
        suggestions = search_service.generate_search_suggestions(query)
        return JsonResponse({'suggestions': suggestions})
    return JsonResponse({'suggestions': []})
        
    except Exception as e:
        logger.error(f"AI chat error: {str(e)}")
        return JsonResponse({
            "response": "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
            "suggestions": [
                "Browse our products",
                "Check out popular items",
                "Visit our categories"
            ]
        })