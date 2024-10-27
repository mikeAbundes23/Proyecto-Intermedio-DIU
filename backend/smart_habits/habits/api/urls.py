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
        get_progress_by_category,
        get_habit_notifications,
        reminder
        )

router = DefaultRouter()

urlpatterns = [
    *router.urls,
    path('habits/', get_habits),
    path('habits/create/', create_habit),
    path('habits/<int:habit_id>/', get_habit),
    path('habits/delete/<int:habit_id>/', delete_habit),
    path('habits/progress/<int:habit_id>/', get_habit_progress),
    path('habits/update/<int:habit_id>/', update_habit),
    path('habits/update/progress/<int:habit_id>/', update_progress),
    path('habits/progress/by-category/<str:category>/', get_progress_by_category),
    path('habits/notifications/', get_habit_notifications),
    path('habits/reminder/', reminder) 
]