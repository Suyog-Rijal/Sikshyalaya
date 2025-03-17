from django.urls import path
from .views import EnrollmentApiView, AddStaffApiView, SchoolClassViewSet, SubjectViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'class', SchoolClassViewSet, basename='school_class')
router.register(r'subject', SubjectViewSet, basename='section')

urlpatterns = [
	path('enrollment/', EnrollmentApiView.as_view(), name='enrollment'),
	path('add-staff/', AddStaffApiView.as_view(), name='add_staff'),
]

urlpatterns += router.urls

