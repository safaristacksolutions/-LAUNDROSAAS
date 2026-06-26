from django.urls import path
from . import views

urlpatterns = [
    path("payments/mpesa/stk/", views.InitiateSTKPushView.as_view(), name="mpesa-stk"),
    path("payments/mpesa/callback/", views.MpesaCallbackView.as_view(), name="mpesa-callback"),
    path("payments/mpesa/status/<str:checkout_id>/", views.PaymentStatusView.as_view(), name="mpesa-status"),
]
