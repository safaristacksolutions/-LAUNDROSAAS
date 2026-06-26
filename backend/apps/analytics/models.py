from django.db import models


class ChurnPrediction(models.Model):
    """ML model output: which tenants are likely to churn"""
    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE)
    risk_score = models.FloatField()  # 0.0 (safe) to 1.0 (will churn)
    risk_level = models.CharField(max_length=15, choices=[
        ("healthy", "Healthy"),
        ("at_risk", "At Risk"),
        ("critical", "Critical"),
    ])
    reason = models.TextField(blank=True)
    days_since_login = models.IntegerField(default=0)
    orders_last_7_days = models.IntegerField(default=0)
    payment_failures = models.IntegerField(default=0)
    predicted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "churn_predictions"


class RevenueForecast(models.Model):
    """ML forecast output for tenant revenue"""
    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE)
    forecast_date = models.DateField()
    predicted_revenue_kes = models.DecimalField(max_digits=12, decimal_places=2)
    confidence_lower = models.DecimalField(max_digits=12, decimal_places=2)
    confidence_upper = models.DecimalField(max_digits=12, decimal_places=2)
    model_used = models.CharField(max_length=50, default="moving_average")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "revenue_forecasts"
