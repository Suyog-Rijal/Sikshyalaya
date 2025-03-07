from django.contrib import admin
from academic.models import AcademicYear, SchoolClass, Section, House, Enrollment


@admin.register(AcademicYear)
class AcademicYearAdmin(admin.ModelAdmin):
	list_display = ('start_date', 'end_date', 'created_at', 'updated_at', 'is_active')
	ordering = ('-is_active', 'start_date')


class SectionInline(admin.TabularInline):
	model = Section
	extra = 1


@admin.register(SchoolClass)
class SchoolClassAdmin(admin.ModelAdmin):
	list_display = ('name', 'created_at', 'updated_at')
	ordering = ('name',)
	inlines = [SectionInline]


@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):
	list_display = ('school_class', 'name', 'is_full', 'created_at', 'updated_at')
	ordering = ('school_class', 'name')
	list_filter = ('is_full',)


@admin.register(House)
class HouseAdmin(admin.ModelAdmin):
	list_display = ('color', 'is_full', 'created_at', 'updated_at')
	ordering = ('color',)
	list_filter = ('is_full',)


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
	list_display = ('academic_year', 'student', 'school_class', 'section')
	ordering = ('student', 'academic_year')
	list_filter = ('academic_year',)
	search_fields = ('student__first_name', 'student__last_name', 'academic_year__start_date')

