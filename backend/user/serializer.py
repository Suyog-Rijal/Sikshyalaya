from rest_framework import serializers

from academic.models import Enrollment
from .models import Student, Parent, Leave, CustomUser


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


class ParentDetailStudentSerializer(serializers.ModelSerializer):
	class Meta:
		model = Student
		fields = "__all__"

		read_only_fields = ['created_at', 'updated_at']
		extra_kwargs = {
			'password': {'write_only': True},
		}


class ParentDetailSerializer(serializers.ModelSerializer):
	class Meta:
		model = Parent
		fields = '__all__'

		read_only_fields = ['created_at', 'updated_at']
		extra_kwargs = {
			'password': {'write_only': True},
		}

	def get_fields(self):
		fields = super().get_fields()
		fields['children'] = serializers.SerializerMethodField()
		return fields

	def get_children(self, obj):
		students = Student.objects.filter(
			guardian=obj
		)
		serializer = ParentDetailStudentSerializer(students, many=True, context=self.context)
		return serializer.data


class AllLeaveSerializer(serializers.ModelSerializer):
	class Meta:
		model = Leave
		fields = "__all__"


class LeaveMeSerializer(serializers.ModelSerializer):
	leave_status = serializers.CharField(source='get_leave_status_display')

	class Meta:
		model = Leave
		fields = [
			'id',
			'start_date',
			'end_date',
			'leave_reason',
			'leave_status',
			'created_at'
		]


class LeaveMePostSerializer(serializers.ModelSerializer):
	class Meta:
		model = Leave
		fields = [
			'start_date',
			'end_date',
			'leave_reason',
		]

	def create(self, validated_data):
		user = self.context['request'].user
		student = Student.objects.get(email=user.email)
		leave = Leave.objects.create(student=student, **validated_data)
		return leave


class LeaveGetSerializer(serializers.ModelSerializer):
	class InlineStudentSerializer(serializers.ModelSerializer):
		full_name = serializers.SerializerMethodField()

		class Meta:
			model = Student
			fields = [
				'id',
				'full_name'
			]

		def get_full_name(self, obj):
			return obj.get_fullname()

	student = InlineStudentSerializer()

	class Meta:
		model = Leave
		fields = "__all__"


class LeaveUpdateSerializer(serializers.ModelSerializer):
	class Meta:
		model = Leave
		fields = [
			'leave_status',
		]


class MeEnrollmentSerializer(serializers.ModelSerializer):
	class Meta:
		model = Enrollment
		fields = "__all__"


class MeSerializer(serializers.ModelSerializer):
	enrollments = MeEnrollmentSerializer()

	class Meta:
		model = Student
		fields = [
			'id',
			'first_name',
			'last_name',
			'permanent_address',
			'current_address',
			'personal_email',
			'phone_number',
			'enrollments',
		]
