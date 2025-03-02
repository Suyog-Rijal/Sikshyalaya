from django.contrib import admin
from .models import *


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
	list_display = ['id', 'email', 'first_name', 'last_name', 'role', 'is_active']


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
	list_display = ['id', 'user', 'created_at', 'updated_at']


@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
	list_display = ['id', 'user', 'created_at', 'updated_at']


@admin.register(Administrator)
class AdministratorAdmin(admin.ModelAdmin):
	list_display = ['id', 'user', 'created_at', 'updated_at']


@admin.register(AcademicYear)
class AcademicYearAdmin(admin.ModelAdmin):
	list_display = ['id', 'start_date', 'end_date', 'is_active', 'created_at']
	list_filter = ['is_active']


@admin.register(Grade)
class GradeAdmin(admin.ModelAdmin):
	list_display = ['id', 'name', 'created_at', 'updated_at']


@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):
	list_display = ['id', 'name', 'grade', 'created_at', 'updated_at']
	list_filter = ['grade']


@admin.register(StudentHouse)
class StudentHouseAdmin(admin.ModelAdmin):
	list_display = ['id', 'section', 'name']
	list_filter = ['section']
