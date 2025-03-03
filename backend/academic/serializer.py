from .models import AcademicYear, Class, House, Section, Subject
from rest_framework.serializers import ModelSerializer, Serializer


class AcademicYearSerializer(ModelSerializer):
	class Meta:
		model = AcademicYear
		fields = [
			'id',
			'year',
			'created_at',
		]


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
	academic_year = AcademicYearSerializer()
	classes = EnrollmentGetClassSerializer(many=True)
	sections = EnrollmentGetSectionSerializer(many=True)

	class Meta:
		fields = [
			'academic_year',
			'classes',
			'sections',
			'houses',
		]
