from django.db import models
from django.conf import settings


class StudentHouse(models.Model):
    name = models.CharField(max_length=255)
    house_master = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Student(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    house = models.ForeignKey(StudentHouse, on_delete=models.PROTECT)

    def __str__(self):
        return self.user.first_name


class Teacher(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)

    def __str__(self):
        return self.user.first_name


class Address(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='address')
    temporary_address = models.CharField(max_length=255, blank=True, null=True)
    permanent_address = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.permanent_address


class Parents(models.Model):
    PARENT_MOTHER = 'm'
    PARENT_FATHER = 'f'
    PARENT_CHOICES = [
        (PARENT_MOTHER, 'Mother'),
        (PARENT_FATHER, 'Father'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    parent_type = models.CharField(max_length=1, choices=PARENT_CHOICES)
    full_name = models.CharField(max_length=255, blank=True, null=True)
    phone_number = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    occupation = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.full_name


class Guardian(models.Model):
    student = models.ForeignKey(Student, on_delete=models.PROTECT)
    full_name = models.CharField(max_length=255)
    relationship = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=255)
    email = models.EmailField(blank=True, null=True)
    occupation = models.CharField(max_length=255, blank=True, null=True)
    address = models.ForeignKey(Address, on_delete=models.PROTECT)

    parent_as_guardian = models.ForeignKey(Parents, on_delete=models.PROTECT,
                                           blank=True,
                                           null=True,
                                           help_text="If the guardian is a parent, select the parent here.")

    def save(self, *args, **kwargs):
        if self.parent_as_guardian:
            self.full_name = self.parent_as_guardian.full_name
            self.relationship = self.parent_as_guardian.parent_type
            self.phone_number = self.parent_as_guardian.phone_number
            self.email = self.parent_as_guardian.email
            self.occupation = self.parent_as_guardian.occupation
            self.address = self.parent_as_guardian.user.address.permanent_address

        super().save(*args, **kwargs)

    def __str__(self):
        return self.full_name


class AcademicYear(models.Model):
    year = models.DateField()
    start_date = models.DateField()
    end_date = models.DateField()

    def __str__(self):
        return f'{self.year}'


class Class(models.Model):
    name = models.CharField(max_length=255, null=False, blank=False)
    grade_level = models.IntegerField()

    def __str__(self):
        return f'{self.grade_level}'


class Section(models.Model):
    name = models.CharField(max_length=255)
    section_class = models.ForeignKey(Class, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Subject(models.Model):
    name = models.CharField(max_length=255)
    subject_class = models.ForeignKey(Class, on_delete=models.CASCADE)
    section = models.ForeignKey(Section, on_delete=models.CASCADE)
    full_marks = models.DecimalField(max_digits=5, decimal_places=2)
    pass_marks = models.DecimalField(max_digits=5, decimal_places=2)


class Enrollment(models.Model):
    student = models.ForeignKey(Student, on_delete=models.PROTECT)
    enrollment_class = models.ForeignKey(Class, on_delete=models.PROTECT)
    section = models.ForeignKey(Section, on_delete=models.PROTECT)
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.PROTECT)
    enrollment_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f'{self.student.user.first_name}={self.academic_year.year}'


class Exam(models.Model):
    exam_type = models.CharField(max_length=255)
    exam_class = models.ForeignKey(Class, on_delete=models.PROTECT)
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.PROTECT)
    start_date = models.DateField()
    end_date = models.DateField()


class ExamDetail(models.Model):
    exam = models.ForeignKey(Exam, on_delete=models.PROTECT)
    subject = models.ForeignKey(Subject, on_delete=models.PROTECT)
    exam_date = models.DateField()
    full_marks = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    pass_marks = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.full_marks or not self.pass_marks:
            self.full_marks = self.subject.full_marks
            self.pass_marks = self.subject.pass_marks

        super().save(*args, **kwargs)


class TransportationRoutes(models.Model):
    route_name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.route_name


class TransportationVehicle(models.Model):
    vehicle_number = models.CharField(max_length=255)
    driver_name = models.CharField(max_length=255)
    driver_phone = models.CharField(max_length=255)
    route = models.ForeignKey(TransportationRoutes, on_delete=models.PROTECT)

    def __str__(self):
        return self.vehicle_number


class Transportation(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    vehicle = models.ForeignKey(TransportationVehicle, on_delete=models.PROTECT)


class DocumentsType(models.Model):
    document_type = models.CharField(max_length=255)

    def __str__(self):
        return self.document_type


class Documents(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    document_type = models.ForeignKey(DocumentsType, on_delete=models.PROTECT)
    document = models.FileField(upload_to='documents/')


class PreviousSchool(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    school_name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
