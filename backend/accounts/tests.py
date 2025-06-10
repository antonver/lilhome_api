from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from .models import User, BusinessProfile, Event
from django.urls import reverse
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from datetime import datetime,timedelta

class BusinessProfileTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='business@example.com', password='password', is_business=True
        )
        self.business_profile = BusinessProfile.objects.create(
            user=self.user, business_name='My Business', description='Best business ever', contact_info='123456789'
        )
        refresh = RefreshToken.for_user(self.user)
        self.token = str(refresh.access_token)

    def test_update_business_profile(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

        updated_data = {
            'business_name': 'Updated Business',
            'description': 'New description',
            'contact_info': '987654321'
        }

        url = reverse('business-profile')  # <-- fixed
        response = client.put(url, updated_data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['business_name'], 'Updated Business')
        self.assertEqual(response.data['description'], 'New description')
        self.assertEqual(response.data['contact_info'], '987654321')


class JWTAuthenticationTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='user@example.com', password='password', age=25, gender='male'
        )

    def test_obtain_jwt_token(self):
        url = reverse('token_obtain_pair')
        data = {'email': 'user@example.com', 'password': 'password'}
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_refresh_jwt_token(self):
        url = reverse('token_refresh')
        data = {'refresh': 'some_refresh_token'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class UserProfileUpdateTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='user@example.com', password='password', age=25, gender='male',
            spoken_languages=['English'], location='New York'
        )
        refresh = RefreshToken.for_user(self.user)
        self.token = str(refresh.access_token)

    def test_update_profile(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

        updated_data = {
            'age': 30,
            'gender': 'female',
            'spoken_languages': ['English', 'Spanish'],
            'location': 'Los Angeles'
        }

        url = reverse('profile-update')  # <-- fixed
        response = client.put(url, updated_data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['age'], 30)
        self.assertEqual(response.data['gender'], 'female')
        self.assertEqual(response.data['spoken_languages'], ['English', 'Spanish'])
        self.assertEqual(response.data['location'], 'Los Angeles')


class UserSearchTests(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(
            email='user1@example.com', password='password', age=25, gender='male',
            spoken_languages=['English', 'Spanish'], location='New York'
        )
        self.user2 = User.objects.create_user(
            email='user2@example.com', password='password', age=30, gender='female',
            spoken_languages=['French', 'English'], location='Paris'
        )
        self.user3 = User.objects.create_user(
            email='user3@example.com', password='password', age=40, gender='other',
            spoken_languages=['German', 'English'], location='Berlin'
        )

        # Аутентифицируем для тестов
        refresh = RefreshToken.for_user(self.user1)
        self.token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

    def test_filter_by_age(self):
        # Аутентификация
        refresh = RefreshToken.for_user(self.user1)
        token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)

        url = reverse('user_search')
        
        # Ищем пользователей, чей возраст строго 30
        response = self.client.get(url, {'age_min': 30, 'age_max': 30})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['email'], 'user2@example.com') 
        response = self.client.get(url, {'age_min': 30})
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]['email'], 'user2@example.com')
        self.assertEqual(response.data[1]['email'], 'user3@example.com')
        response = self.client.get(url, {'age_max': 30})
        self.assertEqual(len(response.data), 2)
         # Только user2 (30 лет)
        self.assertEqual(response.data[0]['email'], 'user1@example.com')
        self.assertEqual(response.data[1]['email'], 'user2@example.com')
    # user2

    def test_filter_by_gender(self):
        url = reverse('user_search')
        response = self.client.get(url, {'gender': 'female'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  # user2

    def test_filter_by_language(self):
        url = reverse('user_search')
        response = self.client.get(url, {'language': 'English'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)  # Все

    def test_filter_by_location(self):
        url = reverse('user_search')
        response = self.client.get(url, {'location': 'New York'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  # user1

class EventTests(APITestCase):
    def setUp(self):
        self.creator = User.objects.create_user(email='creator@example.com', password='pass', is_business=True)
        self.user = User.objects.create_user(email='user@example.com', password='pass')
        
        self.event = Event.objects.create(
            creator=self.creator,
            title='Test Event',
            description='Test Description',
            location='Paris',
            date=datetime.now() + timedelta(days=1),
            time=datetime.now().time(),
        )
        self.event.participants.add(self.creator, self.user)

        self.creator_token = str(RefreshToken.for_user(self.creator).access_token)
        self.user_token = str(RefreshToken.for_user(self.user).access_token)

    def test_event_detail_view(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.creator_token)
        
        url = reverse('event-detail', args=[self.event.id])
        response = client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test Event')

    def test_event_update_by_creator(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.creator_token)
        
        url = reverse('event-detail', args=[self.event.id])
        data = {
            'title': 'Updated Title',
            'description': 'Updated description',
            'location': 'Berlin',
            'date': (datetime.now() + timedelta(days=2)).date().isoformat(),
            'time': (datetime.now() + timedelta(hours=2)).time().strftime('%H:%M:%S')
            }
        response = client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Updated Title')

    def test_event_update_by_non_creator(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.user_token)

        url = reverse('event-detail', args=[self.event.id])
        data = {'title': 'Hacked Title'}
        response = client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_leave_event(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.user_token)

        url = reverse('event-leave', args=[self.event.id])
        response = client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertNotIn(self.user, self.event.participants.all())

    def test_leave_event_not_participant(self):
        new_user = User.objects.create_user(email='outsider@example.com', password='pass')
        outsider_token = str(RefreshToken.for_user(new_user).access_token)

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='Bearer ' + outsider_token)

        url = reverse('event-leave', args=[self.event.id])
        response = client.post(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class EventSearchTests(APITestCase):
    def setUp(self):
        # Создаем пользователя и получаем токен
        self.user = User.objects.create_user(
            email='user@example.com', password='password', age=25, gender='male'
        )
        refresh = RefreshToken.for_user(self.user)
        self.token = str(refresh.access_token)  # Токен для авторизации

        # Создаем события для поиска
        self.event1 = Event.objects.create(
            title='Event 1', 
            description='Description 1',
            date='2025-06-01',
            time='15:00',
            location='New York',
            creator=self.user
        )
        self.event2 = Event.objects.create(
            title='Event 2', 
            description='Description 2',
            date='2025-12-05',
            time='18:00',
            location='Los Angeles',
            creator=self.user
        )
    
    def test_event_search_by_date(self):
        url = reverse('event_search')
        response = self.client.get(url, {'start_date': '2025-06-01', 'end_date': '2025-06-10'}, HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  # Только event1 попадает в диапазон

    def test_event_search_by_location(self):
        url = reverse('event_search')
        response = self.client.get(url, {'location': 'New York'}, HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  # Только event1 в New York

    def test_event_search_by_multiple_filters(self):
        # Пытаемся найти события с фильтрами
        url = reverse('event_search')  # Путь к API для поиска событий
        params = {
            'date': '2025-12-01',  # Фильтруем по дате
            'location': 'New York'  # Фильтруем по локации
        }

        response = self.client.get(url, params, HTTP_AUTHORIZATION=f'Bearer {self.token}')  # Параметры и заголовок
        
        # Проверяем статус и количество найденных событий
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  # Должно быть одно событие, соответствующее фильтрам
        self.assertEqual(response.data[0]['title'], 'Event 1')  # Проверяем правильность данных