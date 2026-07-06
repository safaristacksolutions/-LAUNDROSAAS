from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import timedelta
from collections import Counter
from .models import ChurnPrediction, RevenueForecast
from .serializers import ChurnPredictionSerializer, RevenueForecastSerializer


class AnalyticsViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=["get"])
    def churn(self, request):
        """Get latest churn prediction for current tenant"""
        from apps.tenants.models import Tenant
        tenant = Tenant.objects.filter(schema_name=request.tenant.schema_name).first()
        if not tenant:
            return Response({"error": "No tenant found"}, status=404)
        pred = ChurnPrediction.objects.filter(tenant=tenant).order_by("-predicted_at").first()
        if not pred:
            return Response({"risk": "unknown"})
        return Response(ChurnPredictionSerializer(pred).data)

    @action(detail=False, methods=["get"])
    def forecast(self, request):
        """Get revenue forecast for current tenant"""
        from apps.tenants.models import Tenant
        tenant = Tenant.objects.filter(schema_name=request.tenant.schema_name).first()
        if not tenant:
            return Response({"error": "No tenant found"}, status=404)
        forecasts = RevenueForecast.objects.filter(tenant=tenant).order_by("forecast_date")[:30]
        return Response(RevenueForecastSerializer(forecasts, many=True).data)

    @action(detail=False, methods=["get"])
    def peak_hours(self, request):
        """Return order volume by hour of day for current week"""
        from apps.laundry.models import Order
        week_ago = timezone.now() - timedelta(days=7)
        orders = Order.objects.filter(created_at__gte=week_ago)
        hours = [o.created_at.hour for o in orders]
        distribution = dict(Counter(hours))
        return Response(distribution)

    @action(detail=False, methods=["get"])
    def service_demand(self, request):
        """Return service demand prediction for next day"""
        from apps.laundry.models import OrderItem, Service
        from django.db.models import Count
        week_ago = timezone.now() - timedelta(days=7)
        top_services = (
            OrderItem.objects.filter(order__created_at__gte=week_ago)
            .values("service__name")
            .annotate(count=Count("id"))
            .order_by("-count")[:5]
        )
        return Response(list(top_services))
