from django.urls import path, include

urlpatterns = [
    path("api/tenants/", include("apps.tenants.urls")),
    path("api/billing/", include("apps.billing.urls")),
]
