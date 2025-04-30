from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import StudentViewSet, StudentDeleteApiView, StudentDetailView

router = DefaultRouter()
router.register(r'', StudentViewSet)

urlpatterns = [
	path('student-delete/', StudentDeleteApiView.as_view(), name='student-delete'),
	path('student-detail/<uuid:student_id>/', StudentDetailView.as_view(), name='student-detail')
]

urlpatterns += router.urls