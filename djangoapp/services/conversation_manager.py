from datetime import datetime, timedelta
from typing import Dict, List, Optional
import logging

logger = logging.getLogger(__name__)

class ConversationManager:
    def __init__(self):
        self.sessions = {}  # {session_id: conversation_data}
        self.session_timeout = 1800  # 30 minutes
    
    def add_message(self, session_id: str, user_message: str, ai_response: str):
        """Add message to conversation history"""
        if session_id not in self.sessions:
            self.sessions[session_id] = {
                'messages': [],
                'user_preferences': {},
                'last_products': [],
                'created_at': datetime.now()
            }
        
        self.sessions[session_id]['messages'].append({
            'user': user_message,
            'ai': ai_response,
            'timestamp': datetime.now()
        })
        
        # Keep only last 10 messages
        if len(self.sessions[session_id]['messages']) > 10:
            self.sessions[session_id]['messages'] = self.sessions[session_id]['messages'][-10:]
    
    def get_context(self, session_id: str) -> Dict:
        """Get conversation context"""
        if session_id not in self.sessions:
            return {}
        
        session = self.sessions[session_id]
        
        # Check if session expired
        if datetime.now() - session['created_at'] > timedelta(seconds=self.session_timeout):
            del self.sessions[session_id]
            return {}
        
        recent_messages = session['messages'][-3:]  # Last 3 messages
        return {
            'recent_context': recent_messages,
            'preferences': session['user_preferences'],
            'last_products': session.get('last_products', [])
        }
    
    def update_preferences(self, session_id: str, preferences: Dict):
        """Update user preferences for session"""
        if session_id in self.sessions:
            self.sessions[session_id]['user_preferences'].update(preferences)
    
    def set_last_products(self, session_id: str, products: List[Dict]):
        """Set last shown products"""
        if session_id in self.sessions:
            self.sessions[session_id]['last_products'] = products
    
    def cleanup_expired_sessions(self):
        """Remove expired sessions"""
        now = datetime.now()
        expired_sessions = []
        
        for session_id, session in self.sessions.items():
            if now - session['created_at'] > timedelta(seconds=self.session_timeout):
                expired_sessions.append(session_id)
        
        for session_id in expired_sessions:
            del self.sessions[session_id]
        
        if expired_sessions:
            logger.info(f"Cleaned up {len(expired_sessions)} expired sessions")

# Global instance
conversation_manager = ConversationManager()