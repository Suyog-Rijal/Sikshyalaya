from django.urls import path
from .views import EnrollmentApiView, AddStaffApiView

urlpatterns = [
	path('enrollment/', EnrollmentApiView.as_view(), name='enrollment'),
	path('add-staff/', AddStaffApiView.as_view(), name='add_staff'),
]

