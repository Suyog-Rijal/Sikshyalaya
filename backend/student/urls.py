from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import StudentViewSet, StudentDeleteApiView

router = DefaultRouter()
router.register(r'', StudentViewSet)

urlpatterns = [
	path('student-delete/', StudentDeleteApiView.as_view(), name='student-delete'),
]

urlpatterns += router.urls