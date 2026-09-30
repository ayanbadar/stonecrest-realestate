import logging
from datetime import timedelta

from celery import shared_task
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.db.models import F
from django.utils import timezone

from apps.notifications.models import OutboundEmail

logger = logging.getLogger(__name__)

CLAIMABLE_STATUSES = (
    OutboundEmail.Status.QUEUED,
    OutboundEmail.Status.FAILED,
)


@shared_task(
    bind=True,
    autoretry_for=(OSError, ConnectionError, TimeoutError),
    retry_backoff=True,
    retry_backoff_max=600,
    retry_jitter=True,
    max_retries=5,
    name="notifications.deliver_email",
)
def deliver_email(self, email_id: int) -> None:
    """Send one queued email. Claim the row so a retry cannot double-send."""
    claimed = OutboundEmail.objects.filter(
        pk=email_id,
        status__in=CLAIMABLE_STATUSES,
    ).update(
        status=OutboundEmail.Status.SENDING,
        attempts=F("attempts") + 1,
        error="",
    )
    if not claimed:
        return

    email = OutboundEmail.objects.get(pk=email_id)
    message = EmailMultiAlternatives(
        subject=email.subject,
        body=email.text_body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=list(email.recipients),
        reply_to=list(email.reply_to or []),
    )
    if email.html_body:
        message.attach_alternative(email.html_body, "text/html")

    try:
        message.send(fail_silently=False)
    except Exception as exc:
        OutboundEmail.objects.filter(pk=email_id).update(
            status=OutboundEmail.Status.FAILED,
            error=str(exc)[:2000],
        )
        logger.exception("Failed to deliver email %s", email_id)
        raise

    sent_fields = {
        "status": OutboundEmail.Status.SENT,
        "error": "",
        "sent_at": timezone.now(),
    }
    # Drop the reset link once delivery succeeds so it is not kept on file.
    if email.kind == OutboundEmail.Kind.PASSWORD_RESET:
        sent_fields["text_body"] = ""
        sent_fields["html_body"] = ""

    OutboundEmail.objects.filter(pk=email_id).update(**sent_fields)


@shared_task(name="notifications.dispatch_stale_emails")
def dispatch_stale_emails() -> int:
    """Re-queue emails the worker never claimed, or that stalled mid-send."""
    now = timezone.now()
    queued_before = now - timedelta(minutes=2)
    sending_before = now - timedelta(minutes=10)

    OutboundEmail.objects.filter(
        status=OutboundEmail.Status.SENDING,
        updated_at__lt=sending_before,
    ).update(status=OutboundEmail.Status.QUEUED)

    email_ids = list(
        OutboundEmail.objects.filter(
            status=OutboundEmail.Status.QUEUED,
            created_at__lt=queued_before,
        ).values_list("pk", flat=True)[:100]
    )
    for email_id in email_ids:
        deliver_email.delay(email_id)
    return len(email_ids)
