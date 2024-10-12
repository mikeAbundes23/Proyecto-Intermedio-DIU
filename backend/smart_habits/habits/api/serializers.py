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
        fields = ['id', 'habit', 'category', 'achieved', 'goal']
        
# Serializador para obtener el progreso de un hábito
class HabitProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = HabitProgress
        fields = '__all__'

class HabitProgressInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = HabitProgress
        fields = ['date', 'progress', 'is_completed']