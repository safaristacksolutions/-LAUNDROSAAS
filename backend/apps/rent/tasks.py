from celery import shared_task
from django_tenants.utils import schema_context
from django.utils import timezone
from django.db.models import Sum
from datetime import timedelta


@shared_task
def update_rent_projections():
    """Nightly: update rent projections for all tenants"""
    from apps.tenants.models import Tenant
    from apps.rent.models import RentReserve, RentAlert

    for tenant in Tenant.objects.filter(is_active=True):
        with schema_context(tenant.schema_name):
            try:
                reserve = RentReserve.objects.get(tenant=tenant)
            except RentReserve.DoesNotExist:
                continue

            # Simple 14-day moving average projection
            from apps.laundry.models import Order
            from apps.payments.models import Payment

            last_30_days = timezone.now() - timedelta(days=30)
            payments = Payment.objects.filter(
                state="completed",
                paid_at__gte=last_30_days
            ).aggregate(total=Sum("amount"))["total"] or 0

            daily_avg = payments / 30
            days_until_end = reserve.due_day_of_month - timezone.now().day
            if days_until_end < 0:
                days_until_end += 30

            projected = reserve.reserve_amount_kes + (daily_avg * days_until_end)
            reserve.projected_month_end_kes = projected

            ratio = projected / reserve.monthly_rent_kes if reserve.monthly_rent_kes > 0 else 0
            if ratio >= 1.2:
                reserve.projection_confidence = "safe"
            elif ratio >= 0.9:
                reserve.projection_confidence = "warning"
            else:
                reserve.projection_confidence = "critical"

            reserve.last_projected_at = timezone.now()
            reserve.save()

            if reserve.projection_confidence == "critical":
                RentAlert.objects.create(
                    tenant=tenant,
                    alert_type="projection_critical",
                    message=(
                        f"Rent projection is CRITICAL. "
                        f"Projected: KES {projected:,.0f} vs "
                        f"Rent: KES {reserve.monthly_rent_kes:,.0f}"
                    ),
                )
