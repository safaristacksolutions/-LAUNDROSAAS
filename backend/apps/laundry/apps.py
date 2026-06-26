from django.apps import AppConfig


class LaundryConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.laundry"

    def ready(self):
        import apps.laundry.signals
