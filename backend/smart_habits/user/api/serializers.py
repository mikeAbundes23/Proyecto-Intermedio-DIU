from rest_framework import serializers
from ..models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','name', 'last_name', 'username', 'email']
        
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