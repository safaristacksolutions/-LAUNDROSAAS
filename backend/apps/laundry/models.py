from django.db import models
from django.conf import settings
from django.utils import timezone


class Service(models.Model):
    UNIT_CHOICES = [
        ("kg", "Per Kilogram"),
        ("item", "Per Item"),
    ]

    name = models.CharField(max_length=100)
    icon = models.CharField(max_length=10, default="🧺")  # Emoji icon
    price_kes = models.DecimalField(max_digits=8, decimal_places=2)
    unit = models.CharField(max_length=10, choices=UNIT_CHOICES, default="kg")
    is_active = models.BooleanField(default=True)
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "services"
        ordering = ["sort_order"]

    def __str__(self):
        return f"{self.icon} {self.name} (KES {self.price_kes}/{self.unit})"


class Customer(models.Model):
    phone = models.CharField(max_length=20, unique=True)
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    email = models.EmailField(blank=True)
    total_orders = models.IntegerField(default=0)
    total_spent_kes = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    last_order_at = models.DateTimeField(null=True, blank=True)
    is_loyalty = models.BooleanField(default=False)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "customers"
        ordering = ["-last_order_at"]

    def __str__(self):
        name = f"{self.first_name} {self.last_name}".strip()
        return f"{name or 'Unknown'} ({self.phone})"


class Order(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending Payment"),
        ("received", "Received"),
        ("washing", "Washing"),
        ("drying", "Drying"),
        ("ironing", "Ironing"),
        ("ready", "Ready for Pickup"),
        ("delivered", "Delivered"),
        ("cancelled", "Cancelled"),
    ]

    order_number = models.CharField(max_length=20, unique=True)
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT,
        related_name="orders_created"
    )
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default="pending")
    subtotal_kes = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    vat_kes = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_kes = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    payment_method = models.CharField(max_length=10, choices=[
        ("cash", "Cash"),
        ("mpesa", "M-Pesa"),
        ("card", "Card"),
    ], default="mpesa")
    expected_ready_at = models.DateTimeField()
    picked_up_at = models.DateTimeField(null=True, blank=True)
    delivery_notes = models.TextField(blank=True)
    is_paid = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "orders"
        ordering = ["-created_at"]

    def __str__(self):
        return f"#{self.order_number} - {self.customer}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    service = models.ForeignKey(Service, on_delete=models.PROTECT)
    quantity_kg = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    quantity_items = models.IntegerField(null=True, blank=True)
    line_total_kes = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = "order_items"

    def __str__(self):
        return f"{self.service.name} x {self.quantity_kg or self.quantity_items}"


class OrderItemCount(models.Model):
    """Quick item count for dispute prevention"""
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name="item_count")
    shirts = models.IntegerField(default=0)
    trousers = models.IntegerField(default=0)
    dresses = models.IntegerField(default=0)
    bedsheets = models.IntegerField(default=0)
    jackets = models.IntegerField(default=0)
    other = models.IntegerField(default=0)
    total_items = models.IntegerField(default=0)
    photo = models.ImageField(upload_to="item_counts/%Y/%m/", null=True, blank=True)
    counted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True
    )
    customer_confirmed = models.BooleanField(default=False)
    confirmed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "order_item_counts"

    def save(self, *args, **kwargs):
        self.total_items = (
            self.shirts + self.trousers + self.dresses +
            self.bedsheets + self.jackets + self.other
        )
        super().save(*args, **kwargs)


class Branch(models.Model):
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    address = models.TextField(blank=True)
    is_primary = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "branches"

    def __str__(self):
        return self.name
