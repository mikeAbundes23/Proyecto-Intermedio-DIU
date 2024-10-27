from rest_framework import serializers
from ..models import Habit, HabitProgress

# Serializador para crear un hábito y obtener un hábito
class HabitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Habit
        fields = '__all__'
        
# Serializador para obtener la información general de un hábito
class HabitInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Habit
        fields = ['id', 'habit', 'category', 'achieved', 'description', 'goal', 'is_completed', 'frequency', 'is_required_reminder', 'days_elapsed', 'days_elapsed']

# Serializador para obtener el recordatorio de un hábito
class HabitReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Habit
        fields = ['id', 'habit', 'description', 'frequency']
        
class HabitNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Habit
        fields = ['id', 'habit', 'description', 'is_required_reminder']

# Serializador para la lista de hábitos        
class HabitListSerializer(serializers.ModelSerializer):
    frequency_display = serializers.CharField(source='get_frequency_display', read_only=True)
    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = Habit
        fields = ['id', 'habit', 'category', 'category_display', 'achieved', 'goal', 'is_completed', 'frequency', 'frequency_display', 'description']
        
# Serializador para obtener el progreso de un hábito
class HabitProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = HabitProgress
        fields = '__all__'
        
# Serializador del Nombre de un Hábito
class HabitNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Habit
        fields = ['habit']

# Serializador unicamente con la fecha y el progreso de un hábito
class HabitProgressInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = HabitProgress
        fields = ['updated_at', 'progress_array']
        
# Serializador para la lista de progresos de un hábito
class HabitProgressListSerializer(serializers.ModelSerializer):
    habit = HabitNameSerializer()
    class Meta:
        model = HabitProgress
        fields = ['habit', 'progress_array']