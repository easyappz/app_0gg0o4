from django.urls import path
from .views import RegisterView, LoginView, MeView, HelloView

urlpatterns = [
    path('auth/register', RegisterView.as_view(), name='auth-register'),
    path('auth/login', LoginView.as_view(), name='auth-login'),
    path('members/me', MeView.as_view(), name='members-me'),
    path('hello/', HelloView.as_view(), name='hello'),
]
