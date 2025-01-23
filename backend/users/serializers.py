from datetime import datetime
from django.db import transaction
from rest_framework import serializers
from authentication.models import User
from django.utils import timezone
import uuid
from .models import (
    StudentHouse, Student, Teacher, Address, Parent, Guardian, AcademicYear, Class, Section, Enrollment,
    TransportationRoute, Transportation, DocumentType, Document, PreviousSchool
)


class StudentHouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentHouse
        fields = '__all__'


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'


class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = '__all__'


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'


class ParentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parent
        fields = '__all__'


class GuardianSerializer(serializers.ModelSerializer):
    parent = ParentSerializer(required=False)

    class Meta:
        model = Guardian
        fields = '__all__'


class AcademicYearSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademicYear
        fields = '__all__'


class ClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = '__all__'


class SimpleClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = ['id']


class SectionSerializer(serializers.ModelSerializer):
    class_grade = SimpleClassSerializer()

    class Meta:
        model = Section
        fields = '__all__'


class TransportationRouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransportationRoute
        fields = '__all__'


class TransportationSerializer(serializers.ModelSerializer):
    student = StudentSerializer()

    class Meta:
        model = Transportation
        fields = '__all__'


class DocumentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentType
        fields = '__all__'


class DocumentSerializer(serializers.ModelSerializer):
    document_type = DocumentTypeSerializer()
    student = StudentSerializer()

    class Meta:
        model = Document
        fields = '__all__'


class PreviousSchoolSerializer(serializers.ModelSerializer):
    student = StudentSerializer()

    class Meta:
        model = PreviousSchool
        fields = '__all__'


class EnrollmentFormGetSerializer(serializers.Serializer):
    academic_year = serializers.SerializerMethodField()
    class_grade = serializers.SerializerMethodField()
    section = serializers.SerializerMethodField()
    transportation_route = serializers.SerializerMethodField()

    class Meta:
        model = Enrollment
        fields = ['academic_year', 'class_grade', 'section', 'transportation_route']

    def get_academic_year(self, obj):
        # Serialize related academic_year data
        academic_years = AcademicYear.objects.all()
        return AcademicYearSerializer(academic_years, many=True).data

    def get_class_grade(self, obj):
        # Serialize related class_grade data
        class_grades = Class.objects.all()
        return ClassSerializer(class_grades, many=True).data

    def get_section(self, obj):
        # Serialize related section data
        sections = Section.objects.all()
        return SectionSerializer(sections, many=True).data

    def get_transportation_route(self, obj):
        transportation_routes = TransportationRoute.objects.all()
        return TransportationRouteSerializer(transportation_routes, many=True).data


class EnrollmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Enrollment
        fields = ['academic_year', 'class_grade', 'section', 'enrollment_date']

    @transaction.atomic
    def create(self, validated_data):
        request = self.context.get('request')

        required_fields = ['email', 'first_name', 'last_name', 'date_of_birth', 'gender', 'role']
        for field in required_fields:
            if field not in request.data:
                raise serializers.ValidationError(f"{field} is required")

        try:
            user = User.objects.create(
                email=request.data['email'],
                first_name=request.data['first_name'],
                last_name=request.data['last_name'],
                date_of_birth=request.data['date_of_birth'],
                gender=request.data['gender'],
                role=request.data['role'],
                blood_group=request.data.get('blood_group'),
            )
            user.set_password('Suyog.07')
            user.save()

            student = Student.objects.create(
                user=user,
                house=StudentHouse.objects.get(id=request.data['house']),
            )

            Address.objects.create(
                user=user,
                temporary_address=request.data['temporary_address'],
                permanent_address=request.data['permanent_address'],
            )

            PreviousSchool.objects.create(
                student=student,
                name=request.data['school_name'],
                address=request.data['school_address'],
            )

            Transportation.objects.create(
                student=student,
                pickup_address=request.data['pickup_address'],
                drop_address=request.data['drop_address'],
            )

            Guardian.objects.create(
                student=student,
                full_name=request.data['guardian_full_name'],
                relationship=request.data['guardian_relationship'],
                phone_number=request.data['guardian_phone_number'],
                email=request.data['guardian_email'],
                occupation=request.data['guardian_occupation'],
                address=request.data['guardian_address'],
            )

            parent_type = request.data['parent_type']
            Parent.objects.create(
                student=student,
                full_name=request.data[f"{'mother' if parent_type == 'm' else 'father'}_full_name"],
                phone_number=request.data[f"{'mother' if parent_type == 'm' else 'father'}_phone_number"],
                email=request.data[f"{'mother' if parent_type == 'm' else 'father'}_email"],
                occupation=request.data[f"{'mother' if parent_type == 'm' else 'father'}_occupation"],
                address=request.data[f"{'mother' if parent_type == 'm' else 'father'}_address"],
                parent_type=parent_type,
            )

            enrollment = Enrollment.objects.create(
                student=student,
                academic_year=AcademicYear.objects.get(id=request.data['academic_year']),
                class_grade=Class.objects.get(id=request.data['class_grade']),
                section=Section.objects.get(id=request.data['section']),
            )

            return enrollment
        except Exception as e:
            raise serializers.ValidationError(f"Error during enrollment creation: {str(e)}")
