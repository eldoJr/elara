from typing import List, Dict, Any, Optional
from django.db.models import Count, Avg, Sum
from django.utils import timezone
from datetime import timedelta
from ..models import Product, UserBehavior, Order, OrderItem
from .ai_service import ai_service
import logging

logger = logging.getLogger(__name__)

class PredictiveAnalyticsService:
    
    def forecast_demand(self, product_id: int, days_ahead: int = 30) -> Dict:
        """Predict product demand for next N days"""
        try:
            # Get historical data
            end_date = timezone.now()
            start_date = end_date - timedelta(days=90)
            
            # Get order history
            orders = OrderItem.objects.filter(
                product_id=product_id,
                order__created_at__gte=start_date
            ).values('order__created_at__date').annotate(
                daily_quantity=Sum('quantity')
            ).order_by('order__created_at__date')
            
            # Get view history
            views = UserBehavior.objects.filter(
                product_id=product_id,
                action='VIEW',
                timestamp__gte=start_date
            ).values('timestamp__date').annotate(
                daily_views=Count('id')
            ).order_by('timestamp__date')
            
            # Prepare data for AI analysis
            historical_data = {
                'orders': list(orders),
                'views': list(views),
                'period_days': 90,
                'forecast_days': days_ahead
            }
            
            forecast_prompt = f"""
            Analyze this product demand data and predict future demand:
            Historical orders: {len(orders)} data points
            Historical views: {len(views)} data points
            
            Provide demand forecast for next {days_ahead} days including:
            1. Expected daily demand
            2. Peak demand periods
            3. Confidence level
            4. Factors affecting demand
            """
            
            forecast = ai_service.chat_completion([
                {'role': 'system', 'content': 'You are a demand forecasting expert.'},
                {'role': 'user', 'content': forecast_prompt}
            ])
            
            return {
                'product_id': product_id,
                'forecast_period': days_ahead,
                'historical_data': historical_data,
                'ai_forecast': forecast,
                'status': 'success'
            }
            
        except Exception as e:
            logger.error(f"Demand forecast error: {str(e)}")
            return {'status': 'error', 'message': str(e)}
    
    def optimize_inventory(self, category_id: Optional[int] = None) -> Dict:
        """Suggest inventory optimization"""
        try:
            # Get products to analyze
            products_query = Product.objects.filter(is_active=True)
            if category_id:
                products_query = products_query.filter(category_id=category_id)
            
            products = products_query[:20]  # Limit for performance
            
            inventory_data = []
            for product in products:
                # Get recent sales
                recent_sales = OrderItem.objects.filter(
                    product=product,
                    order__created_at__gte=timezone.now() - timedelta(days=30)
                ).aggregate(
                    total_sold=Sum('quantity'),
                    avg_order_size=Avg('quantity')
                )
                
                inventory_data.append({
                    'product_name': product.name,
                    'current_stock': getattr(product, 'stock_quantity', 0),
                    'recent_sales': recent_sales['total_sold'] or 0,
                    'avg_order_size': recent_sales['avg_order_size'] or 0,
                    'price': float(product.price)
                })
            
            optimization_prompt = f"""
            Analyze inventory data for {len(inventory_data)} products:
            {inventory_data[:5]}  # Show sample
            
            Provide inventory optimization recommendations:
            1. Products to restock urgently
            2. Overstocked items
            3. Optimal stock levels
            4. Cost optimization opportunities
            """
            
            recommendations = ai_service.chat_completion([
                {'role': 'system', 'content': 'You are an inventory optimization expert.'},
                {'role': 'user', 'content': optimization_prompt}
            ])
            
            return {
                'analyzed_products': len(inventory_data),
                'category_id': category_id,
                'recommendations': recommendations,
                'status': 'success'
            }
            
        except Exception as e:
            logger.error(f"Inventory optimization error: {str(e)}")
            return {'status': 'error', 'message': str(e)}
    
    def analyze_price_trends(self, product_id: int) -> Dict:
        """Analyze price trends and suggest optimizations"""
        try:
            product = Product.objects.get(id=product_id)
            
            # Get competitor analysis (simulated)
            price_analysis_prompt = f"""
            Product: {product.name}
            Current Price: ${product.price}
            Category: {product.category.name if product.category else 'N/A'}
            
            Analyze price positioning and provide:
            1. Price competitiveness assessment
            2. Optimal price range recommendations
            3. Dynamic pricing strategies
            4. Revenue optimization suggestions
            """
            
            analysis = ai_service.chat_completion([
                {'role': 'system', 'content': 'You are a pricing strategy expert.'},
                {'role': 'user', 'content': price_analysis_prompt}
            ])
            
            return {
                'product_id': product_id,
                'current_price': float(product.price),
                'analysis': analysis,
                'status': 'success'
            }
            
        except Exception as e:
            logger.error(f"Price analysis error: {str(e)}")
            return {'status': 'error', 'message': str(e)}
    
    def predict_customer_lifetime_value(self, user_id: int) -> Dict:
        """Predict customer lifetime value"""
        try:
            # Get user's order history
            orders = Order.objects.filter(user_id=user_id)
            total_spent = orders.aggregate(total=Sum('total_amount'))['total'] or 0
            order_count = orders.count()
            
            # Get behavior data
            behaviors = UserBehavior.objects.filter(user_id=user_id)
            behavior_count = behaviors.count()
            
            clv_prompt = f"""
            Customer Analysis:
            - Total Orders: {order_count}
            - Total Spent: ${total_spent}
            - Behavior Events: {behavior_count}
            - Account Age: Recent customer
            
            Predict Customer Lifetime Value including:
            1. Estimated future spending
            2. Retention probability
            3. Engagement level assessment
            4. Personalization opportunities
            """
            
            clv_prediction = ai_service.chat_completion([
                {'role': 'system', 'content': 'You are a customer analytics expert.'},
                {'role': 'user', 'content': clv_prompt}
            ])
            
            return {
                'user_id': user_id,
                'current_metrics': {
                    'total_spent': float(total_spent),
                    'order_count': order_count,
                    'behavior_events': behavior_count
                },
                'clv_prediction': clv_prediction,
                'status': 'success'
            }
            
        except Exception as e:
            logger.error(f"CLV prediction error: {str(e)}")
            return {'status': 'error', 'message': str(e)}

# Global instance
predictive_service = PredictiveAnalyticsService()