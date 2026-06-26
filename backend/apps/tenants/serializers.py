from rest_framework import serializers
from .models import Tenant, Domain


class TenantSerializer(serializers.ModelSerializer):
    subdomain = serializers.CharField(write_only=True)

    class Meta:
        model = Tenant
        fields = [
            "id", "name", "phone", "email", "logo",
            "address", "plan", "is_active", "trial_ends_at",
            "subdomain", "created_at",
        ]
        read_only_fields = ["id", "is_active", "trial_ends_at", "created_at"]

    def create(self, validated_data):
        subdomain = validated_data.pop("subdomain")
        tenant = Tenant.objects.create(**validated_data)
        Domain.objects.create(
            domain=f"{subdomain}.laundrosaas.com",
            tenant=tenant,
            is_primary=True,
        )
        return tenant
