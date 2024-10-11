from django.db import models
from user.models import User

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
    category = models.CharField(max_length=255, choices=CATEGORY_CHOICES)
    frequency = models.CharField(max_length=1, choices=FREQUENCY_CHOICES)
    start_date = models.DateTimeField(default=timezone.now)
    goal = models.IntegerField(null=False)
    achieved = models.IntegerField(default=0)
    is_required_reminder = models.BooleanField(default=False)
    
    def __str__(self):
        return f"id: {self.id}, user: {self.user}, habit: {self.habit}, category: {self.category}, frequency: {self.frequency}, start_date: {self.start_date}, goal: {self.goal}, achieved: {self.achieved}, is_required_reminder: {self.is_required_reminder}"
    