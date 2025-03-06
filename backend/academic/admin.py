# from django.contrib import admin
# from .models import AcademicYear, Class, House, Section, Subject
#
#
# @admin.register(AcademicYear)
# class AcademicYearAdmin(admin.ModelAdmin):
# 	list_display = ('year', 'created_at', 'updated_at', 'is_active')
# 	ordering = ('-is_active', 'year')
#
#
# class SectionInline(admin.TabularInline):
# 	model = Section
# 	extra = 1
#
#
# @admin.register(Class)
# class ClassAdmin(admin.ModelAdmin):
# 	list_display = ('id', 'name', 'created_at', 'updated_at')
# 	inlines = (SectionInline,)
# 	search_fields = ('name',)
# 	ordering = ('name',)
#
#
# @admin.register(Section)
# class SectionAdmin(admin.ModelAdmin):
# 	list_display = ('id', 'name', 'student_class', 'created_at', 'updated_at')
# 	search_fields = ('name',)
# 	list_filter = ('student_class',)
# 	ordering = ('student_class', 'name')
#
# 	filter_horizontal = ('house',)
#
#
# @admin.register(House)
# class HouseAdmin(admin.ModelAdmin):
# 	list_display = ('id', 'name', 'color', 'created_at', 'updated_at')
# 	search_fields = ('name', 'color')
# 	list_filter = ('created_at', 'updated_at')
# 	ordering = ('name',)
#
#
# @admin.register(Subject)
# class SubjectAdmin(admin.ModelAdmin):
# 	list_display = ('name', 'student_class', 'full_marks', 'pass_marks', 'created_at', 'updated_at')
# 	search_fields = ('name', 'student_class__name')
# 	list_filter = ('student_class', 'created_at', 'updated_at')
# 	ordering = ('student_class', 'name')
