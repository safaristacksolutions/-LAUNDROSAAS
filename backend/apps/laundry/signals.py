from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models import Order


@receiver(pre_save, sender=Order)
def track_previous_status(sender, instance, **kwargs):
    if instance.pk:
        try:
            instance._previous_status = Order.objects.get(pk=instance.pk).status
        except Order.DoesNotExist:
            instance._previous_status = None
    else:
        instance._previous_status = None


@receiver(post_save, sender=Order)
def handle_order_status_change(sender, instance, created, **kwargs):
    if not created and hasattr(instance, '_previous_status'):
        if instance._previous_status != instance.status:
            from apps.notifications.tasks import send_order_status_notification
            send_order_status_notification.delay(instance.id, instance.status)
