from django.db import models
from django.utils import timezone


class RentReserve(models.Model):
    """The Rent Health engine — core value proposition"""
    tenant = models.OneToOneField("tenants.Tenant", on_delete=models.CASCADE)
    monthly_rent_kes = models.DecimalField(max_digits=10, decimal_places=2, default=15000)
    due_day_of_month = models.IntegerField(default=5)

    # Auto-reserve settings
    is_auto_reserve = models.BooleanField(default=True)
    auto_reserve_percent = models.DecimalField(max_digits=5, decimal_places=2, default=30)

    # Current state
    reserve_amount_kes = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    last_reset_at = models.DateTimeField(null=True, blank=True)

    # Projections (updated by nightly Celery task)
    projected_month_end_kes = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    projection_confidence = models.CharField(
        max_length=10,
        choices=[("safe", "Safe"), ("warning", "Warning"), ("critical", "Critical")],
        default="safe"
    )
    last_projected_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "rent_reserves"

    def __str__(self):
        return f"Rent: KES {self.monthly_rent_kes} (Reserve: KES {self.reserve_amount_kes})"

    def get_health_status(self):
        days_until_due = self.due_day_of_month - timezone.now().day
        if days_until_due < 0:
            days_until_due += 30

        reserve_ratio = self.reserve_amount_kes / self.monthly_rent_kes if self.monthly_rent_kes > 0 else 0

        if reserve_ratio >= 1.0:
            status = "paid"
            message = "Rent covered! Extra is yours."
        elif reserve_ratio >= 0.8:
            status = "safe"
            message = f"Almost there. Need KES {self.monthly_rent_kes - self.reserve_amount_kes:,.0f} more."
        elif reserve_ratio >= 0.5:
            status = "warning"
            message = f"Need KES {self.monthly_rent_kes - self.reserve_amount_kes:,.0f} more. {days_until_due} days left."
        else:
            status = "critical"
            message = f"URGENT: Need KES {self.monthly_rent_kes - self.reserve_amount_kes:,.0f} in {days_until_due} days!"

        return {
            "status": status,
            "message": message,
            "reserve_amount": float(self.reserve_amount_kes),
            "monthly_rent": float(self.monthly_rent_kes),
            "days_until_due": days_until_due,
            "projected": float(self.projected_month_end_kes) if self.projected_month_end_kes else None,
            "reserve_percent": int(reserve_ratio * 100),
        }


class RentAlert(models.Model):
    """Log of rent-related notifications sent"""
    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE)
    alert_type = models.CharField(max_length=20, choices=[
        ("rent_due_soon", "Rent Due Soon"),
        ("rent_overdue", "Rent Overdue"),
        ("reserve_low", "Reserve Low"),
        ("reserve_safe", "Reserve Safe"),
        ("projection_critical", "Projection Critical"),
    ])
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "rent_alerts"
        ordering = ["-created_at"]
