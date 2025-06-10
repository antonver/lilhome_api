from django.urls import path
from .views import ChatBotView, ChatHistoryView, ConversationListView

urlpatterns = [
    path('chat/', ChatBotView.as_view(), name='chat'),
    path('conversations/', ConversationListView.as_view(), name='conversation-list'),
    path('conversations/<int:conversation_id>/messages/', ChatHistoryView.as_view(), name='chat-history'),
]
