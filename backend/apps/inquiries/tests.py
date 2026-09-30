from django.contrib.auth import get_user_model
from django.core import mail
from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from apps.inquiries.models import Inquiry
from config.celery import app as celery_app

User = get_user_model()


@override_settings(
    EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
    INQUIRY_NOTIFICATION_EMAIL="team@stonecrestdxb.com",
    CELERY_TASK_ALWAYS_EAGER=True,
    CELERY_TASK_EAGER_PROPAGATES=True,
)
class InquiryApiTests(TestCase):
    def setUp(self):
        self._eager = celery_app.conf.task_always_eager
        self._propagates = celery_app.conf.task_eager_propagates
        celery_app.conf.task_always_eager = True
        celery_app.conf.task_eager_propagates = True
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="agent",
            email="agent@stonecrestdxb.com",
            password="a-long-password-1",
        )

    def tearDown(self):
        celery_app.conf.task_always_eager = self._eager
        celery_app.conf.task_eager_propagates = self._propagates

    def test_list_requires_auth(self):
        response = self.client.get("/api/inquiries/")
        self.assertEqual(response.status_code, 401)

    def test_authenticated_user_can_list_and_update_status(self):
        with self.captureOnCommitCallbacks(execute=True):
            create = self.client.post(
                "/api/inquiries/",
                {
                    "name": "Omar Said",
                    "email": "omar@example.com",
                    "message": "Please arrange a private viewing.",
                },
                format="json",
            )
        self.assertEqual(create.status_code, 201)
        inquiry_id = create.data["id"]
        self.assertEqual(len(mail.outbox), 2)

        self.client.force_authenticate(self.user)
        listing = self.client.get("/api/inquiries/")
        self.assertEqual(listing.status_code, 200)
        self.assertEqual(listing.data["count"], 1)
        self.assertEqual(listing.data["results"][0]["status"], Inquiry.Status.NEW)

        update = self.client.patch(
            f"/api/inquiries/{inquiry_id}/",
            {"status": Inquiry.Status.CONTACTED},
            format="json",
        )
        self.assertEqual(update.status_code, 200)
        self.assertEqual(update.data["status"], Inquiry.Status.CONTACTED)
        self.assertEqual(
            Inquiry.objects.get(pk=inquiry_id).status,
            Inquiry.Status.CONTACTED,
        )
