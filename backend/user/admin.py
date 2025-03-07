from django.contrib import admin
from .models import Student, Parent


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
	list_display = [
		'first_name',
		'last_name',
		'created_at',
		'updated_at',
	]

	search_fields = ['first_name', 'last_name', 'personal_email']
	list_filter = ['gender', 'account_status', 'blood_group', 'transportation']


@admin.register(Parent)
class ParentAdmin(admin.ModelAdmin):
	list_display = [
		'full_name',
		'student',
		'relationship',
		'created_at',
		'updated_at',
	]

	search_fields = ['full_name', 'email', 'phone_number']
	list_filter = ['relationship']
