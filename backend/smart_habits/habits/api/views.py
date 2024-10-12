from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status

from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.permissions import IsAuthenticated, AllowAny

from ..models import Habit, HabitProgress
from .serializers import HabitSerializer, HabitListSerializer, HabitProgressSerializer, HabitProgressInfoSerializer

from user.models import User

#TO-DO ver que pasa cuano se cambia de día, hay que reiniciar el progreso del hábito


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

        # Creamos el progreso del hábito para el día actual
        habit_progress = HabitProgress.objects.create(
                habit=habit,
                date=timezone.now()
            )
        habit_progress.save()
        
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
        
        """ # Check if the `achieved` field was updated and if the goal is reached
        if 'achieved' in habit_data and habit.achieved >= habit.goal:
            # Save the progress as 100% and mark it as completed
            habit_progress = HabitProgress.objects.create(
                habit=habit,
                date=timezone.now(),
                progress=100,
                is_completed=True
            )
            habit_progress.save() """

        response_serializer = HabitSerializer(habit)
        return Response(response_serializer.data, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Actualizar el progreso de un hábito
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_progress(request, habit_id):
    try:
        habit = get_object_or_404(Habit, id=habit_id, user=request.user.id)
        achived_data = request.data.get('achieved')        
        last_progress = habit.progress.last()
        last_habit_progress = get_object_or_404(HabitProgress, id=last_progress.id)
        
        today_date = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
        last_progress_date = last_progress.date.replace(hour=0, minute=0, second=0, microsecond=0)
        

        habit_data = request.data
        
        # Calculamos el progreso del hábito
        progress = int((achived_data * 100) / habit.goal)
        print(progress)
        
        is_completed = False
        
        # Verificamos si el progreso es mayor o igual al 100%
        if progress >= 100:
            progress = 100
            is_completed = True
         
        # Actualizamos el hábito actual   
        habit_serializer = HabitSerializer(habit, data=habit_data, partial=True)
        if not habit_serializer.is_valid():
                return Response(habit_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        habit_serializer.save()
        
        # Verificamos si ya existe un progreso para el día actual
        if today_date != last_progress_date:
            habit_progress = HabitProgress.objects.create(
                habit=habit,
                date=timezone.now(),
                progress=progress,
                is_completed=is_completed
            )
            habit_progress.save()
        else:
            # Creamos el objeto de progreso del hábito
            habit_progress_data = {}           
            habit_progress_data['progress'] = progress
            habit_progress_data['is_completed'] = is_completed
             
            habit_progress_serializer = HabitProgressSerializer(last_habit_progress, data=habit_progress_data, partial=True)
            
            if not habit_progress_serializer.is_valid():
                return Response(habit_progress_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            habit_progress_serializer.save()

                    
        return Response({"message": "Progreso actualizado correctamente"}, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
   
# Obtener el la información del progreso de un hábito 
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_habit_progress(request, habit_id):
    try:
        habit = get_object_or_404(Habit, id=habit_id, user=request.user.id)
        
        habit_progress = habit.progress.all()
        
        habit_progress_serializer = HabitProgressInfoSerializer(habit_progress, many=True)
        return Response(habit_progress_serializer.data, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    