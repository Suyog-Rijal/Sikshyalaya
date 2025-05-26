from django.contrib import admin
from academic.models import AcademicYear, SchoolClass, Section, House, Enrollment, Subject, Department, Routine, \
	AttendanceRecord, AttendanceSession, Assignment, AssignmentAttachment, Submission, Exam, Announcement
from user.models import Leave


@admin.register(AcademicYear)
class AcademicYearAdmin(admin.ModelAdmin):
	list_display = ('id', 'start_date', 'created_at', 'updated_at', 'is_active')
	ordering = ('-is_active', 'start_date')


class SectionInline(admin.TabularInline):
	model = Section
	extra = 1


class SubjectInline(admin.TabularInline):
	model = Subject
	extra = 1


@admin.register(SchoolClass)
class SchoolClassAdmin(admin.ModelAdmin):
	list_display = ('id', 'name', 'created_at', 'updated_at')
	ordering = ('name',)
	inlines = [SectionInline, SubjectInline]


@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):
	list_display = ('id', 'school_class', 'name', 'is_full', 'created_at', 'updated_at')
	list_filter = ('is_full', 'school_class')


@admin.register(House)
class HouseAdmin(admin.ModelAdmin):
	list_display = ('color', 'is_full', 'created_at', 'updated_at')
	ordering = ('color',)
	list_filter = ('is_full',)


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
	list_display = ('id', 'name', 'school_class', 'full_marks', 'pass_marks', 'created_at', 'updated_at')
	ordering = ('school_class', 'name')
	list_filter = ('school_class',)


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
	list_display = ('academic_year', 'student', 'school_class', 'section', 'roll_number')
	ordering = ('student', 'academic_year')
	list_filter = ('academic_year',)
	search_fields = ('student__first_name', 'student__last_name', 'academic_year__start_date')


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
	list_display = ('id', 'name', 'created_at', 'updated_at')
	ordering = ('name',)


admin.site.register(Routine)


class AttendanceRecordInline(admin.TabularInline):
	model = AttendanceRecord
	extra = 0
	fields = ('student', 'status', 'remarks')
	readonly_fields = ('student',)
	ordering = ('student__last_name', 'student__first_name')
	list_display = ('student', 'status')
	list_editable = ('status',)


@admin.register(AttendanceSession)
class AttendanceSessionAdmin(admin.ModelAdmin):
	list_display = ('id', 'date', 'academic_year', 'school_class', 'section', 'marked_by')
	list_filter = ('date', 'academic_year', 'school_class', 'section', 'marked_by')
	search_fields = (
		'school_class__name',
		'section__name',
		'marked_by__staff__first_name',
		'marked_by__staff__last_name',
	)
	inlines = [AttendanceRecordInline]
	date_hierarchy = 'date'


@admin.register(AttendanceRecord)
class AttendanceRecordAdmin(admin.ModelAdmin):
	list_display = ('id', 'session', 'student', 'status')
	list_filter = ('session__date', 'status')
	search_fields = ('student__first_name', 'student__last_name')
	list_editable = ('status',)


@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
	list_display = ('id', 'title', 'subject', 'is_active', 'school_class', 'due_date', 'created_at')
	list_filter = ('school_class',)
	ordering = ('-due_date',)
	search_fields = ('title', 'subject__name')


@admin.register(AssignmentAttachment)
class AssignmentAttachmentAdmin(admin.ModelAdmin):
	list_display = ('id', 'assignment', 'file')
	list_filter = ('assignment',)
	search_fields = ('assignment__title',)


@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
	list_display = ('id', 'assignment', 'student', 'submission_date', 'status')
	list_filter = ('assignment', 'status')
	ordering = ('-submission_date',)
	search_fields = ('assignment__title', 'student__first_name', 'student__last_name')


@admin.register(Exam)
class ExamAdmin(admin.ModelAdmin):
	list_display = (
		'id',
		'school_class',
		'subject',
		'exam_date',
		'start_time',
		'end_time',
		'exam_type',
	)
	list_filter = (
		'academic_year',
		'school_class',
		'subject',
		'exam_type',
		'exam_date',
	)
	ordering = ('-exam_date', '-start_time')
	search_fields = (
		'school_class__name',
		'subject__name',
		'academic_year__year',
	)
	readonly_fields = ('created_at',)


@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
	list_display = ('title', 'priority', 'public_access', 'is_expired', 'academic_year', 'created_at')
	list_filter = ('priority', 'public_access', 'is_expired', 'academic_year', 'school_class', 'created_at')
	search_fields = ('title', 'description')
	ordering = ('-created_at',)

	fieldsets = (
		(None, {
			'fields': ('title', 'description', 'priority', 'public_access', 'is_expired')
		}),
		('Relations', {
			'fields': ('academic_year', 'school_class')
		}),
		('Timestamps', {
			'fields': ('created_at', 'updated_at'),
			'classes': ('collapse',)
		}),
	)
	readonly_fields = ('created_at', 'updated_at')


@admin.register(Leave)
class LeaveAdmin(admin.ModelAdmin):
	list_display = ('student', 'leave_reason_short', 'start_date', 'end_date', 'leave_status', 'total_days', 'created_at')
	list_filter = ('leave_status', 'start_date', 'end_date', 'created_at')
	search_fields = ('student__first_name', 'student__last_name', 'leave_reason')
	date_hierarchy = 'start_date'
	ordering = ('-created_at',)

	def leave_reason_short(self, obj):
		return (obj.leave_reason[:75] + '...') if len(obj.leave_reason) > 75 else obj.leave_reason
	leave_reason_short.short_description = 'Leave Reason'