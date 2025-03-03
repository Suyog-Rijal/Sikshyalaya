from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
import uuid

from django.utils import timezone


class CustomUserManager(BaseUserManager):

	def create_user(self, email, password=None, **extra_fields):
		if not email:
			raise ValueError('The email is a required field.')
		email = self.normalize_email(email)
		user = self.model(email=email, **extra_fields)
		user.set_password(password)
		user.save(using=self._db)
		return user

	def create_superuser(self, email, password=None, **extra_fields):
		extra_fields.setdefault('is_staff', True)
		extra_fields.setdefault('is_superuser', True)
		if 'date_of_birth' not in extra_fields:
			extra_fields['date_of_birth'] = timezone.now().date()
		return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
	GENDER_MALE = 'M'
	GENDER_FEMALE = 'F'
	GENDER_OTHER = 'O'
	GENDER_RATHER_NOT_SAY = 'R'
	GENDER_CHOICES = [
		(GENDER_MALE, 'Male'),
		(GENDER_FEMALE, 'Female'),
		(GENDER_OTHER, 'Other'),
		(GENDER_RATHER_NOT_SAY, 'Rather not say'),
	]

	BLOOD_GROUP_A_POSITIVE = 'A+'
	BLOOD_GROUP_A_NEGATIVE = 'A-'
	BLOOD_GROUP_B_POSITIVE = 'B+'
	BLOOD_GROUP_B_NEGATIVE = 'B-'
	BLOOD_GROUP_AB_POSITIVE = 'AB+'
	BLOOD_GROUP_AB_NEGATIVE = 'AB-'
	BLOOD_GROUP_O_POSITIVE = 'O+'
	BLOOD_GROUP_O_NEGATIVE = 'O-'
	BLOOD_GROUP_RH_NULL = 'RN'
	BLOOD_GROUP_CHOICES = [
		(BLOOD_GROUP_A_POSITIVE, 'A+'),
		(BLOOD_GROUP_A_NEGATIVE, 'A-'),
		(BLOOD_GROUP_B_POSITIVE, 'B+'),
		(BLOOD_GROUP_B_NEGATIVE, 'B-'),
		(BLOOD_GROUP_AB_POSITIVE, 'AB+'),
		(BLOOD_GROUP_AB_NEGATIVE, 'AB-'),
		(BLOOD_GROUP_O_POSITIVE, 'O+'),
		(BLOOD_GROUP_O_NEGATIVE, 'O-'),
		(BLOOD_GROUP_RH_NULL, 'Rh Null'),
	]

	ROLE_ADMIN = 'A'
	ROLE_SCHOOL_ADMIN = 'SA'
	ROLE_TEACHER = 'T'
	ROLE_STUDENT = 'S'
	ROLE_PARENT = 'P'
	ROLE_CHOICES = [
		(ROLE_ADMIN, 'Admin'),
		(ROLE_SCHOOL_ADMIN, 'School Admin'),
		(ROLE_TEACHER, 'Teacher'),
		(ROLE_STUDENT, 'Student'),
		(ROLE_PARENT, 'Parent'),
	]

	TRANSPORTATION_SCHOOL_BUS = 'SB'
	TRANSPORTATION_PRIVATE = 'PV'
	TRANSPORTATION_PUBLIC = 'PB'
	TRANSPORTATION_ON_FOOT = 'OF'
	TRANSPORTATION_CHOICES = [
		(TRANSPORTATION_SCHOOL_BUS, 'School Bus'),
		(TRANSPORTATION_PRIVATE, 'Private'),
		(TRANSPORTATION_PUBLIC, 'Public'),
		(TRANSPORTATION_ON_FOOT, 'On Foot'),
	]

	ACCOUNT_STATUS_ACTIVE = 'A'
	ACCOUNT_STATUS_INACTIVE = 'I'
	ACCOUNT_STATUS_DISABLED = 'D'
	ACCOUNT_STATUS_CHOICES = [
		(ACCOUNT_STATUS_ACTIVE, 'Active'),
		(ACCOUNT_STATUS_INACTIVE, 'Inactive'),
		(ACCOUNT_STATUS_DISABLED, 'Disabled'),
	]

	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	email = models.EmailField(unique=True)
	first_name = models.CharField(max_length=30)
	middle_name = models.CharField(max_length=30, blank=True, null=True)
	last_name = models.CharField(max_length=30)
	date_of_birth = models.DateField()
	personal_email = models.EmailField(unique=True, blank=True, null=True)
	phone_number = models.CharField(max_length=15, null=True, blank=True)
	profile_picture = models.ImageField(upload_to='Profile Pictures/', blank=True, null=True)
	gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
	blood_group = models.CharField(max_length=3, choices=BLOOD_GROUP_CHOICES, blank=True, null=True)
	current_address = models.TextField()
	permanent_address = models.TextField()
	transportation = models.CharField(max_length=2, choices=TRANSPORTATION_CHOICES)
	pickup_address = models.TextField()
	account_status = models.CharField(max_length=1, choices=ACCOUNT_STATUS_CHOICES, default=ACCOUNT_STATUS_ACTIVE)

	role = models.CharField(max_length=2, choices=ROLE_CHOICES)

	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)
	is_staff = models.BooleanField(default=False)
	is_active = models.BooleanField(default=True)

	USERNAME_FIELD = 'email'

	required_fields = ['first_name', 'last_name', 'role']

	objects = CustomUserManager()

	def __str__(self):
		return f'${self.first_name} {self.last_name}'

	def get_full_name(self):
		return f'{self.first_name} {self.middle_name} {self.last_name}'


class Student(models.Model):
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	user = models.OneToOneField(User, on_delete=models.CASCADE)

	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)


class Parent(models.Model):
	PARENT_MOTHER = 'M'
	PARENT_FATHER = 'F'
	PARENT_GUARDIAN = 'G'
	PARENT_CHOICES = [
		(PARENT_MOTHER, 'Mother'),
		(PARENT_FATHER, 'Father'),
		(PARENT_GUARDIAN, 'Guardian'),
	]

	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	student = models.ForeignKey(Student, on_delete=models.CASCADE)
	parent_type = models.CharField(max_length=1, choices=PARENT_CHOICES)
	full_name = models.CharField(max_length=100, blank=True, null=True)
	phone_number = models.CharField(max_length=15, blank=True, null=True)
	email = models.EmailField(blank=True, null=True)
	occupation = models.CharField(max_length=100, blank=True, null=True)
	relationship = models.CharField(max_length=100, blank=True, null=True)
	address = models.TextField(blank=True, null=True)

	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def __str__(self):
		return self.full_name
