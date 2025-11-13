from django.urls import path
from .views import RegisterView, LoginView, MeView, HelloView
from .views import AdsListCreateView, AdRetrieveUpdateDestroyView, MyAdsListView

urlpatterns = [
    path('auth/register', RegisterView.as_view(), name='auth-register'),
    path('auth/login', LoginView.as_view(), name='auth-login'),
    path('members/me', MeView.as_view(), name='members-me'),
    path('hello/', HelloView.as_view(), name='hello'),
]

urlpatterns += [
    path('ads', AdsListCreateView.as_view(), name='ads-list-create'),
    path('ads/<int:pk>', AdRetrieveUpdateDestroyView.as_view(), name='ads-detail'),
    path('my/ads', MyAdsListView.as_view(), name='my-ads'),
]
