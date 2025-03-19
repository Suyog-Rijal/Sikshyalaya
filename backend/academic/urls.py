from django.urls import path
from .views import EnrollmentApiView, AddStaffApiView, SchoolClassViewSet, SubjectApiView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'class', SchoolClassViewSet, basename='school_class')

urlpatterns = [
	path('enrollment/', EnrollmentApiView.as_view(), name='enrollment'),
	path('add-staff/', AddStaffApiView.as_view(), name='add_staff'),
	path('subject/', SubjectApiView.as_view(), name='subject-list'),
	path('subject/<uuid:id>/', SubjectApiView.as_view(), name='subject-detail'),
]

urlpatterns += router.urls

