from django.contrib.auth import get_user_model
from django.core import mail
from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from apps.inquiries.models import Inquiry
from apps.notifications.models import OutboundEmail
from config.celery import app as celery_app

User = get_user_model()


@override_settings(
    EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
    INQUIRY_NOTIFICATION_EMAIL="team@stonecrestdxb.com",
    DEFAULT_FROM_EMAIL="noreply@stonecrestdxb.com",
    CELERY_TASK_ALWAYS_EAGER=True,
    CELERY_TASK_EAGER_PROPAGATES=True,
)
class NotificationEmailTests(TestCase):
    def setUp(self):
        self._eager = celery_app.conf.task_always_eager
        self._propagates = celery_app.conf.task_eager_propagates
        celery_app.conf.task_always_eager = True
        celery_app.conf.task_eager_propagates = True
        self.client = APIClient()

    def tearDown(self):
        celery_app.conf.task_always_eager = self._eager
        celery_app.conf.task_eager_propagates = self._propagates

    def test_forgot_password_sends_via_background_task(self):
        User.objects.create_user(
            username="ayana",
            email="ayana@example.com",
            password="a-long-password-1",
            first_name="Ayana",
        )

        with self.captureOnCommitCallbacks(execute=True):
            response = self.client.post(
                "/api/auth/forgot-password/",
                {"email": "ayana@example.com"},
                format="json",
            )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].to, ["ayana@example.com"])
        self.assertIn("reset-password", mail.outbox[0].body)
        email = OutboundEmail.objects.get()
        self.assertEqual(email.kind, OutboundEmail.Kind.PASSWORD_RESET)
        self.assertEqual(email.status, OutboundEmail.Status.SENT)
        self.assertEqual(email.text_body, "")
        self.assertEqual(email.html_body, "")

    def test_unknown_email_does_not_send(self):
        with self.captureOnCommitCallbacks(execute=True):
            response = self.client.post(
                "/api/auth/forgot-password/",
                {"email": "missing@example.com"},
                format="json",
            )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(mail.outbox), 0)
        self.assertEqual(OutboundEmail.objects.count(), 0)

    def test_inquiry_notifies_team_and_sender(self):
        with self.captureOnCommitCallbacks(execute=True):
            response = self.client.post(
                "/api/inquiries/",
                {
                    "name": "Lina Hassan",
                    "email": "lina@example.com",
                    "phone": "+971500000000",
                    "message": "I would like a private viewing this week.",
                },
                format="json",
            )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["status"], Inquiry.Status.NEW)
        self.assertEqual(Inquiry.objects.count(), 1)
        self.assertEqual(len(mail.outbox), 2)
        self.assertEqual(mail.outbox[0].to, ["team@stonecrestdxb.com"])
        self.assertEqual(mail.outbox[0].reply_to, ["lina@example.com"])
        self.assertEqual(mail.outbox[1].to, ["lina@example.com"])
        self.assertEqual(
            set(OutboundEmail.objects.values_list("status", flat=True)),
            {OutboundEmail.Status.SENT},
        )
