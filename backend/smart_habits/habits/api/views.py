import random
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status

from django.shortcuts import get_object_or_404
from django.utils import timezone
from datetime import timedelta

from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.permissions import IsAuthenticated, AllowAny

from ..models import Habit, HabitProgress
from .serializers import (
    HabitSerializer, 
    HabitInfoSerializer,
    HabitListSerializer, 
    HabitProgressSerializer, 
    HabitProgressInfoSerializer, 
    HabitProgressListSerializer,
    HabitReminderSerializer,
    HabitNotificationSerializer
)
from user.models import User

"""
    Función para obtener la información de todos los hábitos del usuario logueado
"""
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_habits(request):
    try:
        habits = Habit.objects.filter(user=request.user.id)
        
        if not habits:
            return Response({"message": "No hay hábitos registrados"}, status=status.HTTP_200_OK)
        
        
        for habit in habits:
            
            habit_date = habit.start_date.replace(hour=0, minute=0, second=0, microsecond=0)
            today_date = timezone.now()
            today_date = today_date - timedelta(hours=6)
            today_date = today_date.replace(hour=0, minute=0, second=0, microsecond=0)
 
            # Se reinicia el día del hábito
            if habit_date != today_date:
            
                #print(habit_date)
                habit_progress = get_object_or_404(HabitProgress, habit=habit.id)
                
                # Objeto con la nueva información del hábito
                habit_data = {}
                
                progress_array = habit_progress.progress_array
                if len(progress_array) == 30:
                    progress_array.pop(0)
                    
                progress_array.append(progress_array[-1])
                  
                days_elapsed = habit.days_elapsed + 1
                
                # Reinicio de la información del hábito cuando ha pasado su frecuencia
                # Refactorizar, se puede unificar
                if habit.frequency == 'm' and days_elapsed > 30:
                    days_elapsed = 1
                    habit_data['achieved'] = 0
                    habit_data['is_completed'] = False
                    progress_array[-1] = 0
                elif habit.frequency == 'w' and days_elapsed > 7:
                    days_elapsed = 1
                    habit_data['achieved'] = 0
                    habit_data['is_completed'] = False
                    progress_array[-1] = 0
                elif habit.frequency == 'd' and days_elapsed > 1:
                    days_elapsed = 1
                    habit_data['achieved'] = 0
                    habit_data['is_completed'] = False
                    progress_array[-1] = 0
                    
                habit_progress.progress_array = progress_array
                habit_progress.updated_at = today_date
                habit_progress.save()
                    
                habit_data['days_elapsed'] = days_elapsed
                habit_data['start_date'] = today_date
                
                habit_serializer = HabitSerializer(habit, data=habit_data, partial=True)
                if not habit_serializer.is_valid():
                    return Response(habit_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                habit_serializer.save()
        
        habits_serializer = HabitListSerializer(habits, many=True)
        return Response({"data":habits_serializer.data}, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
"""
    Función para obtener la información de un hábito por su id
    - int habit_id: ID del hábito
"""  
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_habit(request, habit_id):
    try:
        habit = get_object_or_404(Habit, id=habit_id, user=request.user.id)
        
        habit_serializer = HabitInfoSerializer(habit)
        return Response({"data": habit_serializer.data}, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
"""
    Función para crear un hábito
""" 
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_habit(request):
    try:
        habit_data = request.data # Obtenemos los datos del hábito
        user = get_object_or_404(User, id=request.user.id) # Obtenemos el usuario logueado
        habit_data['user'] = user.id # Agregamos el usuario al diccionario de datos
        
        start_date = timezone.now() 
        start_date = start_date - timedelta(hours=6)
        start_date = start_date.replace(hour=0, minute=0, second=0, microsecond=0)
        habit_data['start_date'] = start_date # Establecemos la fecha de inicio desde el día actual
        
        habit_serializer = HabitSerializer(data=habit_data) # Creamos el serializador
        
        if not habit_serializer.is_valid(): 
            return Response(habit_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                
        habit = habit_serializer.save(user=user) # Guardamos el hábito en la base de datos

        # Creamos el registro del progreso del hábito
        habit_progress = HabitProgress.objects.create(
                habit=habit,
                updated_at=start_date,
                progress_array=[0]
            )
        habit_progress.save() # Guardamos el progreso del hábito en la base de datos
        
        response_serializer = HabitSerializer(habit)
         
        return Response({"data" : response_serializer.data}, status=status.HTTP_201_CREATED)   
       
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

"""
    Función para eliminar un hábito por su id
    - int habit_id: ID del hábito
"""
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_habit(request, habit_id):
    try:
        habit = get_object_or_404(Habit, id=habit_id, user=request.user.id)
        habit.delete()
        
        return Response({"message": "Hábito eliminado correctamente"}, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
"""
    Función para actualizar la información general de un hábito por su id
    - int habit_id: ID del hábito
"""
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_habit(request, habit_id):
    try:
        habit = get_object_or_404(Habit, id=habit_id, user=request.user.id)
        
        habit_data = request.data
        habit_serializer = HabitSerializer(habit, data=habit_data, partial=True)
        
        if not habit_serializer.is_valid():
            return Response(habit_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        habit = habit_serializer.save()
        
        response_serializer = HabitSerializer(habit)
        return Response({ "message" : "Hábito actualizado." ,"data" : response_serializer.data}, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


"""
    Función para actualizar el progreso de un hábito por su id
    - int habit_id: ID del hábito
"""
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_progress(request, habit_id):
    try:
        habit = get_object_or_404(Habit, id=habit_id, user=request.user.id) 
        achived_data = request.data.get('achieved')        
        user = get_object_or_404(User, id=request.user.id)
        
        
        
        # Objeto con la información del progreso del hábito
        habit_progress = get_object_or_404(HabitProgress, habit=habit.id)
        
        # Objeto con la información nueva del último progreso del hábito
        habit_data = request.data
        habit_progress_data = {}
        
        progress_array = habit_progress.progress_array # Array con el los porcentajes de progreso
        
        # Progreso actual del hábito
        progress = int((achived_data * 100) / habit.goal)
    
        if progress >= 100:
            progress = 100
            habit_data['is_completed'] = True
        else:
            habit_data['is_completed'] = False
            
        progress_updated_at =  habit_progress.updated_at.replace(hour=0, minute=0, second=0, microsecond=0)
        today_date = timezone.now() 
        today_date = today_date - timedelta(hours=6)
        today_date = today_date.replace(hour=0, minute=0, second=0, microsecond=0) 
               
        # Actualizamos la fecha de acutalización del hábito y el progreso
        habit_progress_data['updated_at'] = today_date
        habit_data['start_date'] = today_date
        
        # Si es un día distito, creamos un nuevo progreso
        if progress_updated_at == today_date:
            progress_array[-1] = progress
        else:
            progress_array.append(progress)
            
        # Asegurarno que la información no pasa de 30 días
        if len(progress_array) > 30:
            progress_array.pop(0)
            
        habit_progress_data['progress_array'] = progress_array
        
        # Actualizamos el hábito
        habit_serializer = HabitSerializer(habit, data=habit_data, partial=True)       
        if not habit_serializer.is_valid():
            return Response(habit_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        habit_serializer.save()
        
        # Actualizamos el progreso del hábito
        habit_progress_serializer = HabitProgressSerializer(habit_progress, data=habit_progress_data, partial=True)
        if not habit_progress_serializer.is_valid():
            return Response(habit_progress_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        habit_progress_serializer.save()
        
        # Ver que solo ha pasado un día para actualizar la racha
        if (today_date - user.updated_at).days == 1:
            user.ongoing_streak += 1
        else: # se reinicia la racha
            user.ongoing_streak = 1
            
        # Verificar si la racha actual es mayor a la racha más larga
        if user.ongoing_streak > user.longest_streak:
            user.longest_streak = user.ongoing_streak
            
        user.updated_at = today_date
        user.save()
                  
        return Response({"message": "Progreso actualizado correctamente"}, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
   
"""
    Función para obtener el progreso de un hábito por su id
    - int habit_id: ID del hábito
"""
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_habit_progress(request, habit_id):
    try:
        habit = get_object_or_404(Habit, id=habit_id, user=request.user.id)
        
        habit_progress = get_object_or_404(HabitProgress, habit=habit.id)
        
        habit_progress_serializer = HabitProgressInfoSerializer(habit_progress)
        return Response({"data" : habit_progress_serializer.data}, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

"""
    Función para obtener el progreso de todos los o un filtrado
    de los hábitos por su categoría .
    - str category: Categoría de los hábitos
"""
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_progress_by_category(request, category):
    try:
        
        if category == 'all': 
            habits = Habit.objects.filter(user=request.user.id)
        else: # Información de los hábitos por categoría
            habits = Habit.objects.filter(user=request.user.id, category=category)
        #print(habits)
        
        if not habits:
            return Response({"message": "No hay hábitos en la categoría seleccionada"}, status=status.HTTP_200_OK)
        
        habits_completed = 0
        habits_incopmleted = 0
        
        habits_progress = []
        for habit in habits:
            habit_progress = get_object_or_404(HabitProgress, habit=habit.id)
            if habit.is_completed:
                habits_completed += 1
            else:
                habits_incopmleted += 1
            
            habits_progress.append(habit_progress)
        
        habits_progress_serializer = HabitProgressListSerializer(habits_progress, many=True)
        
        habits_completed = (habits_completed * 100) / len(habits)
        habits_incopmleted = (habits_incopmleted * 100) / len(habits)
        
        return Response({
            "data": habits_progress_serializer.data,
            "habits_completed": habits_completed,
            "habits_incopmleted": habits_incopmleted
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
 
 
""" 
    Funcion para obtener un listado de hábitos que pertenecen al usuario logueado,
    que no han sido completados y que tienen un recordatorio activo. 
"""
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_habit_notifications(request):
    try:
        habits = Habit.objects.filter(user=request.user.id, is_required_reminder=True, is_completed=False)
        
        if not habits:
            return Response({"message": "No hay hábitos por los que notificar"}, status=status.HTTP_200_OK)
        
        frases_motivacion = {
            1: "Hoy es el día para acercarte un poco más.",
            2: "Cada pequeño paso cuenta más de lo que imaginas.",
            3: "Lo que siembras hoy, lo recogerás mañana.",
            4: "A veces, lo más difícil es lo que más necesitas.",
            5: "El cambio comienza cuando menos lo esperas.",
            6: "Hazlo ahora, porque después será diferente.",
            7: "Es solo un momento, pero su impacto durará.",
            8: "Lo que parece pequeño, puede ser grande con el tiempo.",
            9: "Un hábito hoy, una vida mañana.",
            10: "La constancia es la clave para descubrir lo que está oculto."
        }

        limit = 0
        
        if len(habits) > 3:
            limit = 3
        else:
            limit = len(habits)        
        
        notifications = {}
        
        i  = 0
        while i < limit:
            notifications[habits[i].habit] = frases_motivacion[random.randint(1, 10)]
            i += 1
            
        return Response({"data": notifications}, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def reminder(request):
    try:
        habits = Habit.objects.filter(user=request.user.id, is_required_reminder=True, is_completed=False)
        
        if not habits:
            return Response({"message": "No hay hábitos con recordatorio"}, status=status.HTTP_200_OK)
        
        habit = habits[random.randint(0, len(habits) - 1)]
        
        habitt_serializer = HabitReminderSerializer(habit)
        return Response({"data": habitt_serializer.data}, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)