from django.urls import path
from .views import *

urlpatterns = [
	path('enrollment/', EnrollmentApiView.as_view(), name='enrollment'),
]
