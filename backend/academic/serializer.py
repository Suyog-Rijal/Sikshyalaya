from rest_framework import serializers
from academic.models import Enrollment, AcademicYear, SchoolClass, Section, House, Subject, Department
from user.models import Staff, Teacher, ManagementStaff


class EnrollmentGetHouseSerializer(serializers.ModelSerializer):
	class Meta:
		model = House
		fields = [
			'id',
			'color',
		]


class EnrollmentGetSectionSerializer(serializers.ModelSerializer):
	house = EnrollmentGetHouseSerializer(many=True)

	class Meta:
		model = Section
		fields = [
			'id',
			'name',
			'house',
		]


class EnrollmentGetSchoolClassSerializer(serializers.ModelSerializer):
	section = EnrollmentGetSectionSerializer(many=True)

	class Meta:
		model = SchoolClass
		fields = [
			'id',
			'name',
			'section',
		]


class EnrollmentPostSerializer(serializers.ModelSerializer):
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


class SimpleSubjectSerializer(serializers.ModelSerializer):
	class Meta:
		model = Subject
		fields = [
			'id',
			'name',
		]


class SimpleDepartmentSerializer(serializers.ModelSerializer):
	class Meta:
		model = Department
		fields = [
			'id',
			'name'
		]


class AddStaffGetSerializer(serializers.ModelSerializer):
	subjects = SimpleSubjectSerializer(many=True)

	class Meta:
		model = SchoolClass
		fields = [
			'id',
			'name',
			'subjects',
		]


class AddStaffSerializer(serializers.ModelSerializer):
	class Meta:
		model = Staff
		fields = [
			'id', 'first_name', 'last_name', 'phone_number', 'staff_type', 'date_of_birth', 'permanent_address',
			'current_address',
			'marital_status', 'blood_group', 'account_status', 'personal_email', 'gender',
			'date_of_joining', 'note', 'employment_type', 'salary',
			'bank_name', 'account_holder', 'account_number', 'transportation',
			'pickup_address', 'social_facebook', 'social_instagram',
			'social_linkedin', 'social_github', 'qualification', 'experience',
			'previous_workplace', 'previous_workplace_address',
			'previous_workplace_phone_number'
		]


class SimpleTeacherSerializer(serializers.ModelSerializer):
	class Meta:
		model = Teacher
		fields = [
			'id',
			'staff',
			'school_class',
			'subject',
		]


class SimpleManagementStaffSerializer(serializers.ModelSerializer):
	class Meta:
		model = ManagementStaff
		fields = [
			'id',
			'staff',
			'department',
			'pan_number'
		]


class SimpleSectionSerializer(serializers.ModelSerializer):
	class Meta:
		model = Section
		fields = [
			'id',
			'name',
		]


class SchoolClassGetSerializer(serializers.ModelSerializer):
	section = SimpleSectionSerializer(many=True)
	no_of_students = serializers.SerializerMethodField()
	no_of_subjects = serializers.SerializerMethodField()

	class Meta:
		model = SchoolClass
		fields = '__all__'
		extra_fields = [
			'section',
			'no_of_students',
			'no_of_subjects'
		]

	def get_no_of_students(self, obj):
		return obj.enrollments.count()

	def get_no_of_subjects(self, obj):
		return obj.subjects.count()


class SchoolClassPostSerializer(serializers.ModelSerializer):
	section = SimpleSectionSerializer(many=True)

	class Meta:
		model = SchoolClass
		fields = '__all__'

	def create(self, validated_data):
		sections_data = validated_data.pop('section', [])
		school_class = SchoolClass.objects.create(**validated_data)

		for section_data in sections_data:
			Section.objects.create(school_class=school_class, **section_data)

		return school_class


class SimpleSchoolClassSerializer(serializers.ModelSerializer):
	class Meta:
		model = SchoolClass
		fields = [
			'id',
			'name',
		]


class SimpleSubjectExtendedSerializer(serializers.ModelSerializer):
	class Meta:
		model = Subject
		fields = [
			'id',
			'name',
			'full_marks',
			'pass_marks',
		]


class SubjectListSerializer(serializers.ModelSerializer):
	subjects = SimpleSubjectExtendedSerializer(many=True)

	class Meta:
		model = SchoolClass
		fields = [
			'id',
			'name',
			'subjects',
		]
