from django.contrib import admin
from .models import Student, Parent, Staff, Teacher, ManagementStaff


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
	list_display = [
		'id',
		'first_name',
		'last_name',
		'get_enrollment',
	]

	search_fields = ['first_name', 'last_name', 'personal_email']
	list_filter = ['gender', 'account_status', 'blood_group', 'transportation']


@admin.register(Parent)
class ParentAdmin(admin.ModelAdmin):
	list_display = [
		'full_name',
		'relationship',
		'created_at',
		'updated_at',
	]

	search_fields = ['full_name', 'email', 'phone_number']
	list_filter = ['relationship']


class TeacherInline(admin.TabularInline):
	model = Teacher
	extra = 1
	autocomplete_fields = ['staff']


class ManagementStaffInline(admin.TabularInline):
	model = ManagementStaff
	extra = 1
	autocomplete_fields = ['staff']


@admin.register(Staff)
class StaffAdmin(admin.ModelAdmin):
	list_display = [
		'id',
		'get_fullname',
		'staff_type',
	]
	search_fields = ['first_name', 'last_name', 'personal_email']
	inlines = [TeacherInline, ManagementStaffInline]
