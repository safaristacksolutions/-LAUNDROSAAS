from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StockItemViewSet, StockTransactionViewSet

router = DefaultRouter()
router.register(r"stock-items", StockItemViewSet)
router.register(r"stock-transactions", StockTransactionViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
