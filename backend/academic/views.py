from django.db import transaction
from django.core.exceptions import ValidationError
from django.db.models import Prefetch
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from academic.models import SchoolClass, Department, Section, Subject, Routine, AttendanceSession
from academic.serializer import EnrollmentPostSerializer, EnrollmentGetSchoolClassSerializer, AddStaffGetSerializer, \
	SimpleDepartmentSerializer, AddStaffSerializer, SimpleTeacherSerializer, SimpleManagementStaffSerializer, \
	SchoolClassGetSerializer, SchoolClassPostSerializer, SubjectListSerializer, RoutineSerializer, \
	SimpleSchoolClassSerializer, SimpleSubjectSerializer, SimpleStaffSerializer, RoutineSchoolClassGetSerializer, \
	RoutineTeacherGetSerializer, RoutinePostSerializer, AttendanceSessionSerializer
from user.serializer import StudentSerializer, ParentSerializer
from user.models import Parent, Teacher, Staff
from drf_spectacular.utils import extend_schema


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

			return Response({'message': 'Student enrolled successfully'}, status=status.HTTP_201_CREATED)

		except Exception as e:
			return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class AddStaffApiView(APIView):
	permission_classes = [AllowAny]

	def get(self, request):
		try:
			staff = SchoolClass.objects.all()
			serializer = AddStaffGetSerializer(staff, many=True)
			departments = SimpleDepartmentSerializer(Department.objects.all(), many=True)
			return Response({'staff': serializer.data, 'departments': departments.data}, status=status.HTTP_200_OK)
		except Exception as e:
			return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

	def post(self, request):
		try:
			with transaction.atomic():
				print(request.data)
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

				return Response({'message': 'Staff added successfully'}, status=status.HTTP_201_CREATED)

		except Exception as e:
			return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


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


class SubjectApiView(APIView):
	permission_classes = [AllowAny]

	def get(self, request, id=None):
		try:
			print("user")
			print(request.user)
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
							print('New data:', subject_data)
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


@extend_schema(tags=["Attendance Session"])
class AttendanceSessionViewset(ModelViewSet):
	permission_classes = [IsAuthenticated]
	queryset = AttendanceSession.objects.all()
	serializer_class = AttendanceSessionSerializer