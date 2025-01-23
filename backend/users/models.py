from django.db import models
from django.conf import settings
from django.utils import timezone
import uuid
from django.core.exceptions import ValidationError
from django.core.validators import MaxLengthValidator


class StudentHouse(models.Model):
    name = models.CharField(max_length=255)
    house_master = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Student Houses"


class Student(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        limit_choices_to={'role': 's'}
    )
    house = models.ForeignKey(
        'StudentHouse',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    admission_number = models.CharField(max_length=50, unique=True, blank=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.admission_number:
            self.admission_number = str(uuid.uuid4())
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.admission_number} - {self.user}"


class Teacher(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        limit_choices_to={'role': 't'}
    )
    specialization = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user}"


class Address(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='address'
    )
    temporary_address = models.TextField(blank=True, null=True)
    permanent_address = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Addresses"

    def __str__(self):
        return f"Address of {self.user}"


class Parent(models.Model):
    PARENT_MOTHER = 'm'
    PARENT_FATHER = 'f'
    PARENT_CHOICES = [
        (PARENT_MOTHER, 'Mother'),
        (PARENT_FATHER, 'Father'),
    ]

    student = models.ForeignKey(
        'Student',
        on_delete=models.PROTECT,
        related_name='parents'
    )
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        null=True,
        blank=True
    )
    parent_type = models.CharField(max_length=1, choices=PARENT_CHOICES, validators=[MaxLengthValidator(1)])
    full_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=255)
    email = models.EmailField()
    occupation = models.CharField(max_length=255, blank=True)
    address = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['student', 'parent_type']

    def save(self, *args, **kwargs):
        print("Parent save method called")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.get_parent_type_display()} of {self.student.user}"


class Guardian(models.Model):
    student = models.ForeignKey(
        'Student',
        on_delete=models.PROTECT,
        related_name='guardians'
    )
    parent = models.ForeignKey(
        Parent,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        help_text="Select if the guardian is already a parent"
    )
    full_name = models.CharField(max_length=255, null=True, blank=True)
    relationship = models.CharField(max_length=255, null=True, blank=True)
    phone_number = models.CharField(max_length=255, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    occupation = models.CharField(max_length=255, blank=True)
    address = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        if self.parent:
            # If a parent is selected, ensure no guardian details are provided
            if any([self.full_name, self.relationship, self.phone_number,
                    self.email, self.occupation, self.address]):
                raise ValidationError(
                    "Guardian details should not be filled if parent is selected."
                )
        else:
            # If no parent is selected, guardian details are required
            required_fields = ['full_name', 'relationship', 'phone_number',
                               'email', 'address']
            for field in required_fields:
                if not getattr(self, field):
                    raise ValidationError(f"{field} is required when parent is not selected")

    def save(self, *args, **kwargs):
        # Call the clean method to enforce validation
        self.clean()

        if self.parent:
            # If parent is selected, automatically copy details from the parent
            self.full_name = self.parent.full_name
            self.relationship = self.parent.get_parent_type_display()
            self.phone_number = self.parent.phone_number
            self.email = self.parent.email
            self.occupation = self.parent.occupation
            self.address = self.parent.address

        super().save(*args, **kwargs)

    def __str__(self):
        return f"Guardian of {self.student.user}"


class AcademicYear(models.Model):
    name = models.CharField(max_length=255, unique=True)
    start_date = models.DateField()
    end_date = models.DateField()
    is_active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        if self.start_date >= self.end_date:
            raise ValidationError("End date must be after start date")
        if self.is_active:
            active_years = AcademicYear.objects.filter(is_active=True)
            if self.pk:
                active_years = active_years.exclude(pk=self.pk)
            if active_years.exists():
                raise ValidationError("Another academic year is already active")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.name} ({self.start_date.year}-{self.end_date.year})'


class Class(models.Model):
    name = models.CharField(max_length=255)
    grade_level = models.IntegerField(unique=True, verbose_name='Grade')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Classes"
        ordering = ['grade_level']

    def __str__(self):
        return f'{self.name} (Grade {self.grade_level})'


class Section(models.Model):
    name = models.CharField(max_length=255)
    class_grade = models.ForeignKey(
        Class,
        on_delete=models.CASCADE,
        related_name='sections'
    )
    class_teacher = models.ForeignKey(
        Teacher,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='class_teacher_sections'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['class_teacher'], name='unique_class_teacher'),
            models.UniqueConstraint(fields=['class_grade', 'name'], name='unique_class_grade_name')
        ]
        ordering = ['class_grade', 'name']

    def __str__(self):
        return f'{self.class_grade}-{self.name}'


class Enrollment(models.Model):
    student = models.ForeignKey(
        Student,
        on_delete=models.PROTECT,
        related_name='enrollments'
    )
    academic_year = models.ForeignKey(
        AcademicYear,
        on_delete=models.PROTECT,
        related_name='enrollments'
    )
    class_grade = models.ForeignKey(
        Class,
        on_delete=models.PROTECT,
        related_name='enrollments'
    )
    section = models.ForeignKey(
        Section,
        on_delete=models.PROTECT,
        related_name='enrollments'
    )
    enrollment_date = models.DateField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['student', 'academic_year']

    def clean(self):
        if self.section.class_grade != self.class_grade:
            raise ValidationError("Section must belong to the selected class")

    def save(self, *args, **kwargs):
        self.clean()
        if not self.student.user.is_active:
            self.student.user.is_active = True
            self.student.user.save()
        super().save(*args, **kwargs)

    def __str__(self):
        return (f'{self.student.user} - '
                f'{self.class_grade}-{self.section.name} '
                f'({self.academic_year.name})')


class TransportationRoute(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


# class TransportationVehicle(models.Model):
#     vehicle_number = models.CharField(max_length=255, unique=True)
#     vehicle_type = models.CharField(max_length=255)
#     capacity = models.PositiveIntegerField()
#     driver_name = models.CharField(max_length=255)
#     driver_phone = models.CharField(max_length=255)
#     route = models.ForeignKey(
#         TransportationRoute,
#         on_delete=models.PROTECT,
#         related_name='vehicles'
#     )
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
#
#     def __str__(self):
#         return f"{self.vehicle_number} - {self.route.name}"


class Transportation(models.Model):
    student = models.ForeignKey(
        Student,
        on_delete=models.PROTECT,
        related_name='transportation'
    )
    # vehicle = models.ForeignKey(
    #     TransportationVehicle,
    #     on_delete=models.PROTECT,
    #     related_name='students'
    # )
    pickup_address = models.TextField()
    drop_address = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Transportation"

    def __str__(self):
        return f"{self.student.user}"


class DocumentType(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    required = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Document(models.Model):
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name='documents'
    )
    document_type = models.ForeignKey(
        DocumentType,
        on_delete=models.PROTECT
    )
    file = models.FileField(upload_to='student_documents/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.document_type.name} - {self.student.user}"


class PreviousSchool(models.Model):
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name='previous_schools'
    )
    name = models.CharField(max_length=255)
    address = models.TextField()
    reason_for_leaving = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} - {self.student.user}"
