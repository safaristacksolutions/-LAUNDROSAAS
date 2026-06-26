from rest_framework import serializers
from .models import Service, Customer, Order, OrderItem, OrderItemCount


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = "__all__"


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = "__all__"


class OrderItemCountSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItemCount
        fields = [
            "shirts", "trousers", "dresses", "bedsheets",
            "jackets", "other", "total_items", "photo",
        ]


class OrderItemSerializer(serializers.ModelSerializer):
    service_name = serializers.CharField(source="service.name", read_only=True)
    service_icon = serializers.CharField(source="service.icon", read_only=True)

    class Meta:
        model = OrderItem
        fields = [
            "id", "service", "service_name", "service_icon",
            "quantity_kg", "quantity_items", "line_total_kes",
        ]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    item_count = OrderItemCountSerializer(read_only=True)
    customer_name = serializers.CharField(source="customer.__str__", read_only=True)
    created_by_name = serializers.CharField(source="created_by.get_full_name", read_only=True)

    class Meta:
        model = Order
        fields = [
            "id", "order_number", "customer", "customer_name",
            "created_by", "created_by_name",
            "status", "subtotal_kes", "vat_kes", "total_kes",
            "payment_method", "expected_ready_at", "picked_up_at",
            "delivery_notes", "is_paid",
            "items", "item_count",
            "created_at", "updated_at",
        ]
        read_only_fields = ["order_number", "created_at", "updated_at"]


class CreateOrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    item_count = OrderItemCountSerializer(required=False)

    class Meta:
        model = Order
        fields = [
            "customer", "items", "item_count",
            "payment_method", "expected_ready_at",
            "delivery_notes",
        ]

    def create(self, validated_data):
        items_data = validated_data.pop("items")
        item_count_data = validated_data.pop("item_count", None)
        order = Order.objects.create(**validated_data)
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        if item_count_data:
            OrderItemCount.objects.create(order=order, **item_count_data)
        return order
