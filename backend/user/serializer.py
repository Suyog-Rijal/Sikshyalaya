from rest_framework import serializers
from .models import Student, Parent


class StudentSerializer(serializers.ModelSerializer):
	class Meta:
		model = Student
		fields = [
			'id',
			'first_name',
			'last_name',
			'date_of_birth',
			'gender',
			'account_status',
			'blood_group',
			'personal_email',
			'phone_number',

			'current_address',
			'permanent_address',

			'transportation',
			'pickup_address',

			'previous_school',
			'previous_school_address',

			'created_at',
			'updated_at',
		]

		read_only_fields = ['created_at', 'updated_at']


class ParentSerializer(serializers.ModelSerializer):
	class Meta:
		model = Parent
		fields = [
			'id',
			'student',
			'full_name',
			'email',
			'phone_number',
			'occupation',
			'relationship',
			'guardian_relation',
			'address',

			'created_at',
			'updated_at',
		]

		read_only_fields = ['created_at', 'updated_at']