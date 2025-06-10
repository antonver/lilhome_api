# chatbot/tests.py

from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from chatbot.models import ChatMessage, Conversation
from django.core.files.uploadedfile import SimpleUploadedFile

User = get_user_model()


class ChatBotTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='test@example.com', password='testpass123')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.url = '/api/chatbot/chat/'

    def test_create_conversation_and_chat(self):
        response = self.client.post(self.url, {'message': 'Привет, бот!'}, format='json')
        
        # Проверяем статус код
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Проверяем, что в ответе есть поле 'response'
        self.assertIn('response', response.data)

        # Проверяем, что сообщение было сохранено в базе данных
        self.assertTrue(ChatMessage.objects.exists())
        
        # Проверяем, что был создан разговор (если логика предполагает создание нового разговора)
        self.assertTrue(Conversation.objects.exists())

class ChatBotTestsWithFileAndSentiment(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='test@example.com', password='testpass123')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.url = '/api/chatbot/chat/'

    def test_send_message_with_file_and_sentiment(self):
        # Создаем файл для теста
        file = SimpleUploadedFile('test_file.txt', b'file_content', content_type='text/plain')
        
        # Отправляем сообщение с файлом
        response = self.client.post(self.url, {'message': 'I am very happy today!', 'file': file}, format='multipart')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Проверяем, что файл был сохранен
        chat_message = ChatMessage.objects.first()
        self.assertEqual(chat_message.file, 'chat_files/test_file.txt')  # Убедитесь, что путь к файлу корректен

        # Проверяем, что настроение анализа правильное
        self.assertEqual(chat_message.sentiment, 'positive')

class ChatHistoryTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='test@example.com', password='testpass123')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.url = '/api/chatbot/chat/'

        # Создаем разговор
        self.client.post(self.url, {'message': 'Привет, бот!'}, format='json')
        self.client.post(self.url, {'message': 'Как дела, бот?'}, format='json')

    def test_conversation_history(self):
        conversation = Conversation.objects.filter(user=self.user).first()
        
        # Получаем историю сообщений для первого чата
        response = self.client.get(f'/api/chatbot/conversations/{conversation.id}/messages/', format='json')
        
        # Проверяем, что получаем статус 200
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Проверяем, что в ответе есть хотя бы одно сообщение
        self.assertGreater(len(response.data), 0)

        # Проверяем, что все сообщения принадлежат правильному разговору
        for message in response.data:
            self.assertEqual(message['conversation'], conversation.id)

