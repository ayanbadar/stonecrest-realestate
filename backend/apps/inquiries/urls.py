from django.urls import path

from apps.inquiries.views import InquiryListCreateView, InquiryStatusUpdateView

urlpatterns = [
    path("", InquiryListCreateView.as_view(), name="inquiry-list-create"),
    path("<int:pk>/", InquiryStatusUpdateView.as_view(), name="inquiry-status"),
]
