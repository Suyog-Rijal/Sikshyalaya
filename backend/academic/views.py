import uuid

from django.db import transaction
from django.core.exceptions import ValidationError
from django.db.models import Prefetch, Q, Count
from django.utils import timezone
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from academic.models import SchoolClass, Department, Section, Subject, Routine, AttendanceSession, AttendanceRecord, \
	Enrollment, Assignment, Exam, Announcement, AssignmentAttachment, Submission
from academic.serializer import EnrollmentPostSerializer, EnrollmentGetSchoolClassSerializer, AddStaffGetSerializer, \
	SimpleDepartmentSerializer, AddStaffSerializer, SimpleTeacherSerializer, SimpleManagementStaffSerializer, \
	SchoolClassGetSerializer, SchoolClassPostSerializer, SubjectListSerializer, RoutineSerializer, \
	SimpleSchoolClassSerializer, SimpleSubjectSerializer, SimpleStaffSerializer, RoutineSchoolClassGetSerializer, \
	RoutineTeacherGetSerializer, RoutinePostSerializer, AttendanceRecordPostSerializer, \
	AttendanceRecordGetSerializer, AssignmentFormGetSerializer, SchoolClassRetrieveSerializer, \
	ClassTeacherApiSerializer, ExamSerializer, ExamPostSerializer, ExamFormSerializer, AnnouncementSerializer, \
	AnnouncementPostSerializer, TeacherAssignmentGetSerializer, AssignmentPostSerializer, \
	TeacherAssignmentDetailSerializer, AssignmentUpdateSerializer, SubmissionSerializer
from student.serializer import ListStudentSerializer
from user.serializer import StudentSerializer, ParentSerializer, ParentDetailSerializer
from user.models import Parent, Teacher, Staff, CustomUser, Student, ManagementStaff
from drf_spectacular.utils import extend_schema, OpenApiResponse
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample
from rest_framework import filters
from rest_framework.response import Response


class EnrollmentApiView(APIView):
	permission_classes = [AllowAny]

	def get(self, request):
		try:
			school_class = SchoolClass.objects.all()
			serializer = EnrollmentGetSchoolClassSerializer(school_class, many=True)
			return Response(serializer.data, status=status.HTTP_200_OK)

		except SchoolClass.DoesNotExist:
			return Response({'error': 'School class not found'}, status=status.HTTP_404_NOT_FOUND)

	def post(self, request):
		student_info = request.data.get('student_info')
		father_info = request.data.get('father_info')
		mother_info = request.data.get('mother_info')
		guardian_info = request.data.get('guardian_info')
		enrollment_info = request.data.get('enrollment_info')

		try:
			with transaction.atomic():
				parent_instances = {}
				parent_data = [
					('father', father_info, 'F'),
					('mother', mother_info, 'M'),
					('guardian', guardian_info, 'G'),
				]

				for field, parent_info, relationship in parent_data:
					if parent_info:
						parent_info['relationship'] = relationship

						existing_parent = Parent.objects.filter(email=parent_info.get('email')).first()

						if existing_parent:
							parent_instances[field] = existing_parent
						else:
							parent_serializer = ParentSerializer(data=parent_info)
							parent_serializer.is_valid(raise_exception=True)
							parent_instance = parent_serializer.save()
							parent_instances[field] = parent_instance

				student_serializer = StudentSerializer(data=student_info)
				student_serializer.is_valid(raise_exception=True)
				student = student_serializer.save(
					father=parent_instances.get('father'),
					mother=parent_instances.get('mother'),
					guardian=parent_instances.get('guardian')
				)

				enrollment_info['student'] = student.id
				enrollment_serializer = EnrollmentPostSerializer(data=enrollment_info)
				enrollment_serializer.is_valid(raise_exception=True)
				enrollment_serializer.save()

			return Response(enrollment_serializer.data, status=status.HTTP_201_CREATED)
		except Exception as e:
			return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class EnrollmentImageView(APIView):
	permission_classes = [IsAuthenticated]

	def post(self, request):
		if not request.user.has_role('admin'):
			return Response(
				{'detail': 'You do not have permission to update student image.'},
				status=status.HTTP_403_FORBIDDEN
			)

		try:
			student_id = request.data.get('id')
			student_image = request.FILES.get('student_image')
			father_image = request.FILES.get('father_image')
			mother_image = request.FILES.get('mother_image')
			guardian_image = request.FILES.get('guardian_image')
			student = Student.objects.get(id=student_id)

			if not student:
				return Response(
					{'detail': 'Student not found.'},
					status=status.HTTP_404_NOT_FOUND
				)

			if student_image:
				student.profile_picture = student_image
				student.save()
			if father_image:
				student.father.profile_picture = father_image
				student.father.save()
			if mother_image:
				student.mother.profile_picture = mother_image
				student.mother.save()
			if guardian_image:
				student.guardian.profile_picture = guardian_image
				student.guardian.save()
			return Response(
				{'detail': 'Student image updated successfully.'},
				status=status.HTTP_200_OK
			)
		except Exception as e:
			print(e)
			return Response(
				{'detail': 'An error occurred while updating student image.'},
				status=status.HTTP_400_BAD_REQUEST
			)


class AddStaffApiView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request):
		try:
			staff = SchoolClass.objects.all()
			serializer = AddStaffGetSerializer(staff, many=True)
			departments = SimpleDepartmentSerializer(Department.objects.all(), many=True)
			return Response({'staff': serializer.data, 'departments': departments.data}, status=status.HTTP_200_OK)
		except Exception as e:
			return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

	def post(self, request):
		print(request.data)
		try:
			if not request.user.has_role('admin'):
				return Response(
					{'detail': 'You do not have permission to add staff.'},
					status=status.HTTP_403_FORBIDDEN
				)
			with transaction.atomic():
				staff_info = request.data.get('staff_info')
				staff_info['staff_type'] = request.data.get('staff_type')
				staff_serializer = AddStaffSerializer(data=staff_info)
				staff_serializer.is_valid(raise_exception=True)
				staff_instance = staff_serializer.save()

				staff_type = request.data.get('staff_type')
				if staff_type == 'T':
					other_info = request.data.get('teacher_info')
					other_info['staff'] = staff_instance.id
					other_serializer = SimpleTeacherSerializer(data=other_info)
				elif staff_type == 'M':
					other_info = request.data.get('managementStaff_info')
					other_info['staff'] = staff_instance.id
					other_serializer = SimpleManagementStaffSerializer(data=other_info)
				other_serializer.is_valid(raise_exception=True)
				other_instance = other_serializer.save()

				return Response(staff_instance.id, status=status.HTTP_201_CREATED)

		except Exception as e:
			return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class AddStaffImageView(APIView):
	permission_classes = [IsAuthenticated]

	def post(self, request):
		print('data: ', request.data)
		if not request.user.has_role('admin'):
			return Response(
				{'detail': 'You do not have permission to update staff image.'},
				status=status.HTTP_403_FORBIDDEN
			)

		try:
			staff_id = request.data.get('id')
			staff = Staff.objects.get(id=staff_id)
			if not staff:
				return Response(
					{'detail': 'Staff not found.'},
					status=status.HTTP_404_NOT_FOUND
				)
			staff.profile_picture = request.FILES.get('image')
			staff.save()
			return Response(
				{'detail': 'Staff image updated successfully.'},
				status=status.HTTP_200_OK
			)
		except Exception as e:
			print(e)
			return Response(
				{'detail': 'An error occurred while updating staff image.'},
				status=status.HTTP_400_BAD_REQUEST
			)


class DeleteStaffApiView(APIView):
	permission_classes = [IsAuthenticated]

	@extend_schema(
		description="Delete a staff member by ID. Only accessible by users with the 'admin' role.",
		request=None,
		parameters=[
			OpenApiParameter(
				name='id',
				location=OpenApiParameter.QUERY,
				required=True,
				type=uuid.UUID,
				description='ID of the staff to delete'
			)
		],
		responses={
			200: OpenApiExample(
				'Success',
				value={'detail': 'Staff deleted successfully.'}
			),
			403: OpenApiExample(
				'Forbidden',
				value={'detail': 'You do not have permission to delete staff.'}
			),
			404: OpenApiExample(
				'Not Found',
				value={'detail': 'Staff not found.'}
			),
			400: OpenApiExample(
				'Bad Request',
				value={'detail': 'An error occurred while deleting staff.'}
			),
		}
	)
	def delete(self, request, id):
		try:
			if not request.user.has_role('admin'):
				return Response(
					{'detail': 'You do not have permission to delete staff.'},
					status=status.HTTP_403_FORBIDDEN
				)

			staff = Staff.objects.get(id=id)
			if not staff:
				return Response(
					{'detail': 'Staff not found.'},
					status=status.HTTP_404_NOT_FOUND
				)
			staff.delete()
			user = CustomUser.objects.get(email=staff.email)
			if user:
				user.delete()
			return Response(
				{'detail': 'Staff deleted successfully.'},
				status=status.HTTP_200_OK
			)
		except Exception as e:
			print(e)
			return Response(
				{'detail': 'An error occurred while deleting staff.'},
				status=status.HTTP_400_BAD_REQUEST
			)


class SchoolClassViewSet(ModelViewSet):
	permission_classes = [AllowAny]
	http_method_names = ['get', 'post', 'delete', 'put']
	queryset = SchoolClass.objects.all()

	def get_serializer_class(self):
		if self.action == 'list':
			return SchoolClassGetSerializer
		if self.action == 'create':
			return SchoolClassPostSerializer
		if self.action == 'update':
			return SchoolClassPostSerializer
		if self.action == 'retrieve':
			return SchoolClassRetrieveSerializer

	def update(self, request, *args, **kwargs):
		school_id = kwargs.get('pk')
		school = SchoolClass.objects.get(id=school_id)
		sections = request.data.pop('section', [])
		existing_sections = school.section.all()
		new_sections = []
		sections_to_remove = []

		if sections:
			for each in sections:
				if not existing_sections.filter(name=each.get('name')).exists():
					new_sections.append(each.get('name'))

		if existing_sections:
			for each in existing_sections:
				if each.name not in [section.get('name') for section in sections]:
					sections_to_remove.append(each)

		with transaction.atomic():
			for each in new_sections:
				Section.objects.create(school_class=school, name=each)
			for section in sections_to_remove:
				section.delete()

		return Response({'message': 'Classes updated successfully'}, status=status.HTTP_200_OK)


@extend_schema(tags=["Class"])
class SchoolClassTeacherApiView(APIView):
	permission_classes = [AllowAny]

	def get(self, request, class_id=None):
		if not request.user.has_role('admin'):
			return Response(
				{'detail': 'You do not have permission to view teachers.'},
				status=status.HTTP_403_FORBIDDEN
			)

		try:
			school_class = SchoolClass.objects.get(id=class_id)
			teachers = school_class.teachers.all().prefetch_related('staff')
			teachers = [teacher for teacher in teachers if not teacher.sections.exists()]

			serializer = ClassTeacherApiSerializer(teachers, many=True)
			return Response(serializer.data, status=status.HTTP_200_OK)
		except Exception as e:
			print(e)
			return Response(
				{'detail': 'An error occurred while retrieving teachers.'},
				status=status.HTTP_400_BAD_REQUEST
			)

	def post(self, request, class_id=None):
		if not request.user.has_role('admin'):
			return Response(
				{'detail': 'You do not have permission to add teachers.'},
				status=status.HTTP_403_FORBIDDEN
			)

		try:
			teacher_id = request.data.get('teacher_id')
			teacher = Teacher.objects.get(id=teacher_id)

			section_id = request.data.get('section_id')
			section = Section.objects.get(id=section_id)

			school_class = SchoolClass.objects.get(id=class_id)
			teachers = school_class.teachers.all().prefetch_related('staff')
			teachers = [teacher for teacher in teachers if not teacher.sections.exists()]
			if teacher not in teachers:
				return Response(
					{'message': 'Teacher already assigned to another section.'},
					status=status.HTTP_400_BAD_REQUEST
				)

			section.class_teacher = teacher
			section.save()
			return Response(
				{'message': 'Teacher assigned successfully.'},
				status=status.HTTP_200_OK
			)

		except Exception as e:
			print(e)
			return Response(
				{'detail': 'An error occurred while adding teachers.'},
				status=status.HTTP_400_BAD_REQUEST
			)

	def delete(self, request, class_id=None):
		# if not request.user.has_role('admin'):
		# 	return Response(
		# 		{'detail': 'You do not have permission to delete teachers.'},
		# 		status=status.HTTP_403_FORBIDDEN
		# 	)

		try:
			print('data', request.data)

			section_id = request.data.get('section_id')
			section = Section.objects.get(id=section_id)

			section.class_teacher = None
			section.save()

			return Response(
				{'message': 'Teacher unassigned successfully.'},
				status=status.HTTP_200_OK
			)

		except Exception as e:
			print(e)
			return Response(
				{'detail': 'An error occurred while deleting teachers.'},
				status=status.HTTP_400_BAD_REQUEST
			)


class SubjectApiView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request, id=None):
		try:
			if id:
				subject = SchoolClass.objects.get(id=id)
				serializer = SubjectListSerializer(subject)
			else:
				subject = SchoolClass.objects.all()
				serializer = SubjectListSerializer(subject, many=True)
			return Response(serializer.data, status=status.HTTP_200_OK)

		except Exception as e:
			return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

	def post(self, request):
		try:
			school_class = SchoolClass.objects.get(id=request.data.get('selectedClass'))
			subjects_data = request.data.get('subjects')
			existing_subjects = Subject.objects.filter(school_class=school_class)

			request_names = [subject.get('name') for subject in subjects_data] if subjects_data else []

			with transaction.atomic():
				if subjects_data:
					for subject_data in subjects_data:
						name = subject_data.get('name')
						if not existing_subjects.filter(name=name).exists():
							Subject.objects.create(
								school_class=school_class,
								name=name,
								full_marks=subject_data.get('full_marks'),
								pass_marks=subject_data.get('pass_marks')
							)
				subjects_to_delete = existing_subjects.exclude(name__in=request_names)
				subjects_to_delete.delete()

			return Response({'message': 'Subjects updated successfully'}, status=status.HTTP_200_OK)
		except Exception as e:
			return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

	def delete(self, request, id):
		try:
			subject = Subject.objects.get(id=id)
			subject.delete()
			return Response({'message': 'Subject deleted successfully'}, status=status.HTTP_200_OK)
		except Exception as e:
			return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class RoutineViewSet(ModelViewSet):
	http_method_names = ['get', 'post', 'delete', 'put']
	permission_classes = [AllowAny]
	queryset = Routine.objects.all()
	serializer_class = RoutineSerializer

	def get_serializer_class(self):
		if self.action == 'create':
			return RoutinePostSerializer
		if self.action == 'update':
			return RoutinePostSerializer
		return RoutineSerializer

	def get_queryset(self):
		if self.request.user.has_role('admin'):
			return Routine.objects.all().order_by('created_at')
		elif self.request.user.has_role('teacher'):
			teacher = Teacher.objects.get(staff__email=self.request.user.email)
			return Routine.objects.filter(teacher=teacher).order_by('created_at')
		elif self.request.user.has_role('student'):
			student = Student.objects.get(email=self.request.user.email)
			enrollment = Enrollment.objects.filter(student=student).first()
			if enrollment:
				return Routine.objects.filter(school_class=enrollment.school_class,
				                              section=enrollment.section).order_by('created_at')
			return Routine.objects.none()

	def update(self, request, *args, **kwargs):
		try:
			return super().update(request, *args, **kwargs)
		except ValidationError as e:
			return Response({"error": e.message_dict}, status=status.HTTP_400_BAD_REQUEST)


class RoutineFormGetAPiView(APIView):
	permission_classes = [AllowAny]

	def get(self, request):
		try:
			school_class = RoutineSchoolClassGetSerializer(SchoolClass.objects.all(), many=True)
			return Response({'school_class': school_class.data}, status=status.HTTP_200_OK)

		except Exception as e:
			return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class SimpleClassListApiView(APIView):
	permission_classes = [AllowAny]

	def get(self, request):
		try:
			school_class = SimpleSchoolClassSerializer(SchoolClass.objects.all(), many=True)
			return Response(school_class.data, status=status.HTTP_200_OK)

		except Exception as e:
			return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UpdateSubjectApiView(APIView):
	permission_classes = [IsAuthenticated]

	def put(self, request):
		user = request.user
		if not user.has_role('admin'):
			return Response(
				{'detail': 'You do not have permission to update subjects.'},
				status=status.HTTP_403_FORBIDDEN
			)

		try:
			subject = Subject.objects.get(id=request.data.get('id'))
			if not subject:
				return Response(
					{'detail': 'Subject not found.'},
					status=status.HTTP_404_NOT_FOUND
				)
			subject.name = request.data.get('name')
			subject.full_marks = request.data.get('full_marks')
			subject.pass_marks = request.data.get('pass_marks')
			subject.save()
			return Response(
				{'detail': 'Subject updated successfully.'},
				status=status.HTTP_200_OK
			)
		except Exception as e:
			print(e)
			return Response(
				{'detail': 'An error occurred while updating subjects.'},
				status=status.HTTP_400_BAD_REQUEST
			)


@extend_schema(tags=["Attendance"])
class AttendanceSessionView(APIView):
	permission_classes = [IsAuthenticated]

	def post(self, request):
		user = request.user
		if not user.has_role('teacher'):
			return Response(
				{'detail': 'You do not have permission to create attendance session.'},
				status=status.HTTP_403_FORBIDDEN
			)

		try:
			user = request.user
			staff = Staff.objects.get(email=user.email)
			teacher = Teacher.objects.get(staff=staff)
			class_teacher_of = SchoolClass.objects.get(section__class_teacher=teacher)
			section = Section.objects.get(class_teacher=teacher)
			session = AttendanceSession.objects.create(
				school_class=class_teacher_of,
				date=timezone.now(),
				marked_by=teacher,
				section=section
			)
			return Response({'session_id': session.id}, status=status.HTTP_201_CREATED)
		except Exception as e:
			print(e)
			return Response(
				{'detail': 'An error occurred while creating attendance session.'},
				status=status.HTTP_400_BAD_REQUEST
			)


@extend_schema(tags=["Attendance"])
class AttendanceSessionDetailView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request, session_id):
		user = request.user
		if not user.has_role('teacher'):
			return Response({'message': 'You dont have enough permission.'}, status=status.HTTP_403_FORBIDDEN)

		try:
			attendance_record = AttendanceRecord.objects.filter(session_id=session_id)
			serializer = AttendanceRecordGetSerializer(attendance_record, many=True)
			return Response(serializer.data, status=status.HTTP_200_OK)
		except Exception as e:
			print(e)
			return Response(
				{'detail': 'An error occurred while retrieving attendance session.'},
				status=status.HTTP_400_BAD_REQUEST
			)


class AttendanceRecordUpdateView(APIView):
	permission_classes = [IsAuthenticated]

	def put(self, request):
		if not request.user.has_role('teacher'):
			return Response({'detail': 'You do not have permission.'}, status=status.HTTP_403_FORBIDDEN)

		data_list = request.data

		for item in data_list:
			record_id = item.get('id')
			if not record_id:
				return Response(
					{'detail': 'Each record must include its "id".'},
					status=status.HTTP_400_BAD_REQUEST
				)

			try:
				record = AttendanceRecord.objects.get(id=record_id)
			except AttendanceRecord.DoesNotExist:
				return Response(
					{'detail': f'AttendanceRecord with id={record_id} not found.'},
					status=status.HTTP_404_NOT_FOUND
				)

			record.status = item.get('status', record.status)
			record.remarks = item.get('remarks', record.remarks)
			record.save()

		return Response(status=status.HTTP_204_NO_CONTENT)


class AttendanceRecordIndividualUpdate(APIView):
	permission_classes = [IsAuthenticated]

	def post(self, request):
		if not request.user.has_role('teacher'):
			return Response({'error': 'You do not have permission.'}, status=status.HTTP_403_FORBIDDEN)

		try:
			session = AttendanceSession.objects.get(id=request.data.get('session'))
			student = Student.objects.get(id=request.data.get('student'))
			attendance_record = AttendanceRecord.objects.get(session=session, student=student)
			attendance_record.status = request.data.get('status')
			attendance_record.remarks = request.data.get('remarks')
			attendance_record.save()
			return Response({'message': 'Attendance record updated successfully.'}, status=status.HTTP_200_OK)
		except Exception as e:
			print(e)
			return Response({'error': 'An error occurred while updating attendance record.'},
			                status=status.HTTP_400_BAD_REQUEST)


@extend_schema(tags=["Attendance"])
class AttendanceRecordViewSet(ModelViewSet):
	http_method_names = ['post', 'get']
	permission_classes = [IsAuthenticated]
	queryset = AttendanceRecord.objects.none()
	serializer_class = AttendanceRecordGetSerializer

	def get_serializer_class(self):
		if self.action == 'create':
			return AttendanceRecordPostSerializer
		return AttendanceRecordGetSerializer

	def get_queryset(self):
		try:
			selected_date = self.request.query_params.get('selected_date')
			selected_class = self.request.query_params.get('selected_class')
			selected_section = self.request.query_params.get('selected_section')
			attendanceSession = AttendanceSession.objects.get(date=selected_date, school_class_id=selected_class,
			                                                  section_id=selected_section)
			return AttendanceRecord.objects.filter(session=attendanceSession)
		except Exception as e:
			print(e)
			return AttendanceRecord.objects.none()


@extend_schema(tags=["Attendance"])
class AttendanceRecordSearchView(APIView):
	permission_classes = [AllowAny]

	@extend_schema(
		parameters=[
			OpenApiParameter(
				name='search',
				location=OpenApiParameter.QUERY,
				required=True,
				type=str,
				description='Search for student name or roll number'
			)
		],
		responses={
			200: OpenApiExample(
				'Success',
				value={
					'detail': 'Search results returned successfully.'
				}
			),
			400: OpenApiExample(
				'Bad Request',
				value={
					'detail': 'Please provide a search value.'
				}
			)
		}
	)
	def get(self, request):
		search_query = request.query_params.get('search')
		try:
			student = Enrollment.objects.filter(Q(student__first_name__icontains=search_query) | Q(
				student__last_name__icontains=search_query)).distinct()
			record = AttendanceRecord.objects.filter(enrollment__in=student).distinct()
			serializer = AttendanceRecordGetSerializer(record, many=True)
			return Response(serializer.data, status=status.HTTP_200_OK)
		except Exception as e:
			print(e)
			return Response(
				{'detail': 'An error occurred while searching attendance records.'},
				status=status.HTTP_400_BAD_REQUEST
			)


@extend_schema(tags=["Attendance"])
class TeacherStudentAttendanceView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request):
		user = request.user
		try:
			if user.has_role("teacher"):
				selected_date = self.request.query_params.get('selected_date')
				staff = Staff.objects.get(email=request.user.email)
				teacher = Teacher.objects.get(staff=staff)
				teacher_class = SchoolClass.objects.filter(section__class_teacher=teacher).distinct()
				attendanceSession = AttendanceSession.objects.filter(date=selected_date,
				                                                     school_class__in=teacher_class).distinct()
				attendance_records = AttendanceRecord.objects.filter(session__in=attendanceSession).distinct()
				serializer = AttendanceRecordGetSerializer(attendance_records, many=True)
				return Response(serializer.data, status=status.HTTP_200_OK)
			elif user.has_role("student"):
				student = Student.objects.get(email=request.user.email)
				enrollment = Enrollment.objects.filter(student=student).first()
				if not enrollment:
					return Response(
						{'detail': 'No enrollment found for this student.'},
						status=status.HTTP_404_NOT_FOUND
					)
				selected_date = self.request.query_params.get('selected_date')
				attendanceSession = AttendanceSession.objects.filter(
					date=selected_date,
					school_class=enrollment.school_class,
					section=enrollment.section
				).distinct()
				attendance_records = AttendanceRecord.objects.filter(session__in=attendanceSession,
				                                                     student__email=student.email).distinct()
				serializer = AttendanceRecordGetSerializer(attendance_records, many=True)
				return Response(serializer.data, status=status.HTTP_200_OK)
		except Exception as e:
			print(e)
			return Response(
				{'detail': 'An error occurred while retrieving attendance records.'},
				status=status.HTTP_400_BAD_REQUEST
			)


class TeacherAttendanceSessionCreateAPIView(APIView):
	pass


class TeacherStudentList(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request):
		if not request.user.has_role('admin') and not request.user.has_role('teacher'):
			return Response(
				{'detail': 'You do not have permission to view students.'},
				status=status.HTTP_403_FORBIDDEN
			)
		try:
			staff = Staff.objects.get(email=request.user)
			teacher = Teacher.objects.get(staff=staff)
			queryset = queryset = Student.objects.filter(
				enrollments__school_class__teachers=teacher).distinct().prefetch_related('enrollments')
			serializer = ListStudentSerializer(queryset, many=True, context={'request': request})
			return Response(serializer.data, status=status.HTTP_200_OK)
		except Exception as e:
			return Response(
				{'detail': 'An error occurred while retrieving students.'},
				status=status.HTTP_400_BAD_REQUEST
			)


@extend_schema(tags=['Assignment'])
class AssignmentViewSet(ModelViewSet):
	http_method_names = ['get', 'post', 'delete', 'put']
	permission_classes = [AllowAny]
	queryset = Assignment.objects.all()

	def get_serializer_class(self):
		if self.action == 'create':
			return AssignmentPostSerializer
		elif self.action == 'retrieve':
			return TeacherAssignmentDetailSerializer
		elif self.action == 'update':
			return AssignmentUpdateSerializer
		return TeacherAssignmentGetSerializer

	def get_queryset(self):
		if self.request.user.has_role('admin'):
			return Assignment.objects.all().order_by('created_at')
		elif self.request.user.has_role('teacher'):
			teacher = Teacher.objects.get(staff__email=self.request.user.email)
			return Assignment.objects.filter(teacher=teacher).order_by('created_at')
		elif self.request.user.has_role('student'):
			student = Student.objects.get(email=self.request.user.email)
			enrollment = Enrollment.objects.filter(student=student).first()
			if enrollment:
				return Assignment.objects.filter(school_class=enrollment.school_class,
				                                 section=enrollment.section).order_by('created_at')
			return Assignment.objects.none()

	def create(self, request, *args, **kwargs):
		try:
			with transaction.atomic():
				serializer = self.get_serializer(data=request.data, partial=True)
				serializer.is_valid(raise_exception=True)
				assignment = serializer.save()

				file = request.FILES.get('file')
				if file:
					AssignmentAttachment.objects.create(
						assignment=assignment,
						file=file
					)

				return Response(serializer.data, status=status.HTTP_201_CREATED)
		except Exception as e:
			return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

	def update(self, request, *args, **kwargs):
		try:
			with transaction.atomic():
				instance = self.get_object()
				serializer = self.get_serializer(instance=instance, data=request.data, partial=True)
				serializer.is_valid(raise_exception=True)
				assignment = serializer.save()

				file = request.FILES.get('file')
				if file:
					attachment = AssignmentAttachment.objects.filter(assignment=assignment).first()
					if attachment:
						attachment.file = file
						attachment.save()
					else:
						AssignmentAttachment.objects.create(
							assignment=assignment,
							file=file
						)
				else:
					attachment = AssignmentAttachment.objects.filter(assignment=assignment).first()
					if attachment:
						attachment.delete()

				return Response(serializer.data, status=status.HTTP_200_OK)
		except Exception as e:
			print(e)
			return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(tags=['Assignment'])
class GradeAssignmentApiView(APIView):
	permission_classes = [IsAuthenticated]

	@extend_schema(
		description="Grade an assignment submission. Only accessible by users with the 'teacher' role.",
		request=None,
		parameters=[
			OpenApiParameter(
				name='submission_id',
				required=True,
				type=uuid.UUID,
			),
			OpenApiParameter(
				name='marks',
				required=True,
				type=int,
			)
		],
		responses={
			200: OpenApiResponse(
				response={'detail': 'Assignment graded successfully.'},
				description='Successful grading of the assignment.'
			),
			403: OpenApiResponse(
				response={'detail': 'You do not have permission to grade assignments.'},
				description='Forbidden access for non-teachers.'
			),
			400: OpenApiResponse(
				response={'detail': 'An error occurred while grading the assignment.'},
				description='Bad request due to validation errors or other issues.'
			)
		}
	)
	def put(self, request):
		if not request.user.has_role('teacher'):
			return Response(
				{'detail': 'You do not have permission to grade assignments.'},
				status=status.HTTP_403_FORBIDDEN
			)

		try:
			submission_id = request.data.get('submission_id')
			marks = request.data.get('marks')

			submission = Submission.objects.get(id=submission_id)
			submission.marks = marks
			submission.status = 'g'
			submission.save()

			return Response({'detail': 'Assignment graded successfully.'}, status=status.HTTP_200_OK)
		except Exception as e:
			print(e)
			return Response(
				{'detail': 'An error occurred while grading the assignment.'},
				status=status.HTTP_400_BAD_REQUEST
			)


@extend_schema(tags=['Assignment'])
class AssignmentFormGetApiView(APIView):
	permission_classes = [AllowAny]

	def get(self, request):
		try:
			user = request.user
			staff = Staff.objects.get(email=user.email)
			teacher = Teacher.objects.get(staff=staff)
			classes = teacher.school_class.all()
			serializer = AssignmentFormGetSerializer(classes, many=True)
			return Response(serializer.data, status=status.HTTP_200_OK)
		except Exception as e:
			print(e)
			return Response(
				{'detail': 'An error occurred while retrieving assignment form data.'},
				status=status.HTTP_400_BAD_REQUEST
			)


@extend_schema(tags=['Parent'])
class ParentDetailView(APIView):
	permission_classes = [AllowAny]

	def get(self, request, parent_id: None):
		try:
			print('parent_id', parent_id)
			parent = Parent.objects.get(id=parent_id)
			student = Student.objects.filter(
				Q(father=parent) | Q(mother=parent) | Q(guardian=parent)
			).distinct().prefetch_related('enrollments')
			serializer = ParentDetailSerializer(parent, context={'request': request})
			return Response(serializer.data, status=status.HTTP_200_OK)
		except Exception as e:
			print(e)
			return Response(
				{'detail': 'An error occurred while retrieving parent details.'},
				status=status.HTTP_400_BAD_REQUEST
			)


@extend_schema(tags=['Exam'])
class ExamViewSet(ModelViewSet):
	http_method_names = ['get', 'post', 'delete', 'put']
	permission_classes = [AllowAny]
	queryset = Exam.objects.all().order_by('created_at')
	serializer_class = ExamSerializer
	lookup_field = 'id'

	def get_serializer_class(self):
		if self.action == 'create' or self.action == 'update':
			return ExamPostSerializer
		return ExamSerializer

	def get_queryset(self):
		if self.request.user.has_role('admin'):
			return Exam.objects.all()
		elif self.request.user.has_role('student'):
			student = Student.objects.get(email=self.request.user.email)
			return Exam.objects.filter(
				school_class__in=student.enrollments.values_list('school_class', flat=True)).distinct()
		elif self.request.user.has_role('teacher'):
			staff = Staff.objects.get(email=self.request.user.email)
			teacher = Teacher.objects.get(staff=staff)
			return Exam.objects.filter(school_class__in=teacher.school_class.all()).distinct()
		elif self.request.user.has_role('parent'):
			parent = Parent.objects.get(email=self.request.user.email)
			student = Student.objects.filter(
				Q(father=parent) | Q(mother=parent) | Q(guardian=parent)
			).distinct().prefetch_related('enrollments')
			return Exam.objects.filter(
				school_class__in=student.values_list('enrollments__school_class', flat=True)).distinct()


@extend_schema(tags=['Exam'])
class ExamFormViewSet(ModelViewSet):
	permission_classes = [AllowAny]
	http_method_names = ['get']
	queryset = SchoolClass.objects.all()
	serializer_class = ExamFormSerializer


@extend_schema(tags=['Announcement'])
class AnnouncementViewSet(ModelViewSet):
	permission_classes = [AllowAny]
	http_method_names = ['get', 'post', 'delete', 'put']
	queryset = Announcement.objects.all()
	serializer_class = AnnouncementSerializer

	def get_serializer_class(self):
		if self.action == 'create' or self.action == 'update':
			return AnnouncementPostSerializer
		return AnnouncementSerializer


class AdminDashboard(APIView):
	permission_classes = [AllowAny]

	def get(self, request):
		try:
			total_student_active = Student.objects.filter(account_status="A").count()
			total_student_inactive = Student.objects.filter(account_status="I").count()
			total_teacher_active = Teacher.objects.filter(staff__account_status="A").count()
			total_teacher_inactive = Teacher.objects.filter(staff__account_status="I").count()
			total_parent_active = Parent.objects.count()
			total_parent_inactive = 0  # You may update this if needed

			total_staff_active = ManagementStaff.objects.filter(staff__account_status="A").count()
			total_staff_inactive = ManagementStaff.objects.filter(staff__account_status="I").count()
			total_student = Student.objects.count()
			total_boys = Student.objects.filter(gender='M').count()
			total_girls = Student.objects.filter(gender='F').count()

			classes = SchoolClass.objects.all()
			average_weekly_attendance = {}

			for school_class in classes:
				attendance_records = AttendanceRecord.objects.filter(
					session__school_class=school_class
				)
				total_attendance = attendance_records.count()

				total_sessions = AttendanceSession.objects.filter(school_class=school_class).count()
				total_students = school_class.enrollments.count()

				expected_attendance = total_sessions * total_students
				if expected_attendance > 0:
					attendance_percentage = (total_attendance / expected_attendance) * 100
				else:
					attendance_percentage = 0

				average_weekly_attendance[school_class.name] = round(attendance_percentage, 2)

			return Response({
				'total_student_active': total_student_active,
				'total_student_inactive': total_student_inactive,
				'total_teacher_active': total_teacher_active,
				'total_teacher_inactive': total_teacher_inactive,
				'total_parent_active': total_parent_active,
				'total_parent_inactive': total_parent_inactive,
				'total_staff_active': total_staff_active,
				'total_staff_inactive': total_staff_inactive,
				'total_student': total_student,
				'total_boys': total_boys,
				'total_girls': total_girls,
				'average_weekly_attendance': average_weekly_attendance
			}, status=status.HTTP_200_OK)

		except Exception as e:
			print(e)
			return Response(
				{'detail': 'An error occurred while retrieving dashboard data.'},
				status=status.HTTP_400_BAD_REQUEST
			)


@extend_schema(tags=['Attendance'])
class ParentChildAttendance(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request):
		print("Here")
		user = request.user
		parent = Parent.objects.filter(email=user.email).first()
		if not parent:
			print("Parent not found.")
			return Response(
				{'detail': 'Parent not found.'},
				status=status.HTTP_404_NOT_FOUND
			)
		child = Student.objects.filter(guardian=parent).first()
		if not child:
			print("No child found for this parent.")
			return Response(
				{'detail': 'No child found for this parent.'},
				status=status.HTTP_404_NOT_FOUND
			)
		print("Here")

		try:
			selected_date = self.request.query_params.get('selected_date')
			attendanceSession = AttendanceSession.objects.filter(
				date=selected_date,
				school_class__in=child.enrollments.values_list('school_class', flat=True),
				section__in=child.enrollments.values_list('section', flat=True)
			).distinct()
			attendance_records = AttendanceRecord.objects.filter(session__in=attendanceSession,
			                                                     student__email=child.email).distinct()
			serializer = AttendanceRecordGetSerializer(attendance_records, many=True)
			return Response(serializer.data, status=status.HTTP_200_OK)
		except Exception as e:
			print(e)
			return Response(
				{'detail': 'An error occurred while retrieving attendance records.'},
				status=status.HTTP_400_BAD_REQUEST
			)


@extend_schema(tags=['Submissions'])
class SubmissionsView(ModelViewSet):
	permission_classes = [AllowAny]
	http_method_names = ['post']
	queryset = Submission.objects.all()
	serializer_class = SubmissionSerializer

