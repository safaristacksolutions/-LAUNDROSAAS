from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import RentReserve, RentAlert


class RentReserveViewSet(viewsets.ModelViewSet):
    queryset = RentReserve.objects.all()

    def get_queryset(self):
        return RentReserve.objects.filter(tenant=self.request.tenant)

    @action(detail=False, methods=["get"])
    def health(self, request):
        try:
            reserve = RentReserve.objects.get(tenant=request.tenant)
            return Response(reserve.get_health_status())
        except RentReserve.DoesNotExist:
            return Response({
                "status": "not_setup",
                "message": "Configure your rent amount to get started"
            })

    @action(detail=False, methods=["post"])
    def add_to_reserve(self, request):
        amount = request.data.get("amount", 0)
        try:
            reserve = RentReserve.objects.get(tenant=request.tenant)
            reserve.reserve_amount_kes += amount
            reserve.save()
            return Response(reserve.get_health_status())
        except RentReserve.DoesNotExist:
            return Response({"error": "Not set up"}, status=status.HTTP_400_BAD_REQUEST)


class RentAlertViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = RentAlert.objects.all()

    def get_queryset(self):
        return RentAlert.objects.filter(tenant=self.request.tenant)

    @action(detail=True, methods=["post"])
    def mark_read(self, request, pk=None):
        alert = self.get_object()
        alert.is_read = True
        alert.save()
        return Response({"status": "read"})
