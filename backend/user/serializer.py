from rest_framework import serializers

from academic.models import Enrollment
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

			'father',
			'mother',
			'guardian',

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


class StudentDetailSerializer(serializers.ModelSerializer):
	class InlineParentSerializer(serializers.ModelSerializer):
		class Meta:
			model = Parent
			fields = '__all__'

	father = InlineParentSerializer()
	mother = InlineParentSerializer()
	guardian = InlineParentSerializer()

	class Meta:
		model = Student
		fields = '__all__'
		read_only_fields = ['created_at', 'updated_at']
		extra_kwargs = {
			'password': {'write_only': True},
		}



class ParentSerializer(serializers.ModelSerializer):
	class Meta:
		model = Parent
		fields = [
			'id',
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
