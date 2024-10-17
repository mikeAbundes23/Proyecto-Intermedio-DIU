from rest_framework import serializers
from ..models import Habit, HabitProgress

# Serializador para crear un hábito y obtener un hábito
class HabitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Habit
        fields = '__all__'

# Serializador para la lista de hábitos        
class HabitListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Habit
        fields = ['id', 'habit', 'category', 'achieved', 'goal', 'is_completed']
        
# Serializador para obtener el progreso de un hábito
class HabitProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = HabitProgress
        fields = '__all__'
        

class HabitNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Habit
        fields = ['habit']

class HabitProgressInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = HabitProgress
        fields = ['updated_at', 'progress_array']
        
class HabitProgressListSerializer(serializers.ModelSerializer):
    habit = HabitNameSerializer()
    class Meta:
        model = HabitProgress
        fields = ['habit', 'progress_array']