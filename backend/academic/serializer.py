from rest_framework import serializers

from academic.models import Enrollment, AcademicYear


class EnrollmentSerializer(serializers.ModelSerializer):

	class Meta:
		model = Enrollment
		fields = [
			'id',
			'student',
			'academic_year',
			'school_class',
			'house',
			'section',
			'enrollment_date',
		]

		read_only_fields = ['academic_year']

