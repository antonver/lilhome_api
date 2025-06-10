from django.urls import path
from .views import RegisterView, UserSearchView,BusinessProfileUpdateView,UserProfileUpdateView,EventListCreateView,EventSearchView,JoinEventView,EventParticipantsView,EventDetailView,LeaveEventView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('search/', UserSearchView.as_view(), name='user_search'),
    path('profile/update/', UserProfileUpdateView.as_view(), name='profile-update'),
    path('business/<int:pk>/', BusinessProfileUpdateView.as_view(), name='business-profile-update'),
    path('business/profile/', BusinessProfileUpdateView.as_view(), name='business-profile'),
    path('events/', EventListCreateView.as_view(), name='event-list-create'),
    path('events/<int:pk>/', EventDetailView.as_view(), name='event-detail'),
    path('events/<int:pk>/leave/', LeaveEventView.as_view(), name='event-leave'),
    path('events/<int:pk>/join/', JoinEventView.as_view(), name='event-join'),
    path('events/<int:pk>/participants/', EventParticipantsView.as_view(), name='event-participants'),
    path('events/search/', EventSearchView.as_view(), name='event_search'),
]
