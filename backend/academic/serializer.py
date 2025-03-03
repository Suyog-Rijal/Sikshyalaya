from .models import Class, House, Section
from rest_framework.serializers import ModelSerializer, Serializer


class EnrollmentGetHouseSerializer(ModelSerializer):
	class Meta:
		model = House
		fields = [
			'id',
			'name',
		]


class EnrollmentGetSectionSerializer(ModelSerializer):
	houses = EnrollmentGetHouseSerializer(many=True)

	class Meta:
		model = Section
		fields = [
			'id',
			'name',
			'_class',
			'houses',
		]


class EnrollmentGetClassSerializer(ModelSerializer):
	class Meta:
		model = Class
		fields = [
			'id',
			'name',
		]


class EnrollmentGetSerializer(Serializer):
	classes = EnrollmentGetClassSerializer(many=True)
	sections = EnrollmentGetSectionSerializer(many=True)

	class Meta:
		fields = [
			'academic_year',
			'classes',
			'sections',
			'houses',
		]
