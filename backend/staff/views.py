import time

from drf_spectacular.utils import extend_schema
from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from staff.serializer import ListStaffSerializer, StaffSerializer
from user.models import Staff


@extend_schema(tags=['Staff'])
class StaffViewSet(viewsets.ModelViewSet):
	http_method_names = ['get']
	permission_classes = [AllowAny]
	queryset = Staff.objects.all()

	def get_serializer_class(self):
		if self.action == 'list':
			return ListStaffSerializer
		elif self.action == 'retrieve':
			return StaffSerializer
		elif self.action == 'create':
			return StaffSerializer
		return ListStaffSerializer


