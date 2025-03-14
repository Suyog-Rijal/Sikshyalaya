import time

from rest_framework import viewsets
from staff.serializer import ListStaffSerializer, StaffSerializer
from user.models import Staff


class StaffViewSet(viewsets.ModelViewSet):
	http_method_names = ['get']
	queryset = Staff.objects.all()

	def get_serializer_class(self):
		if self.action == 'list':
			return ListStaffSerializer
		elif self.action == 'retrieve':
			return StaffSerializer
		elif self.action == 'create':
			return StaffSerializer
		return ListStaffSerializer


