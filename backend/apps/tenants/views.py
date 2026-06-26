from rest_framework import viewsets, permissions
from .models import Tenant
from .serializers import TenantSerializer


class TenantViewSet(viewsets.ModelViewSet):
    queryset = Tenant.objects.all()
    serializer_class = TenantSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        tenant = serializer.save()
        tenant.create_schema()
