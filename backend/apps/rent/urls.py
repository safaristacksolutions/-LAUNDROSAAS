from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RentReserveViewSet, RentAlertViewSet

router = DefaultRouter()
router.register(r"rent/reserve", RentReserveViewSet, basename="rent-reserve")
router.register(r"rent/alerts", RentAlertViewSet, basename="rent-alerts")

urlpatterns = [
    path("", include(router.urls)),
]
