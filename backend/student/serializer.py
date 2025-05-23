from user.models import Student
from rest_framework import serializers


class ListStudentSerializer(serializers.ModelSerializer):
	gender = serializers.CharField(source='get_gender_display')
	roll_number = serializers.SerializerMethodField()
	school_class = serializers.CharField(source='get_enrollment.school_class.name')
	section = serializers.CharField(source='get_enrollment.section.name')

	class Meta:
		model = Student
		fields = [
			'id',
			'first_name',
			'last_name',
			'account_status',
			'roll_number',
			'email',
			'gender',
			'profile_picture',
			'school_class',
			'section',
			'created_at',
		]

	def get_roll_number(self, obj):
		enrollment = obj.get_enrollment()
		if enrollment:
			year = enrollment.academic_year
			short_year = str(year)[-2:]
			return f"Y{short_year}-{enrollment.roll_number}"
		return None