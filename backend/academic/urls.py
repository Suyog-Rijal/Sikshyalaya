from django.conf import settings
from django.urls import path
from .views import EnrollmentApiView, AddStaffApiView, SchoolClassViewSet, SubjectApiView, RoutineViewSet, \
	RoutineFormGetAPiView, SimpleClassListApiView, UpdateSubjectApiView, \
	AttendanceRecordViewSet, DeleteStaffApiView, AddStaffImageView, EnrollmentImageView, TeacherStudentList, \
	AttendanceRecordSearchView, TeacherStudentAttendanceView, AttendanceSessionView, AttendanceSessionDetailView, \
	AttendanceRecordUpdateView, AttendanceRecordIndividualUpdate, AssignmentViewSet, AssignmentFormGetApiView, \
	SchoolClassTeacherApiView, ParentDetailView, ExamViewSet, ExamFormViewSet, AnnouncementViewSet, \
	GradeAssignmentApiView, AdminDashboard, ParentChildAttendance, SubmissionsView
from rest_framework.routers import DefaultRouter
from django.conf.urls.static import static


router = DefaultRouter()
router.register(r'class', SchoolClassViewSet, basename='school_class')
router.register(r'routine', RoutineViewSet, basename='routine')
router.register('attendance-record', AttendanceRecordViewSet, basename='attendance-record')
router.register('assignment', AssignmentViewSet, basename='assignment')
router.register('exam', ExamViewSet, basename='exam')
router.register('exam-form', ExamFormViewSet, basename='exam-form')
router.register(r'announcement', AnnouncementViewSet, basename='announcement')
router.register('submission', SubmissionsView, basename='submission')

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
	path('class-teacher/<uuid:class_id>/', SchoolClassTeacherApiView.as_view(), name='class-teacher'),
	path('teacher-student-list/', TeacherStudentList.as_view(), name='teacher-student-list'),
	path('attendace-search/', AttendanceRecordSearchView.as_view(), name='attendance-search'),
	path('teacher-student-attendance-record/', TeacherStudentAttendanceView.as_view(), name='teacher-attendance-record'),

	path('attendance-session/', AttendanceSessionView.as_view(), name='attendance-session'),
	path('attendance-session-detail/<uuid:session_id>/', AttendanceSessionDetailView.as_view(), name='attendance-session-detail'),
	path('attendance-record-update/', AttendanceRecordUpdateView.as_view(), name='attendance-record-update'),
	path('attendance-record-individual-update/', AttendanceRecordIndividualUpdate.as_view(), name='attendance-record-individual-update'),

	path('assignment-form-get/', AssignmentFormGetApiView.as_view(), name='assignment-form-get'),
	path('assignment-grade/', GradeAssignmentApiView.as_view(), name='assignment-grade'),


	path('parent-detial/<uuid:parent_id>/', ParentDetailView.as_view(), name='parent-detail'),

	path('admin-dashboard/', AdminDashboard.as_view(), name='admin-dashboard'),
	path('parent-child-attendance', ParentChildAttendance.as_view(), name='parent-child-attendance'),

]

urlpatterns += router.urls

if settings.DEBUG:
	urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

