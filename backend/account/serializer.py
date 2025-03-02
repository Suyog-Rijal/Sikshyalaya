from .models import *
from rest_framework import serializers


class AcademicYearSerializer(serializers.ModelSerializer):
	class Meta:
		model = AcademicYear
		fields = [
			'id',
			'start_date',
			'end_date',
			'is_active',
			'created_at',
		]


class SimpleStudentHouseSerializer(serializers.ModelSerializer):
	class Meta:
		model = StudentHouse
		fields = [
			'id',
			'name',
		]


class SimpleSectionSerializer(serializers.ModelSerializer):
	house = SimpleStudentHouseSerializer(read_only=True, many=True)

	class Meta:
		model = Section
		fields = [
			'id',
			'name',
			'house',
		]


class SimpleGradeSerializer(serializers.ModelSerializer):
	sections = SimpleSectionSerializer(many=True, read_only=True)

	class Meta:
		model = Grade
		fields = [
			'id',
			'name',
			'sections',
		]
