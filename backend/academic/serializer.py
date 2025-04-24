from rest_framework import serializers
from academic.models import Enrollment, AcademicYear, SchoolClass, Section, House, Subject, Department, Routine, \
	AttendanceSession, AttendanceRecord
from user.models import Staff, Teacher, ManagementStaff, Student


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
			'previous_workplace_phone_number',
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


class TeacherRoutineSerializer(serializers.ModelSerializer):
	name = serializers.SerializerMethodField()

	class Meta:
		model = Teacher
		fields = [
			'id',
			'name',
		]

	def get_name(self, obj):
		return f'{obj.staff.first_name} {obj.staff.last_name}'


class RoutineSerializer(serializers.ModelSerializer):
	school_class = SimpleSchoolClassSerializer()
	section = SimpleSectionSerializer()
	subject = SimpleSubjectSerializer()
	teacher = TeacherRoutineSerializer()

	class Meta:
		model = Routine
		fields = [
			'id',
			'school_class',
			'section',
			'subject',
			'teacher',
			'day',
			'start_time',
			'end_time',
		]


class SimpleStaffSerializer(serializers.ModelSerializer):
	class Meta:
		model = Staff
		fields = [
			'id',
			'first_name',
			'last_name',
		]


class RoutineTeacherGetSerializer(serializers.ModelSerializer):
	first_name = serializers.CharField(source='staff.first_name')
	last_name = serializers.CharField(source='staff.last_name')

	class Meta:
		model = Teacher
		fields = [
			'id',
			'first_name',
			'last_name',
		]


class RoutineSubjectGetSerializer(serializers.ModelSerializer):
	teacher = serializers.SerializerMethodField()

	class Meta:
		model = Subject
		fields = [
			'id',
			'name',
			'teacher'
		]

	def get_teacher(self, obj):
		subject_name = obj.name.strip().lower()
		teachers = Teacher.objects.filter(subject__name__iexact=subject_name, school_class=obj.school_class)
		if teachers.exists():
			return RoutineTeacherGetSerializer(teachers, many=True).data
		return []


class RoutineSectionGetSerializer(serializers.ModelSerializer):
	class Meta:
		model = Section
		fields = [
			'id',
			'name',
		]


class RoutineSchoolClassGetSerializer(serializers.ModelSerializer):
	section = RoutineSectionGetSerializer(many=True)
	subjects = RoutineSubjectGetSerializer(many=True)

	class Meta:
		model = SchoolClass
		fields = [
			'id',
			'name',
			'section',
			'subjects',
		]


class RoutinePostSerializer(serializers.ModelSerializer):
	class Meta:
		model = Routine
		fields = [
			'school_class',
			'section',
			'subject',
			'teacher',
			'day',
			'start_time',
			'end_time',
		]


class AttendanceSessionSerializer(serializers.ModelSerializer):
	class Meta:
		model = AttendanceSession
		fields = [
			'id',
			'academic_year',
			'school_class',
			'section',
			'date',
			'marked_by'
		]
		read_only_fields = ['academic_year', 'marked_by']

	def create(self, validated_data):
		academic_year = AcademicYear.objects.get(is_active=True)
		validated_data['academic_year'] = academic_year
		user = self.context['request'].user
		staff = Staff.objects.get(email=user.email)
		teacher = Teacher.objects.get(staff=staff)
		validated_data['marked_by'] = teacher
		return super().create(validated_data)


class AttendanceRecordPostSerializer(serializers.ModelSerializer):
	class Meta:
		model = AttendanceRecord
		fields = [
			'id',
			'session',
			'student',
			'status',
			'remarks'
		]


class AttendanceRecordGetSerializer(serializers.ModelSerializer):
	class StudentInlineSerializer(serializers.ModelSerializer):
		full_name = serializers.SerializerMethodField()

		class Meta:
			model = Student
			fields = [
				'id',
				'full_name'
			]

		def get_full_name(self, obj):
			return f"{obj.first_name} {obj.last_name}"

	student = StudentInlineSerializer()

	class Meta:
		model = AttendanceRecord
		fields = [
			'id',
			'session',
			'student',
			'status',
			'remarks',
		]
