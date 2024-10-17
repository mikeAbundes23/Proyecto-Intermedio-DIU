from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import ( 
        get_habits, 
        create_habit, 
        get_habit, 
        delete_habit, 
        get_habit_progress, 
        update_habit, 
        update_progress, 
        get_progress_by_category)


router = DefaultRouter()

urlpatterns = [
    *router.urls,
    path('habits/', get_habits),
    path('habits/create/', create_habit),
    path('habits/<int:habit_id>/', get_habit),
    path('habits/<int:habit_id>/delete/', delete_habit),
    path('habits/<int:habit_id>/progress/', get_habit_progress),
    path('habits/<int:habit_id>/update/', update_habit),
    path('habits/<int:habit_id>/progress/update/', update_progress),
    path('habits/proress/by-category/<str:category>/', get_progress_by_category),
]