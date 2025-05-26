from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Student, Parent, Staff, Teacher, ManagementStaff, CustomUser


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
	list_display = [
		'id',
		'get_enrollment',
		'account_status',
	]

	search_fields = ['personal_email']
	list_filter = ['gender', 'account_status', 'blood_group', 'transportation']


@admin.register(Parent)
class ParentAdmin(admin.ModelAdmin):
	list_display = [
		'id',
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
		'get_school_class',
	]

	def get_school_class(self, obj):
		if obj.staff_type == 'T':
			classes = Teacher.objects.filter(staff=obj).values_list('school_class__name', flat=True)
			return ", ".join(classes)
		return "-"

	search_fields = ['first_name', 'last_name', 'personal_email']
	inlines = [TeacherInline, ManagementStaffInline]


class CustomUserAdmin(UserAdmin):
	model = CustomUser
	list_display = ('id', 'email', 'is_staff', 'is_active')
	list_filter = ('is_staff', 'is_active', 'roles')
	fieldsets = (
		(None, {'fields': ('email', 'password')}),
		('Roles & Permissions', {'fields': ('roles', 'is_staff', 'is_active', 'groups', 'user_permissions')}),
		('Important Dates', {'fields': ('last_login',)}),
	)
	add_fieldsets = (
		(None, {
			'classes': ('wide',),
			'fields': ('email', 'password1', 'password2', 'roles', 'is_staff', 'is_active')}
		 ),
	)
	search_fields = ('email',)
	ordering = ('email',)
	filter_horizontal = ('groups', 'user_permissions')


admin.site.register(CustomUser, CustomUserAdmin)
