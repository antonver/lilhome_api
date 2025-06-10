from django.db import models
from django.conf import settings
import uuid


class Conversation(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='conversations')
    title = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Conversation #{self.id} for {self.user.email}"

class ChatMessage(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='chat_messages')
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE)
    message = models.TextField()
    response = models.TextField(blank=True)
    sentiment = models.CharField(max_length=10, blank=True)  # Поле для хранения настроения
    created_at = models.DateTimeField(auto_now_add=True)
    file = models.FileField(upload_to='chat_files/', null=True, blank=True)

    def __str__(self):
        return f"Chat from {self.user.email} at {self.created_at}"
    
class UserSettings(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    preferred_language = models.CharField(max_length=10, default='en')
    tone_of_voice = models.CharField(max_length=50, default='formal')

    def __str__(self):
        return f"{self.user.email}'s settings"