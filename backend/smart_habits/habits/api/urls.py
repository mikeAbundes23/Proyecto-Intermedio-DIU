from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import get_habits, create_habit, get_habit, delete_habit


router = DefaultRouter()

urlpatterns = [
    *router.urls,
    path('habits/', get_habits),
    path('habits/create/', create_habit),
    path('habits/<int:habit_id>/', get_habit),
    path('habits/<int:habit_id>/delete/', delete_habit)   
]