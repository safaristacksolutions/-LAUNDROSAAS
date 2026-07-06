from django.http import JsonResponse
from django.utils import timezone
from django.urls import resolve


class PlanEnforcementMiddleware:
    """Block tenant requests when plan is expired or over limits"""

    EXEMPT_URLS = [
        "/api/auth/",
        "/api/tenant-config/",
        "/api/billing/",
        "/admin/",
    ]

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if not hasattr(request, "tenant") or not request.tenant:
            return self.get_response(request)

        path = request.path_info
        if any(path.startswith(ex) for ex in self.EXEMPT_URLS):
            return self.get_response(request)

        tenant = request.tenant
        if tenant.subscription_status == "expired":
            return JsonResponse(
                {"error": "Subscription expired", "code": "subscription_expired"},
                status=402,
            )

        if tenant.subscription_status == "past_due":
            from .models import Subscription
            sub = Subscription.objects.filter(tenant=tenant, status="active").first()
            if sub and (timezone.now() - sub.renewed_at).days > 3:
                return JsonResponse(
                    {"error": "Payment overdue. Please update billing details.", "code": "payment_past_due"},
                    status=402,
                )

        return self.get_response(request)
