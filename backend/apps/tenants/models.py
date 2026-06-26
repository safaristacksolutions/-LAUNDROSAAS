from django.db import models
from django_tenants.models import TenantMixin, DomainMixin


class Plan(models.Model):
    TIERS = [
        ("starter", "Starter"),
        ("pro", "Pro"),
        ("enterprise", "Enterprise"),
    ]

    code = models.CharField(max_length=20, unique=True, choices=TIERS)
    name = models.CharField(max_length=50)
    price_kes = models.DecimalField(max_digits=10, decimal_places=2)
    max_users = models.IntegerField(default=1)
    max_orders_monthly = models.IntegerField(default=300, null=True, blank=True)
    has_sms = models.BooleanField(default=False)
    sms_included = models.IntegerField(default=0)
    has_whatsapp = models.BooleanField(default=False)
    has_rent_health = models.BooleanField(default=False)
    has_analytics = models.BooleanField(default=False)
    has_multi_branch = models.BooleanField(default=False)
    mpesa_fee_percent = models.DecimalField(max_digits=4, decimal_places=2, default=2.5)
    mpesa_fee_min_kes = models.DecimalField(max_digits=6, decimal_places=2, default=5)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "plans"

    def __str__(self):
        return f"{self.name} (KES {self.price_kes}/mo)"


class Tenant(TenantMixin):
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True)
    logo = models.ImageField(upload_to="tenant_logos/", null=True, blank=True)
    address = models.TextField(blank=True)

    plan = models.ForeignKey(Plan, on_delete=models.SET_NULL, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    trial_ends_at = models.DateTimeField(null=True, blank=True)
    subscription_starts_at = models.DateTimeField(null=True, blank=True)
    auto_renew = models.BooleanField(default=True)

    mpesa_shortcode = models.CharField(max_length=20, blank=True)
    mpesa_passkey = models.CharField(max_length=200, blank=True)
    at_sender_id = models.CharField(max_length=11, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    auto_create_schema = True

    class Meta:
        db_table = "tenants"

    def __str__(self):
        return self.name


class Domain(DomainMixin):
    class Meta:
        db_table = "tenant_domains"

    def __str__(self):
        return self.domain
