from rest_framework import serializers
from academic.models import Enrollment, AcademicYear, SchoolClass, Section, House, Subject, Department, Routine, \
	AttendanceSession, AttendanceRecord, Assignment, Exam, Announcement, Submission, AssignmentAttachment
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


class SchoolClassRetrieveSerializer(serializers.ModelSerializer):
	class InlineSectionSerializer(serializers.ModelSerializer):
		class InlineHouseSerializer(serializers.ModelSerializer):
			class Meta:
				model = House
				fields = [
					'id',
					'color',
				]

		class InlineClassTeacherSerializer(serializers.ModelSerializer):
			profile_picture = serializers.SerializerMethodField()
			full_name = serializers.StringRelatedField(source='staff.get_full_name')
			email = serializers.StringRelatedField(source='staff.email')
			phone = serializers.StringRelatedField(source='staff.phone_number')

			class Meta:
				model = Teacher
				fields = [
					'id',
					'profile_picture',
					'full_name',
					'email',
					'phone',
				]

			def get_profile_picture(self, obj):
				context = self.context
				if obj.staff.profile_picture:
					return f"{context['request'].build_absolute_uri(obj.staff.profile_picture.url)}"
				return None

		house = InlineHouseSerializer(many=True)
		class_teacher = InlineClassTeacherSerializer()
		student_count = serializers.SerializerMethodField()

		class Meta:
			model = Section
			fields = [
				'id',
				'name',
				'class_teacher',
				'student_count',
				'house',
			]

		def get_student_count(self, obj):
			return obj.enrollments.count()

	section = InlineSectionSerializer(many=True)

	class Meta:
		model = SchoolClass
		fields = [
			'id',
			'name',
			'section',
		]


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
	present_days = serializers.SerializerMethodField()

	class Meta:
		model = AttendanceRecord
		fields = [
			'id',
			'session',
			'student',
			'status',
			'remarks',
			'present_days',
		]

	def get_present_days(self, obj):
		return obj.student.get_total_present()


class AttendanceSessionDetailViewUpdateSerializer(serializers.ModelSerializer):
	class Meta:
		model = AttendanceRecord
		fields = [
			'id',
			'session',
			'student',
			'status',
			'remarks'
		]

	def update(self, instance, validated_data):
		instance.status = validated_data.get('status', instance.status)
		instance.remarks = validated_data.get('remarks', instance.remarks)
		instance.save()
		return instance


class TeacherAssignmentGetSerializer(serializers.ModelSerializer):
	subject = SimpleSubjectSerializer()
	school_class = SimpleSchoolClassSerializer()
	section = SimpleSectionSerializer()
	total_students = serializers.SerializerMethodField()
	total_submissions = serializers.SerializerMethodField()

	class Meta:
		model = Assignment
		fields = [
			'id',
			'title',
			'description',
			'due_date',
			'subject',
			'school_class',
			'section',
			'is_active',

			'total_students',
			'total_submissions',
		]

	def get_total_students(self, obj):
		return obj.school_class.enrollments.count() if hasattr(obj, 'school_class') else 0

	def get_total_submissions(self, obj):
		return obj.submissions.count() if hasattr(obj, 'submissions') else 0


class SimpleStudentSerializer(serializers.ModelSerializer):
	full_name = serializers.SerializerMethodField()

	class Meta:
		model = Student
		fields = [
			'id',
			'full_name'
		]

	def get_full_name(self, obj):
		return f"{obj.first_name} {obj.last_name}"


class TeacherAssignmentDetailSerializer(serializers.ModelSerializer):
	class InlineSubmissionSerializer(serializers.ModelSerializer):
		student = SimpleStudentSerializer()
		status = serializers.StringRelatedField(source='get_status_display')

		class Meta:
			model = Submission
			fields = [
				'id',
				'student',
				'submission_date',
				'file',
				'status',
				'marks',
			]

	class InlineSubjectSerializer(serializers.ModelSerializer):
		class Meta:
			model = Subject
			fields = [
				'id',
				'name',
				'full_marks',
				'pass_marks',
			]

	class InlineAttachmentSerializer(serializers.ModelSerializer):
		class Meta:
			model = AssignmentAttachment
			fields = [
				'id',
				'file',
			]

	subject = InlineSubjectSerializer()
	school_class = SimpleSchoolClassSerializer()
	section = SimpleSectionSerializer()
	total_students = serializers.SerializerMethodField()
	total_submissions = serializers.SerializerMethodField()
	submissions = InlineSubmissionSerializer(many=True)
	attachments = InlineAttachmentSerializer(many=True, required=False)

	class Meta:
		model = Assignment
		fields = [
			'id',
			'title',
			'description',
			'due_date',
			'subject',
			'school_class',
			'section',
			'attachments',
			'is_active',

			'total_students',
			'total_submissions',

			'submissions',
			'created_at',
		]

	def get_total_students(self, obj):
		return obj.school_class.enrollments.count() if hasattr(obj, 'school_class') else 0

	def get_total_submissions(self, obj):
		return obj.submissions.count() if hasattr(obj, 'submissions') else 0


class AssignmentUpdateSerializer(serializers.ModelSerializer):
	class Meta:
		model = Assignment
		fields = [
			'title',
			'description',
			'is_active',
		]


class AssignmentFormGetSerializer(serializers.ModelSerializer):
	section = SimpleSectionSerializer(many=True)
	subjects = SimpleSubjectSerializer(many=True)

	class Meta:
		model = SchoolClass
		fields = [
			'id',
			'name',
			'section',
			'subjects',
		]


class AssignmentPostSerializer(serializers.ModelSerializer):
	class Meta:
		model = Assignment
		fields = [
			'title',
			'description',
			'due_date',

			'school_class',
			'section',
			'subject',
			'is_active',
		]

	def create(self, validated_data):
		user = self.context['request'].user
		staff = Staff.objects.get(email=user.email)
		teacher = Teacher.objects.get(staff=staff)
		validated_data['teacher'] = teacher
		return super().create(validated_data)


class ClassTeacherApiSerializer(serializers.ModelSerializer):
	full_name = serializers.SerializerMethodField()
	subject = serializers.StringRelatedField(source='subject.name')

	class Meta:
		model = Teacher
		fields = [
			'id',
			'full_name',
			'subject'
		]

	def get_full_name(self, obj):
		return obj.staff.get_fullname()


class ExamSerializer(serializers.ModelSerializer):
	subject = serializers.StringRelatedField(source='subject.name')
	school_class = serializers.StringRelatedField(source='school_class.name')

	class Meta:
		model = Exam
		fields = [
			'id',
			'exam_date',
			'start_time',
			'end_time',
			'subject',
			'school_class',
			'exam_type',
			'created_at'
		]


class ExamPostSerializer(serializers.ModelSerializer):
	class Meta:
		model = Exam
		fields = [
			'exam_date',
			'start_time',
			'end_time',
			'subject',
			'school_class',
			'exam_type',
		]


class ExamFormSerializer(serializers.ModelSerializer):
	subjects = SimpleSubjectSerializer(many=True)
	section = SimpleSectionSerializer(many=True)

	class Meta:
		model = SchoolClass
		fields = [
			'id',
			'name',
			'section',
			'subjects',
		]


class AnnouncementSerializer(serializers.ModelSerializer):
	school_class = SimpleSchoolClassSerializer()

	class Meta:
		model = Announcement
		fields = "__all__"


class AnnouncementPostSerializer(serializers.ModelSerializer):
	class Meta:
		model = Announcement
		fields = [
			'title',
			'description',
			'school_class',
			'public_access',
			'priority',
		]


class SubmissionSerializer(serializers.ModelSerializer):
	class Meta:
		model = Submission
		fields = [
			'assignment',
			'file',
		]

	def save(self, **kwargs):
		user = self.context['request'].user
		student = Student.objects.get(email=user.email)
		self.validated_data['student'] = student
		return super().save(**kwargs)