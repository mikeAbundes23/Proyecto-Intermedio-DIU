from rest_framework import serializers
from ..models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','name', 'last_name', 'username', 'email', 'ongoing_streak', 'longest_streak']
        
class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','name', 'last_name', 'username', 'email', 'password']
        
    def validate(self, data):
        error = {}
        for field in data:
            if not data[field]:
                error[field] = f"{field} is required"
        if error:
            raise serializers.ValidationError(error)
        return data
    
class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['name', 'last_name', 'username', 'email', 'password']
        extra_kwargs = {
            'name': {'required': False},
            'last_name': {'required': False},
            'username': {'required': False},
            'email': {'required': False},
            'password': {'required': False},
        }
        
    def validate(self, data):
        # Solo validamos los campos que vienen en la petición
        for field_name, value in data.items():
            if not value or str(value).strip() == "":
                raise serializers.ValidationError(f"El campo {field_name} no puede estar vacío")
        return data