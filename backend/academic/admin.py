from django.contrib import admin
from academic.models import AcademicYear, SchoolClass, Section, House, Enrollment, Subject, Department


@admin.register(AcademicYear)
class AcademicYearAdmin(admin.ModelAdmin):
	list_display = ('start_date', 'created_at', 'updated_at', 'is_active')
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
	list_display = ('name', 'school_class', 'full_marks', 'pass_marks', 'created_at', 'updated_at')
	ordering = ('school_class', 'name')
	list_filter = ('school_class',)


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
	list_display = ('academic_year', 'student', 'school_class', 'section')
	ordering = ('student', 'academic_year')
	list_filter = ('academic_year',)
	search_fields = ('student__first_name', 'student__last_name', 'academic_year__start_date')


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
	list_display = ('id', 'name', 'created_at', 'updated_at')
	ordering = ('name',)