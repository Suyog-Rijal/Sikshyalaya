from django.core.exceptions import ValidationError
from django.db import models
import uuid

from django.utils.text import slugify


class Student(models.Model):
	# Gender Choices
	GENDER_CHOICES = [
		('M', 'Male'),
		('F', 'Female'),
		('O', 'Other'),
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
	profile_picture = models.ImageField(upload_to='Profile Pictures/', blank=True, null=True)
	first_name = models.CharField(max_length=30)
	last_name = models.CharField(max_length=30)
	date_of_birth = models.DateField()
	gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
	account_status = models.CharField(max_length=1, choices=ACCOUNT_STATUS_CHOICES, default='A')
	blood_group = models.CharField(max_length=4, choices=BLOOD_GROUP_CHOICES, blank=True, null=True)
	personal_email = models.EmailField(blank=True, null=True)
	phone_number = models.CharField(max_length=10, blank=True, null=True)
	email = models.EmailField(unique=True, blank=True)

	current_address = models.TextField()
	permanent_address = models.TextField()

	transportation = models.CharField(max_length=2, choices=TRANSPORTATION_CHOICES)
	pickup_address = models.TextField(blank=True, null=True)

	previous_school = models.CharField(max_length=100, blank=True, null=True)
	previous_school_address = models.TextField(blank=True, null=True)

	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def get_fullname(self):
		return f"{self.first_name} {self.last_name}"

	def save(self, *args, **kwargs):
		if not self.email:
			base_email = f"{slugify(self.first_name)}.{slugify(self.last_name)}.y22@icp.edu.np"
			unique_email = base_email
			counter = 1

			while Student.objects.filter(email=unique_email).exists():
				unique_email = f"{slugify(self.first_name)}.{slugify(self.last_name)}.y22{counter}@icp.edu.np"
				counter += 1

			self.email = unique_email

		super().save(*args, **kwargs)

	def __str__(self):
		return f"{self.first_name} {self.last_name}"


class Parent(models.Model):
	RELATIONSHIP_CHOICES = [
		('F', 'Father'),
		('M', 'Mother'),
		('G', 'Guardian'),
	]

	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	student = models.ForeignKey('Student', on_delete=models.CASCADE)
	profile_picture = models.ImageField(upload_to='Profile Pictures/', blank=True, null=True)
	full_name = models.CharField(max_length=60)
	email = models.EmailField(unique=True, blank=True, null=True)
	phone_number = models.CharField(max_length=10)
	occupation = models.CharField(max_length=100, blank=True, null=True)
	relationship = models.CharField(max_length=1, choices=RELATIONSHIP_CHOICES)
	guardian_relation = models.CharField(max_length=100, blank=True, null=True)
	address = models.TextField()

	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		unique_together = ['student', 'relationship']

	def clean(self):
		if self.relationship == 'G':
			if not self.phone_number:
				raise ValidationError({'phone_number': "Phone number is required for guardians."})
			if not self.address:
				raise ValidationError({'address': "Address is required for guardians."})

	def save(self, *args, **kwargs):
		if not self.email:
			base_email = f"{slugify(self.full_name)}.{self.student.id.hex[:6]}@icp.edu.np"
			unique_email = base_email
			counter = 1

			while Parent.objects.filter(email=unique_email).exists():
				unique_email = f"{slugify(self.full_name)}.{self.student.id.hex[:6]}{counter}@icp.edu.np"
				counter += 1

			self.email = unique_email

		self.full_clean()
		super().save(*args, **kwargs)

	def __str__(self):
		return self.full_name
