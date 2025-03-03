from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Student, Parent


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
	list_display = ['first_name', 'last_name', 'email', 'created_at', 'updated_at', 'role']
	fields = ['first_name', 'last_name', 'email', 'created_at', 'updated_at', 'role']
	readonly_fields = ['created_at', 'updated_at']


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
	list_display = ('user', 'created_at', 'updated_at')
	search_fields = ('user__first_name', 'user__last_name', 'user__email')
	list_filter = ('created_at', 'updated_at')
	ordering = ('-created_at',)


@admin.register(Parent)
class ParentAdmin(admin.ModelAdmin):
	list_display = ('student', 'parent_type', 'full_name', 'phone_number', 'email', 'created_at', 'updated_at')
	search_fields = ('student__user__first_name', 'student__user__last_name', 'full_name', 'phone_number')
	list_filter = ('parent_type', 'created_at', 'updated_at')
	ordering = ('-created_at',)
	readonly_fields = ('created_at', 'updated_at')

	def save_model(self, request, obj, form, change):
		if obj.parent_type == 'G':
			if not obj.relationship or not obj.address:
				raise ValueError('The relationship and address are required fields for guardians.')
		super().save_model(request, obj, form, change)
