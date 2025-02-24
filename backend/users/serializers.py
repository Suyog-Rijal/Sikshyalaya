from .models import *
from rest_framework import serializers


class AcademicYearGetSerializer(serializers.ModelSerializer):
	class Meta:
		model = AcademicYear
		fields = ['id', 'start_date', 'end_date', 'name', 'is_active']


class EnrollmentGetSerializer(serializers.Serializer):
	class Meta:
		model = Enrollment
		fields = []