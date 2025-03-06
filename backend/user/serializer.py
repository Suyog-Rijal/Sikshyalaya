from .models import Student
from rest_framework import serializers


class AddStudentSerializer(serializers.ModelSerializer):
	class Meta:
		model = Student
		fields = [
			'id',
			'first_name',
			'last_name',
			'admission_date',
			'date_of_birth',
			'gender',
			'personal_email',
			'phone_number',
			'blood_group',
			'current_address',
			'permanent_address',
			'transportation',
			'pickup_address',
			'account_status',
			'previous_school',
			'previous_school_address',
			'created_at',
			'updated_at',
		]

	def validate_gender(self, value):
		if value not in dict(Student.GENDER_CHOICES):
			raise serializers.ValidationError("Invalid gender choice.")
		return value

	def validate_blood_group(self, value):
		if value not in dict(Student.BLOOD_GROUP_CHOICES) or value == '':
			raise serializers.ValidationError("Invalid blood group choice.")
		return value

	def validate_transportation(self, value):
		if value not in dict(Student.TRANSPORTATION_CHOICES):
			raise serializers.ValidationError("Invalid transportation choice.")
		return value

	def validate_account_status(self, value):
		if value not in dict(Student.ACCOUNT_STATUS_CHOICES):
			raise serializers.ValidationError("Invalid account status choice.")
		return value
