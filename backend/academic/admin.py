from django.contrib import admin
from academic.models import AcademicYear, SchoolClass, Section, House, Enrollment, Subject, Department, Routine, \
	AttendanceRecord, AttendanceSession


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
