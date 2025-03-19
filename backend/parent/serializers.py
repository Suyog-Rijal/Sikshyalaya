from rest_framework import serializers

from user.models import Parent, Student


class ParentStudentListSerializer(serializers.ModelSerializer):
	full_name = serializers.CharField(source='get_fullname')

	class Meta:
		model = Student
		fields = [
			'id',
			'full_name',
			'profile_picture'
		]


class ParentListSerializer(serializers.ModelSerializer):
	guardian_of = ParentStudentListSerializer(many=True)

	class Meta:
		model = Parent
		fields = [
			'id',
			'full_name',
			'email',
			'phone_number',
			'profile_picture',
			'created_at',
			'guardian_of',
		]