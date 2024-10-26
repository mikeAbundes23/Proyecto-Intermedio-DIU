from django.db import models
from user.models import User
from django.contrib.postgres.fields import ArrayField

from django.utils import timezone

# Create your models here.
class Habit(models.Model):
    CATEGORY_CHOICES = [
        ('school', 'Escuela'),
        ('work', 'Trabajo'),
        ('sports', 'Deporte'),
        ('cleaning', 'Limpieza'),
        ('leisure', 'Ocio'),
        ('other', 'Otro'),
    ]
    
    FREQUENCY_CHOICES = [
        ('d', 'Diario'),
        ('w', 'Semanal'),
        ('m', 'Mensual'),
    ]
    
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='habits')
    habit = models.CharField(max_length=255, null=False)
    description = models.TextField(null=True)
    category = models.CharField(max_length=255, choices=CATEGORY_CHOICES)
    frequency = models.CharField(max_length=1, choices=FREQUENCY_CHOICES)
    start_date = models.DateTimeField(default=timezone.now)
    goal = models.IntegerField(null=False)
    achieved = models.IntegerField(default=0)
    is_required_reminder = models.BooleanField(default=False)
    is_completed = models.BooleanField(default=False, null=False)
    days_elapsed = models.IntegerField(default=1)
    
    def __str__(self):
        return f"id: {self.id}, user: {self.user}, habit: {self.habit}, description: {self.description}, category: {self.category}, frequency: {self.frequency}, start_date: {self.start_date}, goal: {self.goal}, achieved: {self.achieved}, is_required_reminder: {self.is_required_reminder}, is_completed: {self.is_completed}, days_elapsed: {self.days_elapsed}"
    
class HabitProgress(models.Model):
    habit = models.ForeignKey(Habit, on_delete=models.CASCADE, related_name='progress')
    updated_at = models.DateTimeField(default=timezone.now)
    progress_array = ArrayField(models.IntegerField(), default=list, blank=True)  
    
    def __str__(self):
        return f"id: {self.id}, habit: {self.habit}, updated_at: {self.updated_at}, progress_array: {self.progress_array}"