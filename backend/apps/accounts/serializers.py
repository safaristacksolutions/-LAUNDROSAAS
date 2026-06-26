from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from .models import Role, AuditLog

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "phone", "first_name",
                  "last_name", "role", "is_onboarded"]
        read_only_fields = ["id"]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ["username", "email", "phone", "password", "confirm_password", "first_name", "last_name", "role"]

    def validate(self, data):
        if data["password"] != data.pop("confirm_password"):
            raise serializers.ValidationError({"confirm_password": "Passwords do not match"})
        return data

    def create(self, validated_data):
        password = validated_data.pop("password")
        if not validated_data.get("username"):
            validated_data["username"] = validated_data.get("phone", "").replace("+", "")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    phone = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(username=data["phone"], password=data["password"])
        if not user:
            raise serializers.ValidationError("Invalid phone or password")
        data["user"] = user
        return data
