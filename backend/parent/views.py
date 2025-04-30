from django.shortcuts import render
from drf_spectacular.utils import extend_schema
from rest_framework.response import Response
from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from user.models import Parent, Staff, Teacher
from .serializers import ParentListSerializer, ParentDetailSerializer
from rest_framework.views import APIView


@extend_schema(tags=['Parent'])
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


@extend_schema(tags=['Parent'])
class ParentDetailView(APIView):
	http_method_names = ['get']

	def get(self, request):
		user = request.user
		try:
			parent = Parent.objects.get(email=user.email)
			serializer = ParentDetailSerializer(parent)
			return Response(serializer.data, status=status.HTTP_200_OK)
		except Exception as ex:
			print(ex)
			return Response({'error': 'Parent not found'}, status=status.HTTP_404_NOT_FOUND)

