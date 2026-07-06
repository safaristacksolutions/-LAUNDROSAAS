from rest_framework import generics, permissions, views, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
import random
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer
from .models import PasswordResetCode

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)
        return Response({
            "user": UserSerializer(user).data,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }, status=status.HTTP_201_CREATED)


class LoginView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        refresh = RefreshToken.for_user(user)
        return Response({
            "user": UserSerializer(user).data,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        })


class MeView(views.APIView):
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class EmployeeListView(generics.ListAPIView):
    serializer_class = UserSerializer

    def get_queryset(self):
        return User.objects.filter(role__in=["employee", "cashier", "admin"]).order_by("id")


class ForgotPasswordView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        phone = request.data.get("phone")
        if not phone:
            return Response({"error": "Phone number is required"}, status=400)

        try:
            user = User.objects.get(phone=phone)
        except User.DoesNotExist:
            return Response({"error": "No account found with this phone number"}, status=404)

        code = f"{random.randint(100000, 999999)}"

        PasswordResetCode.objects.create(phone=phone, code=code)

        # In production: send code via Africa's Talking SMS
        # at_send_sms(phone, f"LaundroSaaS password reset code: {code}")

        return Response({
            "message": "Reset code sent to your phone",
            "code": code,
        })


class ResetPasswordView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        phone = request.data.get("phone")
        code = request.data.get("code")
        new_password = request.data.get("new_password")

        if not all([phone, code, new_password]):
            return Response({"error": "Phone, code, and new password are required"}, status=400)

        if len(new_password) < 6:
            return Response({"error": "Password must be at least 6 characters"}, status=400)

        reset = PasswordResetCode.objects.filter(
            phone=phone, code=code, is_used=False,
            created_at__gte=timezone.now() - timedelta(minutes=10)
        ).first()

        if not reset:
            return Response({"error": "Invalid or expired reset code"}, status=400)

        try:
            user = User.objects.get(phone=phone)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        user.set_password(new_password)
        user.save()

        reset.is_used = True
        reset.save()

        return Response({"message": "Password reset successful"})
