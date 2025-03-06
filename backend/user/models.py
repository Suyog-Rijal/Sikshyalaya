from django.db import models
import uuid


class Student(models.Model):
	# Gender Choices
	GENDER_CHOICES = [
		('1', 'Male'),
		('2', 'Female'),
		('3', 'Other'),
	]

	# Blood Group Choices
	BLOOD_GROUP_CHOICES = [
		('A+', 'A+'), ('A-', 'A-'),
		('B+', 'B+'), ('B-', 'B-'),
		('AB+', 'AB+'), ('AB-', 'AB-'),
		('O+', 'O+'), ('O-', 'O-'),
		('RN', 'Rh Null'),
	]

	# Transportation Choices
	TRANSPORTATION_CHOICES = [
		('SB', 'School Bus'),
		('PV', 'Private'),
		('PB', 'Public'),
		('OF', 'On Foot'),
	]

	# Account Status Choices
	ACCOUNT_STATUS_CHOICES = [
		('A', 'Active'),
		('I', 'Inactive'),
		('D', 'Disabled'),
	]

	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	first_name = models.CharField(max_length=30)
	last_name = models.CharField(max_length=30)
	admission_date = models.DateField()
	date_of_birth = models.DateField()
	gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
	personal_email = models.EmailField(unique=True, blank=True, null=True)
	phone_number = models.CharField(max_length=30, blank=True, null=True)
	# profile_picture = models.ImageField(upload_to='Profile Pictures/', blank=True, null=True)
	blood_group = models.CharField(max_length=4, choices=BLOOD_GROUP_CHOICES, blank=True, null=True)
	current_address = models.TextField()
	permanent_address = models.TextField()
	transportation = models.CharField(max_length=2, choices=TRANSPORTATION_CHOICES, blank=True, null=True)
	pickup_address = models.TextField(blank=True, null=True)
	account_status = models.CharField(max_length=1, choices=ACCOUNT_STATUS_CHOICES, default='A')
	previous_school = models.CharField(max_length=100, blank=True, null=True)
	previous_school_address = models.TextField(blank=True, null=True)

	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def __str__(self):
		return f"{self.first_name} {self.last_name}"

