from rest_framework import generics, serializers, status, permissions
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import User, BusinessProfile, Event
from .serializers import RegisterSerializer, UserProfileSerializer, BusinessProfileSerializer, EventSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

class BusinessProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        business_profile = request.user.business_profile
        serializer = BusinessProfileSerializer(business_profile)
        return Response(serializer.data)

    def put(self, request):
        business_profile = request.user.business_profile
        serializer = BusinessProfileSerializer(business_profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class IsBusinessUser(permissions.BasePermission):
    """
    Доступ только для пользователей с is_business=True
    """
    def has_object_permission(self, request, view, obj):
        return obj.is_business and obj == request.user

class BusinessProfileUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = BusinessProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsBusinessUser]

    def get_object(self):
        # Возвращает бизнес-профиль текущего пользователя
        return BusinessProfile.objects.get(user=self.request.user)

class UserProfileUpdateView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    def put(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = UserProfileSerializer(user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

class UserSearchView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer
    
    def get_queryset(self):
        queryset = User.objects.all()
        age_min = self.request.query_params.get('age_min', None)
        age_max = self.request.query_params.get('age_max', None)
        gender = self.request.query_params.get('gender', None)
        language = self.request.query_params.get('language', None)
        location = self.request.query_params.get('location', None)
        
        if age_min:
            queryset = queryset.filter(age__gte=int(age_min))
        if age_max:
            queryset = queryset.filter(age__lte=int(age_max))
        if gender:
            queryset = queryset.filter(gender=gender)
        if language:
            queryset = queryset.filter(spoken_languages__icontains=language)
        if location:
            queryset = queryset.filter(location__icontains=location)
        
        return queryset

class EventListCreateView(generics.ListCreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class JoinEventView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            event = Event.objects.get(pk=pk)
        except Event.DoesNotExist:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

        event.participants.add(request.user)
        return Response({'message': 'You have joined the event.'}, status=status.HTTP_200_OK)

class EventParticipantsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            event = Event.objects.get(pk=pk)
        except Event.DoesNotExist:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

        participants = event.participants.all()
        serializer = UserProfileSerializer(participants, many=True)
        return Response(serializer.data)
    
class IsEventCreator(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.creator == request.user

class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated, IsEventCreator]

class LeaveEventView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        event = get_object_or_404(Event, pk=pk)
        user = request.user

        if user in event.participants.all():
            event.participants.remove(user)
            return Response({"detail": "You have left the event."}, status=status.HTTP_200_OK)
        return Response({"detail": "You are not a participant of this event."}, status=status.HTTP_400_BAD_REQUEST)

class EventSearchView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = EventSerializer
    
    def get_queryset(self):
        queryset = Event.objects.all()
        
        # Фильтрация по дате
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        
        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)
        
        # Фильтрация по местоположению
        location = self.request.query_params.get('location', None)
        if location:
            queryset = queryset.filter(location__icontains=location)
        

        return queryset