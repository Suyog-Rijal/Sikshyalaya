import time

from django.shortcuts import render
from drf_spectacular.utils import extend_schema
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from student.serializer import ListStudentSerializer
from user.models import Student, CustomUser
from user.serializer import StudentSerializer, StudentDetailSerializer


@extend_schema(tags=['Student'])
class StudentViewSet(viewsets.ModelViewSet):
	http_method_names = ['get']
	queryset = Student.objects.all().prefetch_related('enrollments')

	def get_serializer_class(self):
		if self.action == 'list':
			return ListStudentSerializer
		elif self.action == 'retrieve':
			return StudentSerializer
		elif self.action == 'create':
			return StudentSerializer
		return ListStudentSerializer


@extend_schema(tags=['Student'])
class StudentDetailView(APIView):
	permission_classes = [AllowAny]

	def get(self, request, student_id):
		student = Student.objects.filter(id=student_id).first()
		if not student:
			return Response({'error': 'Student not found.'}, status=status.HTTP_404_NOT_FOUND)

		try:
			serializer = StudentDetailSerializer(student, context={'request': request})
			return Response(serializer.data, status=status.HTTP_200_OK)
		except Exception as ex:
			return Response({'error': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@extend_schema(tags=['Student'])
class StudentDeleteApiView(APIView):
	permission_classes = [IsAuthenticated]

	def post(self, request):
		student_id = request.data.get('id')
		student = Student.objects.filter(id=student_id).first()
		if not student:
			return Response({'error': 'Student not found'}, status=404)

		try:
			user = CustomUser.objects.get(email=student.email)
			student.delete()
			user.delete()
			return Response({'message': 'Student deleted successfully'}, status=200)
		except Exception as e:
			return Response({'error': 'Something went wrong!'}, status=500)

