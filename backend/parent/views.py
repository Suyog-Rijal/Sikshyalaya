from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from user.models import Parent, Staff, Teacher
from .serializers import ParentListSerializer


class ParentViewSet(ModelViewSet):
	http_method_names = ['get']
	queryset = Parent.objects.filter(relationship='G')
	serializer_class = ParentListSerializer

	def get_queryset(self):
		if self.request.user.has_role('admin'):
			return Parent.objects.filter(relationship='G')
		elif self.request.user.has_role('teacher'):
			staff = Staff.objects.get(email=self.request.user)
			teacher = Teacher.objects.get(staff=staff)
			classes = teacher.school_class.all()
			print("Staff: ", staff)
			print("Teacher: ", teacher)
			print("Classes: ", classes)
			return Parent.objects.filter(relationship='G', guardian_of__enrollments__school_class__in=classes).distinct()
