from django.db import models
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import StockItem, StockTransaction
from .serializers import StockItemSerializer, StockTransactionSerializer


class StockItemViewSet(viewsets.ModelViewSet):
    queryset = StockItem.objects.all()
    serializer_class = StockItemSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["category", "is_active"]
    search_fields = ["name", "sku"]

    @action(detail=False, methods=["get"])
    def low_stock(self, request):
        items = StockItem.objects.filter(quantity__lte=models.F("reorder_level"), is_active=True)
        serializer = self.get_serializer(items, many=True)
        return Response(serializer.data)


class StockTransactionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = StockTransaction.objects.all()
    serializer_class = StockTransactionSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["transaction_type", "item"]
    ordering = ["-created_at"]
