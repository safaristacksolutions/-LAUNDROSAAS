from django.db import models


class Subscription(models.Model):
    STATUS_CHOICES = [
        ("active", "Active"),
        ("past_due", "Past Due"),
        ("cancelled", "Cancelled"),
        ("trial", "Trial"),
    ]

    tenant = models.OneToOneField("tenants.Tenant", on_delete=models.CASCADE)
    plan = models.ForeignKey("tenants.Plan", on_delete=models.PROTECT)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default="trial")
    mpesa_phone = models.CharField(max_length=20, blank=True)
    auto_debit = models.BooleanField(default=False)
    current_period_starts_at = models.DateTimeField(auto_now_add=True)
    current_period_ends_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "subscriptions"

    def __str__(self):
        return f"{self.tenant.name} - {self.plan.name}"


class Invoice(models.Model):
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE)
    amount_kes = models.DecimalField(max_digits=10, decimal_places=2)
    mpesa_receipt = models.CharField(max_length=50, blank=True)
    status = models.CharField(max_length=15, choices=[
        ("pending", "Pending"),
        ("paid", "Paid"),
        ("failed", "Failed"),
        ("refunded", "Refunded"),
    ], default="pending")
    period_start = models.DateTimeField()
    period_end = models.DateTimeField()
    paid_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "invoices"


class TransactionFeeLedger(models.Model):
    """Records the 1.5% fee earned per M-Pesa transaction"""
    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE)
    payment_id = models.IntegerField()
    order_amount_kes = models.DecimalField(max_digits=10, decimal_places=2)
    fee_percent = models.DecimalField(max_digits=4, decimal_places=2)
    fee_kes = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "transaction_fees"


class SMSCreditLedger(models.Model):
    """Tracks SMS overage billing for Starter plan tenants"""
    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE)
    total_sent = models.IntegerField(default=0)
    included = models.IntegerField(default=0)
    overage = models.IntegerField(default=0)
    cost_per_sms = models.DecimalField(max_digits=4, decimal_places=2, default=1.20)
    total_charged = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    month = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "sms_credits"
        unique_together = ["tenant", "month"]
