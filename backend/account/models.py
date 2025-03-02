from django.contrib.auth.models import AbstractUser, BaseUserManager, PermissionsMixin
from django.conf import settings
from django.db import models, transaction
from django.core.exceptions import ValidationError


class CustomUserManager(BaseUserManager):
	def create_user(self, email, password=None, **extra_fields):
		if not email:
			raise ValueError('The Email field must be set')
		email = self.normalize_email(email)
		user = self.model(email=email, **extra_fields)
		user.set_password(password)
		user.is_active = True
		user.save(using=self._db)
		return user

	def create_superuser(self, email, password=None, **extra_fields):
		extra_fields.setdefault('is_staff', True)
		extra_fields.setdefault('is_superuser', True)
		extra_fields.setdefault('is_active', True)

		return self.create_user(email, password, **extra_fields)


class User(AbstractUser, PermissionsMixin):
	ROLE_STUDENT = 's'
	ROLE_TEACHER = 't'
	ROLE_ADMINISTRATOR = 'a'
	ROLE_CHOICES = [
		(ROLE_STUDENT, 'Student'),
		(ROLE_TEACHER, 'Teacher'),
		(ROLE_ADMINISTRATOR, 'Administrator'),
	]

	GENDER_MALE = 'm'
	GENDER_FEMALE = 'f'
	GENDER_OTHER = 'o'
	GENDER_CHOICES = [
		(GENDER_MALE, 'Male'),
		(GENDER_FEMALE, 'Female'),
		(GENDER_OTHER, 'Other'),
	]

	BLOOD_GROUP_CHOICES = [
		('A+', 'A+'), ('A-', 'A-'),
		('B+', 'B+'), ('B-', 'B-'),
		('AB+', 'AB+'), ('AB-', 'AB-'),
		('O+', 'O+'), ('O-', 'O-'),
	]

	username = None
	email = models.EmailField(max_length=255, unique=True)
	first_name = models.CharField(max_length=30)
	last_name = models.CharField(max_length=30)
	date_of_birth = models.DateField(blank=True, null=True)
	image = models.ImageField(upload_to='Profile pictures/', blank=True, null=True)
	gender = models.CharField(max_length=1, choices=GENDER_CHOICES, blank=True, null=True)
	role = models.CharField(max_length=1, choices=ROLE_CHOICES, default=ROLE_STUDENT)
	blood_group = models.CharField(max_length=3, choices=BLOOD_GROUP_CHOICES, blank=True, null=True)

	is_active = models.BooleanField(default=False)
	is_staff = models.BooleanField(default=False)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	objects = CustomUserManager()

	USERNAME_FIELD = 'email'
	REQUIRED_FIELDS = ['first_name', 'last_name']

	def save(self, *args, **kwargs):
		if self.role == 't':
			self.is_active = True

		super().save(*args, **kwargs)

	def __str__(self):
		return f'{self.first_name} {self.last_name}'


class Student(models.Model):
	user = models.OneToOneField(
		settings.AUTH_USER_MODEL,
		on_delete=models.PROTECT,
		limit_choices_to={'role': 's'}
	)
	section = models.ForeignKey('Section', on_delete=models.PROTECT)
	house = models.ForeignKey('StudentHouse', on_delete=models.PROTECT)

	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)


class Teacher(models.Model):
	user = models.OneToOneField(
		settings.AUTH_USER_MODEL,
		on_delete=models.PROTECT,
		limit_choices_to={'role': 't'}
	)

	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)


class Administrator(models.Model):
	user = models.OneToOneField(
		settings.AUTH_USER_MODEL,
		on_delete=models.PROTECT,
		limit_choices_to={'role': 'a'}
	)

	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)


class AcademicYear(models.Model):
	start_date = models.DateField()
	end_date = models.DateField()
	is_active = models.BooleanField(default=False)

	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def clean(self):
		if self.start_date >= self.end_date:
			raise ValidationError("End date must be after start date.")

		if AcademicYear.objects.filter(
				start_date=self.start_date,
				end_date=self.end_date
		).exclude(pk=self.pk).exists():
			raise ValidationError("Academic year already exists.")

		overlapping = AcademicYear.objects.filter(
			start_date__lt=self.end_date,
			end_date__gt=self.start_date,
		).exclude(pk=self.pk)
		if overlapping.exists():
			raise ValidationError("The academic year overlaps with an existing academic year.")

	def save(self, *args, **kwargs):
		self.full_clean()
		super().save(*args, **kwargs)
		if self.is_active:
			with transaction.atomic():
				AcademicYear.objects.filter(is_active=True).exclude(pk=self.pk).update(is_active=False)

	def __str__(self):
		return f'{self.start_date.year}-{self.end_date.year}'


class Grade(models.Model):
	name = models.CharField(max_length=25)

	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def __str__(self):
		return self.name


class Section(models.Model):
	grade = models.ForeignKey(Grade, on_delete=models.PROTECT, related_name='sections')
	name = models.CharField(max_length=25)

	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def __str__(self):
		return f"{self.grade.name}: {self.name}"


class StudentHouse(models.Model):

	section = models.ForeignKey(Section, on_delete=models.PROTECT, related_name='house')
	name = models.CharField(max_length=25)

	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		unique_together = ['section', 'name']

	def clean(self):
		self.name = self.name.capitalize()

	def __str__(self):
		return f"{self.name} - {self.section.name}"


class Parent(models.Model):
	PARENT_MOTHER = 'm'
	PARENT_FATHER = 'f'
	PARENT_GUARDIAN = 'g'
	PARENT_CHOICES = [
		(PARENT_MOTHER, 'Mother'),
		(PARENT_FATHER, 'Father'),
		(PARENT_GUARDIAN, 'Guardian'),
	]

	student = models.ForeignKey(Student, related_name='parents', on_delete=models.CASCADE)
	full_name = models.CharField(max_length=100)
	parent_type = models.CharField(max_length=1, choices=PARENT_CHOICES)
	phone_number = models.CharField(max_length=15)
	email = models.EmailField(blank=True, null=True)
	occupation = models.CharField(max_length=50, blank=True, null=True)

	# attributes for guardian
	relation = models.CharField(max_length=50, blank=True, null=True)
	address = models.TextField(blank=True, null=True)

	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		unique_together = ['student', 'parent_type']

	def __str__(self):
		return self.full_name


class Address(models.Model):
	user = models.ManyToManyField(settings.AUTH_USER_MODEL)
	permanent_address = models.TextField()
	current_address = models.TextField()

	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def __str__(self):
		return f'{self.user.first_name} {self.user.last_name}'


class Transportation(models.Model):
	user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
	pickup_point = models.CharField(max_length=100)

	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)


class PreviousSchool(models.Model):
	user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
	name = models.CharField(max_length=100)
	address = models.TextField()


class Enrollment(models.Model):
	student = models.ForeignKey(Student, on_delete=models.CASCADE)
	academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE)
	grade = models.ForeignKey(Grade, on_delete=models.PROTECT)
	enrollment_date = models.DateField()

	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)