from django.db import models
from django.conf import settings


class Payment(models.Model):
    METHOD_CHOICES = [
        ("cash", "Cash"),
        ("mpesa", "M-Pesa"),
        ("stripe", "Stripe"),
    ]
    STATE_CHOICES = [
        ("initiated", "STK Push Initiated"),
        ("pending", "Awaiting Customer"),
        ("processing", "Callback Received"),
        ("completed", "Payment Successful"),
        ("failed", "Failed / Cancelled"),
        ("refunded", "Refunded"),
    ]

    order = models.OneToOneField("laundry.Order", on_delete=models.CASCADE)
    method = models.CharField(max_length=10, choices=METHOD_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    state = models.CharField(max_length=15, choices=STATE_CHOICES, default="initiated")
    checkout_request_id = models.CharField(max_length=100, blank=True)
    mpesa_receipt = models.CharField(max_length=50, blank=True)
    retry_count = models.IntegerField(default=0)
    max_retries = models.IntegerField(default=2)
    last_retry_at = models.DateTimeField(null=True, blank=True)
    rent_reserve_deducted = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    paid_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "payments"

    def __str__(self):
        return f"{self.get_method_display()} {self.amount} ({self.get_state_display()})"

    def reconcile(self, mpesa_receipt, amount):
        if self.state == "completed":
            return

        self.mpesa_receipt = mpesa_receipt
        self.state = "completed"
        self.paid_at = models.DateTimeField(auto_now_add=True)

        from apps.rent.models import RentReserve
        try:
            reserve = RentReserve.objects.get(tenant=self.order.tenant)
            if reserve.is_auto_reserve:
                deduction = self.amount * (reserve.auto_reserve_percent / 100)
                remaining = reserve.monthly_rent_kes - reserve.reserve_amount_kes
                self.rent_reserve_deducted = min(deduction, remaining)
                reserve.reserve_amount_kes += self.rent_reserve_deducted
                reserve.save()
        except RentReserve.DoesNotExist:
            pass

        self.save()
        self.order.is_paid = True
        if self.order.status == "pending":
            self.order.status = "received"
        self.order.save()


class PaymentLog(models.Model):
    """Raw M-Pesa callback log for debugging"""
    payment = models.ForeignKey(Payment, on_delete=models.CASCADE, null=True)
    raw_callback = models.JSONField()
    result_code = models.IntegerField(null=True)
    result_desc = models.TextField(blank=True)
    status = models.CharField(max_length=15, choices=[
        ("received", "Received"),
        ("processed", "Processed"),
        ("orphaned", "Orphaned"),
        ("reconciled", "Reconciled"),
    ], default="received")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "payment_logs"
