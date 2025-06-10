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
    blob = TextBlob(text)
    sentiment = blob.sentiment.polarity
    # Устанавливаем пороги для положительного и отрицательного настроения
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

        # Анализируем настроение
        sentiment = analyze_sentiment(message_text)

        # Получаем или создаем разговор для пользователя
        conversation, created = Conversation.objects.get_or_create(user=user)

        # Логика отправки сообщения в OpenAI
        response_text = ask_openai(message_text, conversation)

        # Сохраняем файл, если он есть
        file_name = None
        if file:
            # Сохраняем файл в нужную директорию
            file_name = os.path.join('chat_files', file.name)
            # сохраняем файл в Media директории
            with open(os.path.join('media', file_name), 'wb') as f:
                for chunk in file.chunks():
                    f.write(chunk)

        # Сохраняем в БД
        chat = ChatMessage.objects.create(
            user=user,
            conversation=conversation,
            message=message_text,
            response=response_text,
            file=file_name if file else None,    
            sentiment=sentiment  # Добавляем настроение
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


    

