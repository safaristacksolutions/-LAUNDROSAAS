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

        now = timezone.now()
        is_trial_expired = tenant.trial_ends_at and now > tenant.trial_ends_at
        is_sub_expired = tenant.subscription_starts_at and (now - tenant.subscription_starts_at).days > 30

        if not tenant.is_active or (is_trial_expired and is_sub_expired):
            return JsonResponse(
                {"error": "Subscription expired. Please renew to continue.", "code": "subscription_expired"},
                status=402,
            )

        return self.get_response(request)
