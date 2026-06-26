from django.core.management.base import BaseCommand
from django_tenants.utils import schema_context
from django.utils import timezone
from datetime import timedelta


class Command(BaseCommand):
    help = "Seed database with demo data"

    def handle(self, *args, **options):
        from apps.tenants.models import Plan, Tenant, Domain
        from apps.accounts.models import User
        from apps.laundry.models import Service, Customer, Order, OrderItem
        from apps.payments.models import Payment
        from apps.rent.models import RentReserve
        from apps.notifications.models import NotificationTemplate

        # Create Plans
        starter, _ = Plan.objects.get_or_create(
            code="starter",
            defaults={
                "name": "Starter",
                "price_kes": 1999,
                "max_users": 1,
                "max_orders_monthly": 300,
                "mpesa_fee_percent": 2.5,
                "mpesa_fee_min_kes": 5,
            }
        )
        pro, _ = Plan.objects.get_or_create(
            code="pro",
            defaults={
                "name": "Pro",
                "price_kes": 4999,
                "max_users": 3,
                "has_sms": True,
                "sms_included": 500,
                "has_whatsapp": True,
                "has_rent_health": True,
                "has_analytics": True,
                "mpesa_fee_percent": 1.5,
                "mpesa_fee_min_kes": 3,
            }
        )
        self.stdout.write(self.style.SUCCESS("✓ Plans created"))

        # Create demo tenant
        tenant, _ = Tenant.objects.get_or_create(
            schema_name="freshwash",
            defaults={
                "name": "FreshWash Laundry",
                "phone": "0712345678",
                "email": "mama@freshwash.co.ke",
                "plan": pro,
                "is_active": True,
                "trial_ends_at": timezone.now() + timedelta(days=7),
            }
        )
        Domain.objects.get_or_create(
            domain="freshwash.localhost",
            defaults={"tenant": tenant, "is_primary": True},
        )
        self.stdout.write(self.style.SUCCESS("✓ Tenant created: freshwash"))

        with schema_context("freshwash"):
            # Create admin user
            if not User.objects.filter(phone="0712345678").exists():
                admin = User.objects.create_superuser(
                    username="0712345678",
                    phone="0712345678",
                    first_name="Mama",
                    last_name="Njoro",
                    role="admin",
                    password="admin123",
                )
                self.stdout.write(self.style.SUCCESS("  ✓ Admin: 0712345678 / admin123"))

            # Create cashier
            if not User.objects.filter(phone="0712000001").exists():
                cashier = User.objects.create_user(
                    username="0712000001",
                    phone="0712000001",
                    first_name="Kevin",
                    role="cashier",
                    password="cashier123",
                )
                self.stdout.write(self.style.SUCCESS("  ✓ Cashier: 0712000001 / cashier123"))

            # Create employee
            if not User.objects.filter(phone="0712000002").exists():
                emp = User.objects.create_user(
                    username="0712000002",
                    phone="0712000002",
                    first_name="Mary",
                    role="employee",
                    password="emp123",
                )
                self.stdout.write(self.style.SUCCESS("  ✓ Employee: 0712000002 / emp123"))

            # Create services
            services = [
                ("Wash", "🧺", 50, "kg", 1),
                ("Iron", "🔥", 30, "item", 2),
                ("Fold", "📦", 20, "item", 3),
                ("Dry", "✨", 80, "item", 4),
                ("Press", "👔", 40, "item", 5),
                ("Dry Clean", "🧥", 150, "item", 6),
            ]
            for name, icon, price, unit, sort in services:
                Service.objects.get_or_create(
                    name=name,
                    defaults={"icon": icon, "price_kes": price, "unit": unit, "sort_order": sort}
                )
            self.stdout.write(self.style.SUCCESS("  ✓ Services created"))

            # Create notification templates
            templates = [
                ("order_received", "Hi {{customer_name}}, order #{{order_number}} received. KES {{total}}. Ready: {{status}}"),
                ("order_ready", "✅ Order #{{order_number}} is READY! Pick up at {{shop_name}}. Total: KES {{total}}"),
                ("status_washing", "🧺 Your order #{{order_number}} is now WASHING."),
                ("status_drying", "🔥 Your order #{{order_number}} is now DRYING."),
                ("status_ironing", "✨ Your order #{{order_number}} is now IRONING."),
                ("pickup_reminder_24h", "⏰ Reminder: Order #{{order_number}} ready since yesterday. Storage fee applies."),
                ("payment_received", "💳 Payment received for order #{{order_number}}. KES {{total}}. Receipt saved."),
            ]
            for trigger, text in templates:
                NotificationTemplate.objects.get_or_create(
                    trigger=trigger, channel="sms",
                    defaults={"template_text": text}
                )
            self.stdout.write(self.style.SUCCESS("  ✓ Notification templates created"))

            # Create rent reserve
            RentReserve.objects.get_or_create(
                tenant=tenant,
                defaults={
                    "monthly_rent_kes": 15000,
                    "due_day_of_month": 5,
                    "reserve_amount_kes": 12400,
                    "projection_confidence": "safe",
                    "projected_month_end_kes": 18200,
                }
            )
            self.stdout.write(self.style.SUCCESS("  ✓ Rent reserve configured"))

            # Create demo customers
            customers = [
                ("0712345679", "Wanjiku", "Mwangi"),
                ("0723456789", "James", "Ochieng"),
                ("0734567890", "Sarah", "Kamau"),
            ]
            for phone, first, last in customers:
                Customer.objects.get_or_create(
                    phone=phone,
                    defaults={"first_name": first, "last_name": last, "total_orders": 5, "total_spent_kes": 15000}
                )
            self.stdout.write(self.style.SUCCESS("  ✓ Demo customers created"))

            # Create a sample order
            wanjiku = Customer.objects.filter(phone="0712345679").first()
            if wanjiku and not Order.objects.exists():
                from django.contrib.auth import get_user_model
                admin_user = get_user_model().objects.filter(role="admin").first()
                if admin_user:
                    order = Order.objects.create(
                        order_number="LND-2506-0001",
                        customer=wanjiku,
                        created_by=admin_user,
                        status="received",
                        subtotal_kes=325,
                        vat_kes=52,
                        total_kes=377,
                        payment_method="mpesa",
                        expected_ready_at=timezone.now() + timedelta(hours=24),
                        is_paid=True,
                    )
                    wash = Service.objects.filter(name="Wash").first()
                    iron = Service.objects.filter(name="Iron").first()
                    if wash:
                        OrderItem.objects.create(order=order, service=wash, quantity_kg=3.5, line_total_kes=175)
                    if iron:
                        OrderItem.objects.create(order=order, service=iron, quantity_items=5, line_total_kes=150)

                    Payment.objects.create(
                        order=order,
                        method="mpesa",
                        amount=377,
                        state="completed",
                        mpesa_receipt="SCR123456",
                        paid_at=timezone.now(),
                    )
                    self.stdout.write(self.style.SUCCESS("  ✓ Sample order created"))

        self.stdout.write(self.style.SUCCESS("\n✅ Database seeded successfully!"))
        self.stdout.write("")
        self.stdout.write("  Login credentials:")
        self.stdout.write("  ───────────────────────")
        self.stdout.write("  Admin:    0712345678 / admin123")
        self.stdout.write("  Cashier:  0712000001 / cashier123")
        self.stdout.write("  Employee: 0712000002 / emp123")
        self.stdout.write("")
        self.stdout.write("  URLs:")
        self.stdout.write("  /pos      - Cashier POS")
        self.stdout.write("  /admin    - Admin Dashboard")
        self.stdout.write("  /employee - Employee Task Queue")
        self.stdout.write("  /track/   - Customer Tracker")
