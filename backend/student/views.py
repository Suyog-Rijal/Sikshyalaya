import time

from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from student.serializer import ListStudentSerializer
from user.models import Student, CustomUser
from user.serializer import StudentSerializer


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
