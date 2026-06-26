import json
from rest_framework import views, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Payment, PaymentLog
from .mpesa import MpesaGateway


class InitiateSTKPushView(views.APIView):
    def post(self, request):
        order_id = request.data.get("order_id")
        phone = request.data.get("phone")

        from apps.laundry.models import Order
        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

        payment, created = Payment.objects.get_or_create(
            order=order,
            defaults={
                "method": "mpesa",
                "amount": order.total_kes,
                "state": "initiated",
            }
        )

        if not created and payment.state == "completed":
            return Response({"error": "Already paid"}, status=status.HTTP_400_BAD_REQUEST)

        gateway = MpesaGateway()
        account_ref = f"Order-{order.order_number}"
        callback_url = request.build_absolute_uri("/api/payments/mpesa/callback/")

        response = gateway.stk_push(
            phone=phone,
            amount=float(order.total_kes),
            account_ref=account_ref,
            callback_url=callback_url,
        )

        if response.get("ResponseCode") == "0":
            payment.state = "pending"
            payment.checkout_request_id = response["CheckoutRequestID"]
            payment.save()
            return Response({
                "status": "pending",
                "checkout_request_id": response["CheckoutRequestID"],
                "merchant_request_id": response.get("MerchantRequestID"),
            })
        else:
            payment.state = "failed"
            payment.save()
            return Response({
                "error": response.get("errorMessage", "STK Push failed"),
            }, status=status.HTTP_400_BAD_REQUEST)


class MpesaCallbackView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        result = request.data.get("Body", {}).get("stkCallback", {})
        result_code = result.get("ResultCode")
        result_desc = result.get("ResultDesc", "")

        # Find payment by checkout_request_id
        checkout_id = result.get("CheckoutRequestID")
        try:
            payment = Payment.objects.get(checkout_request_id=checkout_id)
        except Payment.DoesNotExist:
            PaymentLog.objects.create(
                raw_callback=request.data,
                result_code=result_code,
                result_desc=result_desc,
                status="orphaned",
            )
            return Response({"ResultCode": 0, "ResultDesc": "Accepted"})

        PaymentLog.objects.create(
            payment=payment,
            raw_callback=request.data,
            result_code=result_code,
            result_desc=result_desc,
            status="received",
        )

        if result_code == 0:
            meta = {}
            for item in result.get("CallbackMetadata", {}).get("Item", []):
                meta[item["Name"]] = item["Value"]

            payment.reconcile(
                mpesa_receipt=meta.get("MpesaReceiptNumber", ""),
                amount=meta.get("Amount", payment.amount),
            )
        else:
            payment.state = "failed"
            payment.save()

            if payment.retry_count < payment.max_retries:
                payment.retry_count += 1
                payment.state = "initiated"
                payment.save()

                from apps.payments.tasks import retry_stk_push
                retry_stk_push.delay(payment.id)

        return Response({"ResultCode": 0, "ResultDesc": "Accepted"})


class PaymentStatusView(views.APIView):
    def get(self, request, checkout_id):
        try:
            payment = Payment.objects.get(checkout_request_id=checkout_id)
            return Response({
                "state": payment.state,
                "amount": payment.amount,
                "mpesa_receipt": payment.mpesa_receipt,
            })
        except Payment.DoesNotExist:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)
