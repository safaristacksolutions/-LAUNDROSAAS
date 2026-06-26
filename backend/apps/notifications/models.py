from django.db import models


class NotificationTemplate(models.Model):
    TRIGGER_CHOICES = [
        ("order_received", "Order Received"),
        ("status_washing", "Status: Washing"),
        ("status_drying", "Status: Drying"),
        ("status_ironing", "Status: Ironing"),
        ("order_ready", "Order Ready for Pickup"),
        ("pickup_reminder_24h", "Pickup Reminder (24h overdue)"),
        ("pickup_reminder_48h", "Pickup Reminder (48h overdue)"),
        ("payment_received", "Payment Received"),
        ("payment_failed", "Payment Failed - Retry"),
        ("rent_due_7d", "Rent Due in 7 Days"),
        ("rent_due_today", "Rent Due Today"),
    ]

    trigger = models.CharField(max_length=30, choices=TRIGGER_CHOICES)
    channel = models.CharField(max_length=10, choices=[
        ("sms", "SMS"),
        ("whatsapp", "WhatsApp"),
    ], default="sms")
    template_text = models.TextField(
        help_text="Use {{customer_name}}, {{order_number}}, {{status}}, "
                  "{{total}}, {{shop_name}} as placeholders"
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "notification_templates"
        unique_together = ["trigger", "channel"]

    def __str__(self):
        return f"{self.get_trigger_display()} ({self.channel})"


class NotificationLog(models.Model):
    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE)
    customer = models.ForeignKey("laundry.Customer", on_delete=models.CASCADE, null=True)
    order = models.ForeignKey("laundry.Order", on_delete=models.CASCADE, null=True, blank=True)
    template = models.ForeignKey(NotificationTemplate, on_delete=models.SET_NULL, null=True)
    channel = models.CharField(max_length=10)
    recipient = models.CharField(max_length=100)
    message = models.TextField()
    status = models.CharField(max_length=10, choices=[
        ("pending", "Pending"),
        ("sent", "Sent"),
        ("delivered", "Delivered"),
        ("failed", "Failed"),
    ], default="pending")
    cost_kes = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    provider_response = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "notification_logs"
        ordering = ["-created_at"]
