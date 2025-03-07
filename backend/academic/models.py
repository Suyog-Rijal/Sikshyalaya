from django.core.exceptions import ValidationError
from django.db import models
import uuid
from django.utils import timezone
from user.models import Student


class AcademicYear(models.Model):
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	start_date = models.DateField()
	end_date = models.DateField()
	is_active = models.BooleanField(default=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def __str__(self):
		return f'{self.start_date.year}-{self.end_date.year}'


class SchoolClass(models.Model):
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	name = models.CharField(max_length=100, unique=True)

	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		verbose_name = "Class"
		verbose_name_plural = "Classes"

	def __str__(self):
		return self.name


class House(models.Model):
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	color = models.CharField(max_length=15, unique=True)
	is_full = models.BooleanField(default=False)

	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def __str__(self):
		return self.color


class Section(models.Model):
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	school_class = models.ForeignKey(SchoolClass, on_delete=models.CASCADE)
	is_full = models.BooleanField(default=False)
	name = models.CharField(max_length=5)
	house = models.ManyToManyField(House, blank=True, related_name='sections')

	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		unique_together = ["school_class", "name"]
		ordering = ["school_class", "name"]

	def __str__(self):
		return f'{self.school_class.name} - {self.name}'


class Enrollment(models.Model):
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="enrollments")
	academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE, related_name="enrollments")
	school_class = models.ForeignKey(SchoolClass, on_delete=models.CASCADE, related_name="enrollments")
	section = models.ForeignKey(Section, on_delete=models.CASCADE, related_name="enrollments")
	enrollment_date = models.DateField(default=timezone.now)

	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		unique_together = ["student", "academic_year"]

	def __str__(self):
		return f"{self.student.get_fullname()} - {self.school_class.name} - {self.academic_year}"