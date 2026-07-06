from django.urls import path
from .views import AnalyticsViewSet

analytics = AnalyticsViewSet.as_view({
    "get": "churn",
})

urlpatterns = [
    path("analytics/churn/", analytics, name="analytics-churn"),
    path("analytics/forecast/", AnalyticsViewSet.as_view({"get": "forecast"}), name="analytics-forecast"),
    path("analytics/peak-hours/", AnalyticsViewSet.as_view({"get": "peak_hours"}), name="analytics-peak-hours"),
    path("analytics/service-demand/", AnalyticsViewSet.as_view({"get": "service_demand"}), name="analytics-service-demand"),
]
