from rest_framework import serializers
from .models import StockItem, StockTransaction


class StockItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockItem
        fields = "__all__"


class StockTransactionSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source="item.name", read_only=True)

    class Meta:
        model = StockTransaction
        fields = "__all__"
