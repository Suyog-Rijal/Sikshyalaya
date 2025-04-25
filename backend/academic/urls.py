from django.conf import settings
from django.urls import path
from .views import EnrollmentApiView, AddStaffApiView, SchoolClassViewSet, SubjectApiView, RoutineViewSet, \
	RoutineFormGetAPiView, SimpleClassListApiView, UpdateSubjectApiView, \
	AttendanceRecordViewSet, DeleteStaffApiView, AddStaffImageView, EnrollmentImageView, TeacherStudentList, \
	AttendanceRecordSearchView, TeacherStudentAttendanceView, AttendanceSessionView
from rest_framework.routers import DefaultRouter
from django.conf.urls.static import static


router = DefaultRouter()
router.register(r'class', SchoolClassViewSet, basename='school_class')
router.register(r'routine', RoutineViewSet, basename='routine')
router.register('attendance-record', AttendanceRecordViewSet, basename='attendance-record')

urlpatterns = [
	path('enrollment/', EnrollmentApiView.as_view(), name='enrollment'),
	path('enrollment-image/', EnrollmentImageView.as_view(), name='enrollment_image'),
	path('add-staff/', AddStaffApiView.as_view(), name='add_staff'),
	path('add-staff-image/', AddStaffImageView.as_view(), name='add_staff_image'),
	path('delete-staff/<uuid:id>/', DeleteStaffApiView.as_view(), name='delete_staff'),
	path('subject/', SubjectApiView.as_view(), name='subject-list'),
	path('subject/update/', UpdateSubjectApiView.as_view(), name='subject-update'),
	path('subject/<uuid:id>/', SubjectApiView.as_view(), name='subject-detail'),
	path('routine/add/', RoutineFormGetAPiView.as_view(), name='routine-add'),
	path('class-list/', SimpleClassListApiView.as_view(), name='class-list'),
	path('teacher-student-list/', TeacherStudentList.as_view(), name='teacher-student-list'),
	path('attendace-search/', AttendanceRecordSearchView.as_view(), name='attendance-search'),
	path('teacher-student-attendance-record/', TeacherStudentAttendanceView.as_view(), name='teacher-attendance-record'),

	path('attendance-session/', AttendanceSessionView.as_view(), name='attendance-session'),
]

urlpatterns += router.urls

if settings.DEBUG:
	urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

