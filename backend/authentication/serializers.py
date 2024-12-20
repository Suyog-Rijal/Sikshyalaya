from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer
from rest_framework.exceptions import ValidationError

from .models import User


class UserCreateSerializer(BaseUserCreateSerializer):
    class Meta(BaseUserCreateSerializer.Meta):
        fields = [
            'id',
            'email',
            'password',
            'first_name',
            'last_name',
            'date_of_birth',
            'gender',
            'role',
            'blood_group',
            'profile_picture'
        ]

