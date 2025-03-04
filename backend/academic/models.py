# from django.core.exceptions import ValidationError
# from django.db import models
# import uuid
#
#
# class AcademicYear(models.Model):
# 	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
# 	year = models.CharField(max_length=9, unique=True)
# 	is_active = models.BooleanField(default=True)
# 	created_at = models.DateTimeField(auto_now_add=True)
# 	updated_at = models.DateTimeField(auto_now=True)
#
# 	def save(self, *args, **kwargs):
# 		if len(self.year.strip()) == 4:
# 			self.year = f"{self.year}-{int(self.year) + 1}"
#
# 		if self.is_active:
# 			AcademicYear.objects.exclude(id=self.id).update(is_active=False)
#
# 		super(AcademicYear, self).save(*args, **kwargs)
#
# 	def __str__(self):
# 		return self.year
#
#
# class Class(models.Model):
# 	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
# 	name = models.CharField(max_length=100, unique=True)
#
# 	created_at = models.DateTimeField(auto_now_add=True)
# 	updated_at = models.DateTimeField(auto_now=True)
#
# 	def __str__(self):
# 		return self.name
#
# 	class Meta:
# 		verbose_name = "Class"
# 		verbose_name_plural = "Classes"
#
#
# class House(models.Model):
# 	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
# 	name = models.CharField(max_length=100, unique=True)
# 	color = models.CharField(max_length=7, unique=True)
#
# 	created_at = models.DateTimeField(auto_now_add=True)
# 	updated_at = models.DateTimeField(auto_now=True)
#
# 	def __str__(self):
# 		return self.name
#
# 	class Meta:
# 		verbose_name = "House"
# 		verbose_name_plural = "Houses"
#
#
# class Section(models.Model):
# 	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
# 	student_class = models.ForeignKey(Class, on_delete=models.CASCADE, related_name="sections")
# 	name = models.CharField(max_length=100)
# 	house = models.ManyToManyField(House, blank=True, related_name="sections")
#
# 	created_at = models.DateTimeField(auto_now_add=True)
# 	updated_at = models.DateTimeField(auto_now=True)
#
# 	class Meta:
# 		unique_together = ["student_class", "name"]
# 		ordering = ["student_class", "name"]
# 		verbose_name = "Section"
# 		verbose_name_plural = "Sections"
#
# 	def __str__(self):
# 		return self.name
#
#
# class Subject(models.Model):
# 	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
# 	student_class = models.ForeignKey(Class, on_delete=models.CASCADE)
# 	name = models.CharField(max_length=100, unique=True)
#
# 	full_marks = models.PositiveIntegerField()
# 	pass_marks = models.PositiveIntegerField()
#
# 	created_at = models.DateTimeField(auto_now_add=True)
# 	updated_at = models.DateTimeField(auto_now=True)
#
# 	def __str__(self):
# 		return self.name
