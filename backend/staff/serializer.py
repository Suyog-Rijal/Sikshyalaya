from academic.models import Subject
from academic.serializer import SimpleSubjectSerializer
from user.models import Staff
from rest_framework import serializers


class StaffSerializer(serializers.ModelSerializer):
	gender = serializers.CharField(source='get_gender_display')
	marital_status = serializers.CharField(source='get_marital_status_display')
	transportation = serializers.CharField(source='get_transportation_display')
	position_detail = serializers.SerializerMethodField()

	class Meta:
		model = Staff
		fields = '__all__'
		extra_fields = [
			'position_detail',
		]

	def get_position_detail(self, obj):
		if obj.staff_type == 'T':
			teacher = obj.teacher.first()
			return {
				'school_class': teacher.school_class.name,
				'subject': SimpleSubjectSerializer(teacher.subject).data,
			}
		elif obj.staff_type == 'M':
			management = obj.management_staff.first()
			return {
				'department': management.department.name,
			}

		return None


class ListStaffSerializer(serializers.ModelSerializer):
	position_detail = serializers.SerializerMethodField()

	class Meta:
		model = Staff
		fields = [
			'id',
			'account_status',
			'first_name',
			'last_name',
			'email',
			'staff_type',
			'position_detail',
			'phone_number',
			'profile_picture',
		]

	def get_position_detail(self, obj):
		if obj.staff_type == 'T':
			teacher = obj.teacher.first()
			return {
				'school_class': teacher.school_class.name,
				'subject': teacher.subject.name,
			}
		elif obj.staff_type == 'M':
			management = obj.management_staff.first()
			return {
				'department': management.department.name,
			}

		return None
