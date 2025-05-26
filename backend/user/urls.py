from django.urls import path
from .views import LoginView, LeaveApiStudentView, LeaveDeleteView, LeaveAdminViewSet, MeView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'leave', LeaveAdminViewSet, basename='leave-admin')

urlpatterns = [
	path('login/', LoginView.as_view(), name='login'),
	path('leave-me/', LeaveApiStudentView.as_view(), name='leave'),
	path('leave-me/<uuid:leave_id>/', LeaveDeleteView.as_view(), name='leave-cancel'),
	path('get-edit-info/<uuid:id>/', MeView.as_view(), name='me'),
]

urlpatterns += router.urls