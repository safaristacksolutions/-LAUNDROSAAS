from django.contrib.auth.models import AbstractUser
from django.db import models


class Role(models.Model):
    ROLES = [
        ("admin", "Admin (Owner)"),
        ("cashier", "Cashier"),
        ("employee", "Employee (Washer/Ironer)"),
    ]

    name = models.CharField(max_length=20, unique=True, choices=ROLES)
    description = models.TextField(blank=True)

    class Meta:
        db_table = "roles"

    def __str__(self):
        return self.get_name_display()


class User(AbstractUser):
    ROLE_CHOICES = [
        ("admin", "Admin (Owner)"),
        ("cashier", "Cashier"),
        ("employee", "Employee"),
    ]

    phone = models.CharField(max_length=20, unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="cashier")
    is_onboarded = models.BooleanField(default=False)
    commission_per_order = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    daily_target = models.IntegerField(default=0)

    class Meta:
        db_table = "users"

    def __str__(self):
        return f"{self.get_full_name() or self.username} ({self.get_role_display()})"


class AuditLog(models.Model):
    ACTION_CHOICES = [
        ("order_created", "Order Created"),
        ("order_status_changed", "Order Status Changed"),
        ("payment_received", "Payment Received"),
        ("payment_failed", "Payment Failed"),
        ("customer_created", "Customer Created"),
        ("user_login", "User Login"),
        ("items_counted", "Items Counted"),
        ("items_disputed", "Items Disputed"),
    ]

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=30, choices=ACTION_CHOICES)
    model_name = models.CharField(max_length=50)
    object_id = models.IntegerField()
    description = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "audit_logs"
        ordering = ["-created_at"]
