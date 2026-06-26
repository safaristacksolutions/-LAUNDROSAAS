import requests
from celery import shared_task
from django_tenants.utils import schema_context
from django.conf import settings
from django.utils import timezone
from datetime import timedelta


def send_sms(phone, message, sender_id=None):
    """Send SMS via Africa's Talking API"""
    username = settings.AT_USERNAME
    api_key = settings.AT_API_KEY

    if not api_key or api_key == "":
        return {"status": "skipped", "message": "No API key configured"}

    url = "https://api.africastalking.com/version1/messaging"
    headers = {"ApiKey": api_key, "Accept": "application/json"}
    data = {
        "username": username,
        "to": phone,
        "message": message,
        "from": sender_id or settings.AT_SENDER_ID or "LaundroSaaS",
    }

    response = requests.post(url, headers=headers, data=data)
    return response.json()


@shared_task
def send_order_status_notification(order_id, new_status):
    """Called when order status changes"""
    from apps.laundry.models import Order
    from apps.notifications.models import NotificationTemplate, NotificationLog
    from apps.tenants.models import Tenant

    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return

    tenant = Tenant.objects.get(schema_name=order.tenant.schema_name)

    with schema_context(tenant.schema_name):
        trigger_map = {
            "received": "order_received",
            "washing": "status_washing",
            "drying": "status_drying",
            "ironing": "status_ironing",
            "ready": "order_ready",
        }
        trigger = trigger_map.get(new_status)
        if not trigger:
            return

        template = NotificationTemplate.objects.filter(
            trigger=trigger, is_active=True
        ).first()
        if not template:
            return

        message = template.template_text.format(
            customer_name=order.customer.first_name or "Customer",
            order_number=order.order_number,
            status=order.get_status_display(),
            total=order.total_kes,
            shop_name=tenant.name,
        )

        phone = order.customer.phone
        if not phone.startswith("+"):
            phone = f"+254{phone.lstrip('0')}"

        response = send_sms(phone, message, tenant.at_sender_id or None)

        NotificationLog.objects.create(
            tenant=tenant,
            customer=order.customer,
            order=order,
            template=template,
            channel="sms",
            recipient=phone,
            message=message,
            status="sent",
            cost_kes=0.80,
            provider_response=response,
        )


@shared_task
def check_overdue_pickups():
    """Hourly check for overdue orders"""
    from apps.laundry.models import Order
    from apps.tenants.models import Tenant
    from apps.notifications.models import NotificationTemplate, NotificationLog

    for tenant in Tenant.objects.filter(is_active=True):
        with schema_context(tenant.schema_name):
            cutoff_24h = timezone.now() - timedelta(hours=24)
            cutoff_48h = timezone.now() - timedelta(hours=48)

            overdue_24h = Order.objects.filter(
                status="ready",
                updated_at__lte=cutoff_24h,
                updated_at__gt=cutoff_48h,
            )

            for order in overdue_24h:
                phone = f"+254{order.customer.phone.lstrip('0')}"
                message = (
                    f"⏰ Reminder: Order #{order.order_number} ready "
                    f"since yesterday. Storage fee KES 50/day after 48hrs."
                )
                send_sms(phone, message)
                NotificationLog.objects.create(
                    tenant=tenant,
                    customer=order.customer,
                    order=order,
                    channel="sms",
                    recipient=phone,
                    message=message,
                    status="sent",
                    cost_kes=0.80,
                )


@shared_task
def send_rent_reminders():
    """Daily check: send rent reminders to shop owners"""
    from apps.tenants.models import Tenant
    from apps.rent.models import RentReserve
    from apps.notifications.models import NotificationTemplate, NotificationLog

    for tenant in Tenant.objects.filter(is_active=True):
        with schema_context(tenant.schema_name):
            try:
                reserve = RentReserve.objects.get(tenant=tenant)
            except RentReserve.DoesNotExist:
                continue

            days_until_due = reserve.due_day_of_month - timezone.now().day
            if days_until_due < 0:
                days_until_due += 30

            if days_until_due not in [7, 3, 1, 0]:
                continue

            ratio = reserve.reserve_amount_kes / reserve.monthly_rent_kes
            phone = f"+254{tenant.phone.lstrip('0')}"

            if ratio >= 1:
                message = f"✅ Rent covered! Reserve: KES {reserve.reserve_amount_kes:,.0f}"
            elif ratio >= 0.8:
                message = (
                    f"⚠️ Almost there. Reserve: KES {reserve.reserve_amount_kes:,.0f} / "
                    f"KES {reserve.monthly_rent_kes:,.0f}. "
                    f"Need KES {reserve.monthly_rent_kes - reserve.reserve_amount_kes:,.0f} more."
                )
            else:
                message = (
                    f"🔴 URGENT: Reserve: KES {reserve.reserve_amount_kes:,.0f} / "
                    f"KES {reserve.monthly_rent_kes:,.0f}. "
                    f"{days_until_due} days until due!"
                )

            send_sms(phone, message)
