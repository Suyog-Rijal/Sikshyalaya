import time

from django.shortcuts import render
from rest_framework import viewsets

from student.serializer import ListStudentSerializer
from user.models import Student
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
