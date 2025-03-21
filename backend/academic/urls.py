from django.urls import path
from .views import EnrollmentApiView, AddStaffApiView, SchoolClassViewSet, SubjectApiView, RoutineViewSet, \
	RoutineFormGetAPiView, SimpleClassListApiView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'class', SchoolClassViewSet, basename='school_class')
router.register(r'routine', RoutineViewSet, basename='routine')

urlpatterns = [
	path('enrollment/', EnrollmentApiView.as_view(), name='enrollment'),
	path('add-staff/', AddStaffApiView.as_view(), name='add_staff'),
	path('subject/', SubjectApiView.as_view(), name='subject-list'),
	path('subject/<uuid:id>/', SubjectApiView.as_view(), name='subject-detail'),
	path('routine/add/', RoutineFormGetAPiView.as_view(), name='routine-add'),
	path('class-list/', SimpleClassListApiView.as_view(), name='class-list'),
]

urlpatterns += router.urls

