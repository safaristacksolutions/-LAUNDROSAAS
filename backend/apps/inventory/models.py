from django.db import models


class StockItem(models.Model):
    CATEGORIES = [
        ("detergent", "Detergent"),
        ("softener", "Fabric Softener"),
        ("bleach", "Bleach / Stain Remover"),
        ("packaging", "Packaging"),
        ("supplies", "General Supplies"),
    ]
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CATEGORIES)
    sku = models.CharField(max_length=30, unique=True, blank=True)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    unit = models.CharField(max_length=20, default="pcs")
    reorder_level = models.DecimalField(max_digits=10, decimal_places=2, default=10)
    unit_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "stock_items"
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} ({self.quantity} {self.unit})"


class StockTransaction(models.Model):
    TYPES = [("in", "Stock In"), ("out", "Stock Out"), ("adjustment", "Adjustment")]
    item = models.ForeignKey(StockItem, related_name="transactions", on_delete=models.CASCADE)
    transaction_type = models.CharField(max_length=20, choices=TYPES)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    balance_before = models.DecimalField(max_digits=10, decimal_places=2)
    balance_after = models.DecimalField(max_digits=10, decimal_places=2)
    reference = models.CharField(max_length=50, blank=True)
    notes = models.TextField(blank=True)
    created_by = models.ForeignKey("accounts.User", on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "stock_transactions"
        ordering = ["-created_at"]
