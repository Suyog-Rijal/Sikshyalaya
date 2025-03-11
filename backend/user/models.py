import uuid

from django.core.exceptions import ValidationError
from django.db import models
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
	father = models.ForeignKey('Parent', on_delete=models.SET_NULL, related_name='father_of', blank=True, null=True)
	mother = models.ForeignKey('Parent', on_delete=models.SET_NULL, related_name='mother_of', blank=True, null=True)
	guardian = models.ForeignKey('Parent', on_delete=models.SET_NULL, related_name='guardian_of', blank=True, null=True)

	email = models.EmailField(unique=True, blank=True)
	password = models.CharField(max_length=25, blank=True)

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

	def get_enrollment(self):
		latest_enrollment = self.enrollments.order_by("-academic_year__start_date").first()
		if latest_enrollment:
			return f"{latest_enrollment.school_class.name} ({latest_enrollment.section.name})"
		return "Not Enrolled"
	get_enrollment.short_description = "Enrollment"

	def save(self, *args, **kwargs):
		if not self.email:
			base_email = f"{slugify(self.first_name)}.{slugify(self.last_name)}.y22@icp.edu.np"
			unique_email = base_email
			counter = 1

			while Student.objects.filter(email=unique_email).exists():
				unique_email = f"{slugify(self.first_name)}.{slugify(self.last_name)}.y22{counter}@icp.edu.np"
				counter += 1

			self.email = unique_email

		if not self.password:
			self.password = uuid.uuid4().hex[:8]

		self.full_clean()
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
	profile_picture = models.ImageField(upload_to='Profile Pictures/', blank=True, null=True)
	full_name = models.CharField(max_length=60)
	email = models.EmailField(unique=True, blank=True, null=True)
	phone_number = models.CharField(max_length=10)
	occupation = models.CharField(max_length=100, blank=True, null=True)
	relationship = models.CharField(max_length=1, choices=RELATIONSHIP_CHOICES)
	guardian_relation = models.CharField(max_length=100, blank=True, null=True)
	address = models.TextField(null=True, blank=True)

	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def clean(self):
		if self.relationship == 'G':
			if not self.phone_number:
				raise ValidationError({'phone_number': "Phone number is required for guardians."})
			if not self.address:
				raise ValidationError({'address': "Address is required for guardians."})

	def save(self, *args, **kwargs):
		self.full_clean()
		super().save(*args, **kwargs)

	def __str__(self):
		return self.full_name


class Staff(models.Model):
	# Gender Choices
	GENDER_CHOICES = [
		('M', 'Male'),
		('F', 'Female'),
		('O', 'Other'),
	]

	# Marital Status Choices
	MARITAL_STATUS_CHOICES = [
		('S', 'Single'),
		('M', 'Married'),
		('D', 'Divorced'),
		('W', 'Widowed'),
	]

	# Blood Group Choices
	BLOOD_GROUP_CHOICES = [
		('A+', 'A+'), ('A-', 'A-'),
		('B+', 'B+'), ('B-', 'B-'),
		('AB+', 'AB+'), ('AB-', 'AB-'),
		('O+', 'O+'), ('O-', 'O-'),
		('RN', 'Rh Null'),
	]

	# Account Status Choices
	ACCOUNT_STATUS_CHOICES = [
		('A', 'Active'),
		('I', 'Inactive'),
		('D', 'Disabled'),
	]

	# Employment Type
	EMPLOYMENT_TYPE_CHOICES = [
		('FT', 'Full Time'),
		('PT', 'Part Time'),
	]

	STAFF_TYPE_CHOICES = [
		('T', 'Teacher'),
		('M', 'Management'),
	]

	# Transportation Choices
	TRANSPORTATION_CHOICES = [
		('SB', 'School Bus'),
		('PV', 'Private'),
		('PB', 'Public'),
		('OF', 'On Foot'),
	]

	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	profile_picture = models.ImageField(upload_to='Profile Pictures/', blank=True, null=True)
	first_name = models.CharField(max_length=30)
	last_name = models.CharField(max_length=30)
	phone_number = models.CharField(max_length=10)
	gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
	date_of_birth = models.DateField()
	permanent_address = models.TextField()
	current_address = models.TextField()
	marital_status = models.CharField(max_length=1, choices=MARITAL_STATUS_CHOICES, blank=True, null=True)
	blood_group = models.CharField(max_length=4, choices=Student.BLOOD_GROUP_CHOICES, blank=True, null=True)
	account_status = models.CharField(max_length=1, choices=ACCOUNT_STATUS_CHOICES, default='A')
	personal_email = models.EmailField(blank=True, null=True)
	email = models.EmailField(unique=True, blank=True)
	password = models.CharField(max_length=25, blank=True)
	date_of_joining = models.DateField()
	note = models.TextField(blank=True, null=True)
	staff_type = models.CharField(max_length=1, choices=STAFF_TYPE_CHOICES)

	employment_type = models.CharField(max_length=2, choices=EMPLOYMENT_TYPE_CHOICES)
	salary = models.DecimalField(max_digits=10, decimal_places=2)

	bank_name = models.CharField(max_length=100, blank=True, null=True)
	account_holder = models.CharField(max_length=100, blank=True, null=True)
	account_number = models.CharField(max_length=20, blank=True, null=True)

	transportation = models.CharField(max_length=2, choices=TRANSPORTATION_CHOICES)
	pickup_address = models.TextField(blank=True, null=True)

	social_facebook = models.URLField(blank=True, null=True)
	social_instagram = models.URLField(blank=True, null=True)
	social_linkedin = models.URLField(blank=True, null=True)
	social_github = models.URLField(blank=True, null=True)

	qualification = models.CharField(max_length=100, blank=True, null=True)
	experience = models.PositiveSmallIntegerField(default=0)
	previous_workplace = models.CharField(max_length=100, blank=True, null=True)
	previous_workplace_address = models.TextField(blank=True, null=True)
	previous_workplace_phone_number = models.CharField(max_length=10, blank=True, null=True)

	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def save(self, *args, **kwargs):
		if not self.email:
			base_email = f"{slugify(self.first_name)}.{slugify(self.last_name)}.y22@icp.edu.np"
			unique_email = base_email
			counter = 1

			while Student.objects.filter(email=unique_email).exists():
				unique_email = f"{slugify(self.first_name)}.{slugify(self.last_name)}.y22{counter}@icp.edu.np"
				counter += 1

			self.email = unique_email

		if not self.password:
			self.password = uuid.uuid4().hex[:8]

		self.full_clean()
		super().save(*args, **kwargs)

	def get_fullname(self):
		return f"{self.first_name} {self.last_name}"

	def __str__(self):
		return f"{self.first_name} {self.last_name}"


class Teacher(models.Model):
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	staff = models.ForeignKey(Staff, on_delete=models.CASCADE, related_name='teacher')
	school_class = models.ForeignKey('academic.SchoolClass', on_delete=models.CASCADE, default=None)
	subject = models.ForeignKey('academic.Subject', related_name='teachers', on_delete=models.CASCADE, default=None)

	def __str__(self):
		return self.staff.get_fullname()


class ManagementStaff(models.Model):
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	staff = models.ForeignKey(Staff, on_delete=models.CASCADE, related_name='management_staff')
	department = models.ForeignKey('academic.Department', on_delete=models.CASCADE)
	pan_number = models.CharField(max_length=10, blank=True, null=True)

	def __str__(self):
		return self.staff.get_fullname()
