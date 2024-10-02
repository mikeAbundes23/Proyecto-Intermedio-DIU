from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import create_user, login, get_user, logout

router = DefaultRouter()

urlpatterns = [
    *router.urls,
    path('user/create_user/', create_user),
    path('user/login/', login),
    path('user/', get_user),
    path('user/logout/', logout)
    
]