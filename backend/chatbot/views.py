from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import ChatMessage, Conversation, UserSettings
from .serializers import ChatMessageSerializer, ConversationSerializer, UserSettingsSerializer
from .utils import ask_openai  # Предположим, что у вас есть функция для общения с OpenAI
from textblob import TextBlob
import os

def analyze_sentiment(text):
    if not text:  # Handle None or empty string
        return "neutral"
    blob = TextBlob(text)
    sentiment = blob.sentiment.polarity
    if sentiment > 0.1:
        return "positive"
    elif sentiment < -0.1:
        return "negative"
    else:
        return "neutral"

class ChatBotView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        message_text = request.data.get("message")
        file = request.FILES.get("file")

        if not message_text and not file:
            return Response({"error": "Message or file is required"}, status=400)

        # Analyze sentiment only if message_text exists
        sentiment = analyze_sentiment(message_text) if message_text else "neutral"

        # Get or create conversation
        conversation, created = Conversation.objects.get_or_create(user=user)

        # Call OpenAI (adjust if OpenAI handles files differently)
        response_text = ask_openai(message_text or "", conversation)

        # Save file if present
        file_name = None
        if file:
            file_name = os.path.join('chat_files', file.name)
            with open(os.path.join('media', file_name), 'wb') as f:
                for chunk in file.chunks():
                    f.write(chunk)

        # Save message
        chat = ChatMessage.objects.create(
            user=user,
            conversation=conversation,
            message=message_text or "",  # Use empty string if None
            response=response_text,
            file=file_name,
            sentiment=sentiment
        )

        serializer = ChatMessageSerializer(chat)
        return Response(serializer.data)

class ChatHistoryView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChatMessageSerializer

    def get_queryset(self):
        user = self.request.user
        conversation_id = self.kwargs['conversation_id']
        return ChatMessage.objects.filter(conversation__id=conversation_id, user=user).order_by('created_at')
    
class ConversationListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ConversationSerializer

    def get_queryset(self):
        return Conversation.objects.filter(user=self.request.user).order_by('-created_at')

class UserSettingsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Проверяем, существуют ли настройки для текущего пользователя
        settings, created = UserSettings.objects.get_or_create(user=request.user)
        
        # Сериализуем данные
        serializer = UserSettingsSerializer(settings)
        return Response(serializer.data)

    def put(self, request):
        # Проверяем, существуют ли настройки для текущего пользователя
        settings, created = UserSettings.objects.get_or_create(user=request.user)

        # Создаем сериализатор с данными из запроса и разрешаем частичную актуализацию
        serializer = UserSettingsSerializer(settings, data=request.data, partial=True)
        
        if serializer.is_valid():  # Проверяем данные на валидность
            serializer.save()  # Сохраняем изменения
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


    

