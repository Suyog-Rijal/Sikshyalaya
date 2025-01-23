from django.contrib import admin
from .models import (
    StudentHouse, Student, Teacher, Address, Parent, Guardian, AcademicYear,
    Class, Section, Enrollment, TransportationRoute,
    Transportation, DocumentType, Document, PreviousSchool
)


# Registering StudentHouse
@admin.register(StudentHouse)
class StudentHouseAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'house_master', 'created_at', 'updated_at')
    search_fields = ('name', 'house_master__username')


# Registering Student
@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('id', 'admission_number', 'user', 'house', 'created_at', 'updated_at')
    search_fields = ('admission_number', 'user__username')
    list_filter = ('house',)


# Registering Teacher
@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'specialization', 'created_at', 'updated_at')
    search_fields = ('employee_id', 'user__username')


# Registering Address
@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'created_at', 'updated_at')
    search_fields = ('user__username',)


# Registering Parent
@admin.register(Parent)
class ParentAdmin(admin.ModelAdmin):
    list_display = ('id', 'full_name', 'student', 'parent_type', 'phone_number', 'email', 'created_at', 'updated_at')
    search_fields = ('full_name', 'student__user__username')
    list_filter = ('parent_type',)


# Registering Guardian
@admin.register(Guardian)
class GuardianAdmin(admin.ModelAdmin):
    list_display = ('id', 'full_name', 'student', 'relationship', 'phone_number', 'email', 'created_at', 'updated_at')
    search_fields = ('full_name', 'student__user__username')
    list_filter = ('relationship',)


# Registering AcademicYear
@admin.register(AcademicYear)
class AcademicYearAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'start_date', 'end_date', 'is_active', 'created_at', 'updated_at')
    search_fields = ('name',)
    list_filter = ('is_active',)


# Registering Class
@admin.register(Class)
class ClassAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'grade_level', 'created_at', 'updated_at')
    search_fields = ('name',)
    list_filter = ('grade_level',)


# Registering Section
@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'class_grade', 'class_teacher', 'created_at', 'updated_at')
    search_fields = ('name',)
    list_filter = ('class_grade',)


# Registering Enrollment
@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'student', 'academic_year', 'class_grade', 'section', 'enrollment_date', 'created_at', 'updated_at')
    search_fields = ('student__user__username', 'academic_year__name')
    list_filter = ('academic_year', 'class_grade', 'section')


# Registering TransportationRoute
@admin.register(TransportationRoute)
class TransportationRouteAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description', 'created_at', 'updated_at')
    search_fields = ('name',)


# Registering Transportation
@admin.register(Transportation)
class TransportationAdmin(admin.ModelAdmin):
    list_display = ('id', 'student', 'pickup_address', 'drop_address', 'created_at', 'updated_at')
    search_fields = ('student__user__username', 'vehicle__vehicle_number')


# Registering DocumentType
@admin.register(DocumentType)
class DocumentTypeAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'required', 'created_at', 'updated_at')
    search_fields = ('name',)


# Registering Document
@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('id', 'student', 'document_type', 'file', 'uploaded_at', 'updated_at')
    search_fields = ('student__user__username', 'document_type__name')


# Registering PreviousSchool
@admin.register(PreviousSchool)
class PreviousSchoolAdmin(admin.ModelAdmin):
    list_display = ('id',
                    'student', 'name', 'reason_for_leaving', 'created_at', 'updated_at')
    search_fields = ('student__user__username', 'name')

