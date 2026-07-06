from django.core.management.base import BaseCommand
from django_tenants.utils import schema_context
from django.utils import timezone
from datetime import timedelta


class Command(BaseCommand):
    help = "Seed database with initial data"

    def add_arguments(self, parser):
        parser.add_argument("--show", action="store_true", help="Show generated credentials")

    def handle(self, *args, **options):
        from apps.tenants.models import Plan, Tenant, Domain
        from apps.accounts.models import User
        from apps.laundry.models import Service, Customer, Order, OrderItem
        from apps.payments.models import Payment
        from apps.rent.models import RentReserve
        from apps.notifications.models import NotificationTemplate

        show = options["show"]

        Plan.objects.get_or_create(code="starter", defaults={"name": "Starter", "price_kes": 1999, "max_users": 1, "max_orders_monthly": 300})
        Plan.objects.get_or_create(code="pro", defaults={"name": "Pro", "price_kes": 4999, "max_users": 3, "has_sms": True, "sms_included": 500, "has_rent_health": True, "has_analytics": True})
        self.stdout.write(self.style.SUCCESS("✓ Plans created"))

        from django.conf import settings
        admin_phone = settings.SEED_ADMIN_PHONE or "0712345678"
        cashier_phone = settings.SEED_CASHIER_PHONE or "0712000001"
        emp_phone = settings.SEED_EMPLOYEE_PHONE or "0712000002"
        admin_pw = settings.SEED_ADMIN_PASSWORD or "admin123"
        cashier_pw = settings.SEED_CASHIER_PASSWORD or "cashier123"
        emp_pw = settings.SEED_EMPLOYEE_PASSWORD or "emp123"

        tenant, _ = Tenant.objects.get_or_create(
            schema_name="freshwash",
            defaults={"name": "FreshWash Laundry", "phone": admin_phone, "plan_id": Plan.objects.filter(code="pro").first().id if Plan.objects.filter(code="pro").exists() else None, "is_active": True, "trial_ends_at": timezone.now() + timedelta(days=7)}
        )
        Domain.objects.get_or_create(domain="freshwash.localhost", defaults={"tenant": tenant, "is_primary": True})
        self.stdout.write(self.style.SUCCESS("✓ Tenant created"))

        with schema_context("freshwash"):
            if not User.objects.filter(phone=admin_phone).exists():
                User.objects.create_superuser(username=admin_phone, phone=admin_phone, first_name="Admin", role="admin", password=admin_pw)
            if not User.objects.filter(phone=cashier_phone).exists():
                User.objects.create_user(username=cashier_phone, phone=cashier_phone, first_name="Cashier", role="cashier", password=cashier_pw)
            if not User.objects.filter(phone=emp_phone).exists():
                User.objects.create_user(username=emp_phone, phone=emp_phone, first_name="Employee", role="employee", password=emp_pw)

            services_data = [
                ("Wash", "https://img.icons8.com/fluency/48/washing-machine.png", "50", "kg", 1),
                ("Iron", "https://img.icons8.com/fluency/48/iron.png", "30", "item", 2),
                ("Fold", "https://img.icons8.com/fluency/48/fold.png", "20", "item", 3),
                ("Dry", "https://img.icons8.com/fluency/48/dry.png", "80", "item", 4),
                ("Dry Clean", "https://img.icons8.com/fluency/48/dry-clean.png", "150", "item", 5),
            ]
            for name, icon, price, unit, sort in services_data:
                Service.objects.get_or_create(name=name, defaults={"icon": icon, "price_kes": price, "unit": unit, "sort_order": sort})

            templates = [
                ("order_received", "Hi {{customer_name}}, order #{{order_number}} received. KES {{total}}."),
                ("order_ready", "Order #{{order_number}} is READY! Pick up at {{shop_name}}. Total: KES {{total}}"),
                ("pickup_reminder_24h", "Reminder: Order #{{order_number}} ready since yesterday."),
                ("payment_received", "Payment received for order #{{order_number}}. KES {{total}}."),
            ]
            for trigger, text in templates:
                NotificationTemplate.objects.get_or_create(trigger=trigger, channel="sms", defaults={"template_text": text})

            RentReserve.objects.get_or_create(tenant=tenant, defaults={"monthly_rent_kes": 15000, "due_day_of_month": 5, "reserve_amount_kes": 0})

            for phone, first, last in [("0712345679", "Wanjiku", "Mwangi"), ("0723456789", "James", "Ochieng")]:
                Customer.objects.get_or_create(phone=phone, defaults={"first_name": first, "last_name": last})

        if show:
            self.stdout.write(f"  Admin:    {admin_phone} / {admin_pw}")
            self.stdout.write(f"  Cashier:  {cashier_phone} / {cashier_pw}")
            self.stdout.write(f"  Employee: {emp_phone} / {emp_pw}")

        self.stdout.write(self.style.SUCCESS("\nDone"))
