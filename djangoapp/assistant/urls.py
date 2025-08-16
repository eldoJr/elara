from django.urls import path
from .views import ConversationListView, chat

urlpatterns = [
    path('conversations/', ConversationListView.as_view(), name='conversations'),
    path('chat/', chat, name='chat'),
]