from django.db.models import Q
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from apps.inquiries.models import Inquiry
from apps.inquiries.pagination import InquiryPagination
from apps.inquiries.serializers import (
    InquiryCreateSerializer,
    InquiryListSerializer,
    InquiryStatusSerializer,
)
from apps.notifications.services import send_inquiry_emails


class InquiryListCreateView(generics.ListCreateAPIView):
    pagination_class = InquiryPagination

    def get_permissions(self):
        if self.request.method == "POST":
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return InquiryCreateSerializer
        return InquiryListSerializer

    def get_queryset(self):
        qs = Inquiry.objects.select_related("listing")
        params = self.request.query_params

        status_value = params.get("status", "").strip().lower()
        if status_value in {choice.value for choice in Inquiry.Status}:
            qs = qs.filter(status=status_value)

        search = params.get("search", "").strip()
        if search:
            qs = qs.filter(
                Q(name__icontains=search)
                | Q(email__icontains=search)
                | Q(phone__icontains=search)
                | Q(message__icontains=search)
                | Q(listing__title__icontains=search)
            )

        return qs

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        inquiry = serializer.save()
        send_inquiry_emails(inquiry=inquiry)
        return Response(
            InquiryCreateSerializer(inquiry).data,
            status=status.HTTP_201_CREATED,
        )


class InquiryStatusUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = InquiryStatusSerializer
    http_method_names = ["patch", "put", "head", "options"]
    queryset = Inquiry.objects.select_related("listing")
