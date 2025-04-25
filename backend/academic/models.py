from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned, ValidationError
from django.db import models
import uuid
from django.utils import timezone
from django.db.models import Q
from user.models import Student, Teacher


class AcademicYear(models.Model):
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	start_date = models.DateField()
	is_active = models.BooleanField(default=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def save(self, *args, **kwargs):
		if self.is_active:
			AcademicYear.objects.exclude(id=self.id).update(is_active=False)
		super().save(*args, **kwargs)

	def __str__(self):
		return f'{self.start_date.year}-{self.start_date.year + 1}'


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


class Subject(models.Model):
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	school_class = models.ForeignKey(SchoolClass, on_delete=models.CASCADE, related_name='subjects')
	name = models.CharField(max_length=100)
	full_marks = models.PositiveSmallIntegerField()
	pass_marks = models.PositiveSmallIntegerField()

	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		unique_together = ["school_class", "name"]
		ordering = ["school_class", "name"]

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
	school_class = models.ForeignKey(SchoolClass, on_delete=models.CASCADE, related_name='section')
	class_teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name='sections', null=True, blank=True)
	is_full = models.BooleanField(default=False)
	name = models.CharField(max_length=5)
	house = models.ManyToManyField(House, blank=True, related_name='sections')

	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		unique_together = ["school_class", "name"]
		ordering = ["school_class", "name"]

	def get_number_of_students(self):
		return self.enrollments.count()

	def __str__(self):
		return f'{self.school_class.name} - {self.name}'


class Enrollment(models.Model):
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="enrollments")
	academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE, related_name="enrollments")
	school_class = models.ForeignKey(SchoolClass, on_delete=models.CASCADE, related_name="enrollments")
	section = models.ForeignKey(Section, on_delete=models.CASCADE, related_name="enrollments")
	house = models.ForeignKey(House, on_delete=models.CASCADE, null=True, blank=True)
	enrollment_date = models.DateField(default=timezone.now)
	roll_number = models.PositiveSmallIntegerField(null=True, blank=True)

	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		unique_together = ["academic_year", "school_class", "section", "roll_number"]

	def save(self, *args, **kwargs):
		if not self.academic_year_id:
			try:
				self.academic_year = AcademicYear.objects.get(is_active=True)
			except ObjectDoesNotExist:
				raise ValueError("No active academic year found. Please set one.")
			except MultipleObjectsReturned:
				raise ValueError("Multiple active academic years found. Please ensure only one is active.")

		if not self.roll_number:
			latest_enrollment = Enrollment.objects.filter(
				academic_year=self.academic_year,
				school_class=self.school_class,
				section=self.section
			).order_by("-roll_number").first()

			if latest_enrollment and latest_enrollment.roll_number:
				self.roll_number = latest_enrollment.roll_number + 1
			else:
				self.roll_number = 1

		super().save(*args, **kwargs)

	def __str__(self):
		return f"{self.student.get_fullname()} - {self.school_class.name} - {self.academic_year}"


class Department(models.Model):
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	name = models.CharField(max_length=100, unique=True)

	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def __str__(self):
		return self.name


class Routine(models.Model):
	DAY_CHOICES = [
		('Sunday', 'Sunday'),
		('Monday', 'Monday'),
		('Tuesday', 'Tuesday'),
		('Wednesday', 'Wednesday'),
		('Thursday', 'Thursday'),
		('Friday', 'Friday'),
		('Saturday', 'Saturday'),
	]

	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	academic_year = models.ForeignKey(
		AcademicYear, on_delete=models.CASCADE,
		related_name='routines', null=True
	)
	day = models.CharField(max_length=10, choices=DAY_CHOICES)
	start_time = models.TimeField()
	end_time = models.TimeField()
	school_class = models.ForeignKey(
		SchoolClass, on_delete=models.CASCADE,
		related_name='routines'
	)
	section = models.ForeignKey(
		Section, on_delete=models.CASCADE,
		related_name='routines'
	)
	subject = models.ForeignKey(
		Subject, on_delete=models.CASCADE,
		related_name='routines'
	)
	teacher = models.ForeignKey(
		Teacher, on_delete=models.CASCADE,
		related_name='routines'
	)

	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		unique_together = [
			"academic_year", "day", "start_time",
			"school_class", "section", "subject", "teacher"
		]

	def clean(self):
		if self.end_time <= self.start_time:
			raise ValidationError("End time must be after start time.")

		qs = Routine.objects.filter(
			academic_year=self.academic_year,
			day=self.day
		)
		if self.pk:
			qs = qs.exclude(pk=self.pk)

		overlap_q = Q(start_time__lt=self.end_time) & Q(end_time__gt=self.start_time)

		if qs.filter(
				overlap_q,
				school_class=self.school_class,
				section=self.section
		).exists():
			raise ValidationError(
				"This time slot overlaps with an existing routine for "
				f"class {self.school_class} section {self.section}."
			)

		if qs.filter(
				overlap_q,
				teacher=self.teacher
		).exists():
			raise ValidationError(
				f"Teacher {self.teacher} is already scheduled for another class "
				"during this time."
			)

	def save(self, *args, **kwargs):
		if not self.academic_year:
			self.academic_year = AcademicYear.objects.get(is_active=True)
		self.full_clean()
		super().save(*args, **kwargs)

	def __str__(self):
		return (
			f"{self.school_class} - {self.section} | {self.subject} | {self.teacher} | "
			f"{self.day} | {self.start_time.strftime('%I:%M %p')} - "
			f"{self.end_time.strftime('%I:%M %p')}"
		)


class AttendanceSession(models.Model):
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE, related_name='attendance_sessions',
	                                  null=True)
	school_class = models.ForeignKey(SchoolClass, on_delete=models.CASCADE, related_name='attendance_sessions')
	section = models.ForeignKey(Section, on_delete=models.CASCADE, related_name='attendance_sessions')
	date = models.DateField(default=timezone.localdate)
	marked_by = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name='attendance_sessions')
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		unique_together = ['academic_year', 'school_class', 'section', 'date']
		ordering = ['-date']

	def clean(self):
		if self.date > timezone.localdate():
			raise ValidationError("Cannot create attendance session in the future")

	def save(self, *args, **kwargs):
		is_new = self._state.adding
		if not self.academic_year:
			self.academic_year = AcademicYear.objects.get(is_active=True)
		self.full_clean()
		super().save(*args, **kwargs)
		if is_new:
			students = Student.objects.filter(
				enrollments__academic_year=self.academic_year,
				enrollments__school_class=self.school_class,
				enrollments__section=self.section
			).distinct()
			AttendanceRecord.objects.bulk_create([
				AttendanceRecord(
					session=self,
					student=stu,
					status=False
				) for stu in students
			])

	def __str__(self):
		return f"{self.school_class}-{self.section} on {self.date}"


class AttendanceRecord(models.Model):
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	session = models.ForeignKey(AttendanceSession, on_delete=models.CASCADE, related_name='records')
	student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='attendance_records')
	status = models.BooleanField(default=False)
	remarks = models.TextField(blank=True, null=True)

	class Meta:
		unique_together = ['session', 'student']
		ordering = ['student__last_name', 'student__first_name']

	def __str__(self):
		return f"{self.student} – {'Present' if self.status else 'Absent'}"
