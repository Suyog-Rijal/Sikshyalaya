from django.urls import path
from .views import EnrollmentApiView

urlpatterns = [
	path('enrollment/', EnrollmentApiView.as_view(), name='enrollment'),
]
