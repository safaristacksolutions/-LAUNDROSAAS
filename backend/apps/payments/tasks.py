from celery import shared_task
from django_tenants.utils import schema_context


@shared_task(bind=True, max_retries=3, default_retry_delay=120)
def retry_stk_push(self, payment_id):
    from .models import Payment
    from .mpesa import MpesaGateway

    try:
        payment = Payment.objects.select_related("order").get(id=payment_id)
    except Payment.DoesNotExist:
        return

    schema_name = payment.order.tenant.schema_name
    with schema_context(schema_name):
        phone = payment.order.customer.phone
        if not phone.startswith("254"):
            phone = f"254{phone.lstrip('0')}"

        gateway = MpesaGateway()
        account_ref = f"Order-{payment.order.order_number}"
        callback_url = "https://api.laundrosaas.com/api/payments/mpesa/callback/"

        response = gateway.stk_push(
            phone=phone,
            amount=float(payment.amount),
            account_ref=account_ref,
            callback_url=callback_url,
        )

        if response.get("ResponseCode") == "0":
            payment.state = "pending"
            payment.checkout_request_id = response["CheckoutRequestID"]
            payment.save()
        else:
            self.retry()
