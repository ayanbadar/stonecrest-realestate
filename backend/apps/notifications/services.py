import logging

from django.conf import settings
from django.db import transaction
from django.template.loader import render_to_string
from django.utils import timezone

from apps.notifications.models import OutboundEmail
from apps.notifications.tasks import deliver_email

logger = logging.getLogger(__name__)


def queue_email(
    *,
    kind: str,
    subject: str,
    recipients: list[str],
    template: str,
    context: dict,
    reply_to: list[str] | None = None,
) -> OutboundEmail | None:
    """Render an email and hand it to the Celery worker after commit."""
    cleaned = [address.strip() for address in recipients if address and address.strip()]
    if not cleaned:
        return None

    email = OutboundEmail.objects.create(
        kind=kind,
        subject=subject,
        recipients=cleaned,
        reply_to=[
            address.strip()
            for address in (reply_to or [])
            if address and address.strip()
        ],
        text_body=render_to_string(
            f"notifications/emails/{template}.txt",
            context,
        ).strip(),
        html_body=render_to_string(
            f"notifications/emails/{template}.html",
            context,
        ).strip(),
        status=OutboundEmail.Status.QUEUED,
    )
    email_id = email.pk

    def _enqueue() -> None:
        try:
            deliver_email.delay(email_id)
        except Exception:
            logger.exception("Failed to enqueue email %s", email_id)

    transaction.on_commit(_enqueue)
    return email


def send_password_reset_email(*, user, uid: str, token: str) -> None:
    frontend_url = settings.FRONTEND_URL.rstrip("/")
    reset_url = f"{frontend_url}/reset-password?uid={uid}&token={token}"
    queue_email(
        kind=OutboundEmail.Kind.PASSWORD_RESET,
        subject="Reset your Stonecrest password",
        recipients=[user.email],
        template="password_reset",
        context={
            "name": user.get_full_name() or user.username,
            "reset_url": reset_url,
            "year": timezone.now().year,
        },
    )


def send_inquiry_emails(*, inquiry) -> None:
    """Notify the team and confirm to the client after an enquiry is saved."""
    team_email = getattr(settings, "INQUIRY_NOTIFICATION_EMAIL", "") or ""
    frontend_url = settings.FRONTEND_URL.rstrip("/")
    listing = inquiry.listing
    property_title = listing.title if listing else ""
    property_url = ""
    if listing and listing.slug:
        property_url = f"{frontend_url}/listings/{listing.slug}"

    context = {
        "name": inquiry.name,
        "email": inquiry.email,
        "phone": inquiry.phone,
        "message": inquiry.message,
        "property_title": property_title,
        "property_url": property_url,
        "property_community": listing.community if listing else "",
        "property_city": listing.city if listing else "",
        "inquiry_id": inquiry.pk,
        "year": timezone.now().year,
    }
    subject_suffix = f" — {property_title}" if property_title else ""

    if team_email:
        queue_email(
            kind=OutboundEmail.Kind.INQUIRY_TEAM,
            subject=f"New enquiry from {inquiry.name}{subject_suffix}",
            recipients=[team_email],
            template="inquiry_team",
            context=context,
            reply_to=[inquiry.email],
        )

    queue_email(
        kind=OutboundEmail.Kind.INQUIRY_CONFIRMATION,
        subject="We received your enquiry · Stonecrest",
        recipients=[inquiry.email],
        template="inquiry_confirmation",
        context=context,
        reply_to=[team_email] if team_email else None,
    )
