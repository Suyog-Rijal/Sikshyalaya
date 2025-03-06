from django.contrib import admin
from .models import Student


# Register the Student model in the admin
@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
	list_display = [
		'first_name',
		'last_name',
		'created_at',
		'updated_at',
	]

	# Optional: Add search fields to search through specific fields
	search_fields = ['first_name', 'last_name', 'personal_email']

	# Optional: Add filters for better filtering of students
	list_filter = ['gender', 'account_status', 'blood_group', 'transportation']

