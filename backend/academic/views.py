from django.db import transaction
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from academic.models import SchoolClass, Department
from academic.serializer import EnrollmentPostSerializer, EnrollmentGetSchoolClassSerializer, AddTeacherGetSerializer, \
	SimpleDepartmentSerializer
from user.serializer import StudentSerializer, ParentSerializer
from user.models import Parent


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
				print(enrollment_info)
				enrollment_serializer.save()

			return Response({'message': 'Student enrolled successfully'}, status=status.HTTP_201_CREATED)

		except Exception as e:
			return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class AddStaffApiView(APIView):
	permission_classes = [AllowAny]

	def get(self, request):
		try:
			staff = SchoolClass.objects.all()
			serializer = AddTeacherGetSerializer(staff, many=True)
			departments = SimpleDepartmentSerializer(Department.objects.all(), many=True)
			return Response({'staff': serializer.data, 'departments': departments.data}, status=status.HTTP_200_OK)
		except Exception as e:
			return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

	def post(self, request):
		try:
			with transaction.atomic():
				pass
		except Exception as e:
			return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)