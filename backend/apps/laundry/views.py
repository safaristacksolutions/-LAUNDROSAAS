from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Count
from django.utils import timezone
from datetime import timedelta
from .models import Service, Customer, Order
from .serializers import (
    ServiceSerializer, CustomerSerializer,
    OrderSerializer, CreateOrderSerializer
)


class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.filter(is_active=True)
    serializer_class = ServiceSerializer


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    search_fields = ["phone", "first_name", "last_name"]

    @action(detail=False, methods=["get"])
    def search(self, request):
        phone = request.query_params.get("phone", "")
        if len(phone) >= 3:
            customers = Customer.objects.filter(phone__contains=phone)[:5]
            serializer = self.get_serializer(customers, many=True)
            return Response(serializer.data)
        return Response([])


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    filterset_fields = ["status", "payment_method", "is_paid"]

    def get_serializer_class(self):
        if self.action == "create":
            return CreateOrderSerializer
        return OrderSerializer

    def perform_create(self, serializer):
        from django_tenants.utils import schema_context
        from apps.tenants.models import Tenant

        tenant = Tenant.objects.get(schema_name=self.request.tenant.schema_name)
        with schema_context(tenant.schema_name):
            last_order = Order.objects.using(tenant.schema_name).order_by("-id").first()
            last_num = 0
            if last_order and last_order.order_number:
                try:
                    last_num = int(last_order.order_number.split("-")[-1])
                except (ValueError, IndexError):
                    pass
            order_number = f"LND-{timezone.now().strftime('%y%m')}-{str(last_num + 1).zfill(4)}"

        serializer.save(
            created_by=self.request.user,
            order_number=order_number
        )

    @action(detail=False, methods=["get"])
    def dashboard(self, request):
        today = timezone.now().date()
        orders_today = Order.objects.filter(created_at__date=today)
        total_revenue = orders_today.aggregate(total=Sum("total_kes"))["total"] or 0
        cash = orders_today.filter(payment_method="cash").aggregate(t=Sum("total_kes"))["t"] or 0
        mpesa = orders_today.filter(payment_method="mpesa").aggregate(t=Sum("total_kes"))["t"] or 0
        overdue = Order.objects.filter(
            status="ready",
            updated_at__lt=timezone.now() - timedelta(hours=24)
        ).count()
        pending_payment = Order.objects.filter(status="pending").count()

        return Response({
            "orders_today": orders_today.count(),
            "total_revenue": total_revenue,
            "cash": cash,
            "mpesa": mpesa,
            "overdue_pickups": overdue,
            "pending_payments": pending_payment,
        })

    @action(detail=True, methods=["post"])
    def update_status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get("status")
        if new_status in dict(Order.STATUS_CHOICES):
            order.status = new_status
            if new_status == "delivered":
                order.picked_up_at = timezone.now()
            order.save()
            return Response({"status": new_status})
        return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)
