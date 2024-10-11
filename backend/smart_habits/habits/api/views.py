from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status

from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.permissions import IsAuthenticated, AllowAny

from ..models import Habit
from .serializers import HabitSerializer, HabitListSerializer

from user.models import User

# Obtener la lista de hábitos que pertenecen al usuario logueado
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_habits(request):
    try:
        habits = Habit.objects.filter(user=request.user.id)
        
        habits_serializer = HabitListSerializer(habits, many=True)
        return Response(habits_serializer.data, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
# Obtener un hábito por su id    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_habit(request, habit_id):
    try:
        habit = get_object_or_404(Habit, id=habit_id, user=request.user.id)
        
        habit_serializer = HabitSerializer(habit)
        return Response(habit_serializer.data, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
# Crear un hábito    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_habit(request):
    try:
        habit_data = request.data # Obtenemos los datos del hábito
        user = get_object_or_404(User, id=request.user.id) # Obtenemos el usuario logueado
        habit_data['user'] = user.id # Agregamos el usuario al diccionario de datos
        
        start_date = timezone.now() 
        habit_data['start_date'] = start_date.replace(hour=0, minute=0, second=0, microsecond=0) # Establecemos la fecha de inicio desde el día actual
        
        habit_serializer = HabitSerializer(data=habit_data) # Creamos el serializador
        
        if not habit_serializer.is_valid(): 
            return Response(habit_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        habit = habit_serializer.save(user=user) # Guardamos el hábito 
        
        response_serializer = HabitSerializer(habit) # Creamos el serializador de respuesta
         
        return Response(response_serializer.data , status=status.HTTP_201_CREATED)   
       
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Eliminar un hábito
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_habit(request, habit_id):
    try:
        habit = get_object_or_404(Habit, id=habit_id, user=request.user.id)
        habit.delete()
        
        return Response({"message": "Hábito eliminado correctamente"}, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)