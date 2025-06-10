from django.conf import settings
from .models import ChatMessage, Conversation
from openai import OpenAI

client = OpenAI(api_key=settings.OPENAI_API_KEY)

# Убедись, что в вызове передается conversation_id

def ask_openai(message_text, conversation):
    # Получаем все сообщения из этой беседы
    chat_history = conversation.chatmessage_set.order_by('created_at')

    # Формируем сообщение для OpenAI
    messages = [{"role": "system", "content": "You are a helpful assistant."}]
    for msg in chat_history:
        messages.append({"role": "user", "content": msg.message})
        messages.append({"role": "assistant", "content": msg.response})

    messages.append({"role": "user", "content": message_text})

    # Отправка запроса в OpenAI
    response = client.chat.completions.create(model="gpt-3.5-turbo",
    messages=messages,
    temperature=0.9)

    return response.choices[0].message.content.strip()



