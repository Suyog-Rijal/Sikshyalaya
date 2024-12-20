import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager, PermissionsMixin


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser, PermissionsMixin):
    # User role
    ROLE_STUDENT = 's'
    ROLE_TEACHER = 't'
    ROLE_ADMINISTRATOR = 'a'
    ROLE_CHOICES = [
        (ROLE_STUDENT, 'Student'),
        (ROLE_TEACHER, 'Teacher'),
        (ROLE_ADMINISTRATOR, 'Administrator'),
    ]

    # User gender
    GENDER_MALE = 'm'
    GENDER_FEMALE = 'f'
    GENDER_OTHER = 'o'
    GENDER_CHOICES = [
        (GENDER_MALE, 'Male'),
        (GENDER_FEMALE, 'Female'),
        (GENDER_OTHER, 'Other'),
    ]

    # Blood group
    BLOOD_GROUP_A_POS = 'A+'
    BLOOD_GROUP_A_NEG = 'A-'
    BLOOD_GROUP_B_POS = 'B+'
    BLOOD_GROUP_B_NEG = 'B-'
    BLOOD_GROUP_AB_POS = 'AB+'
    BLOOD_GROUP_AB_NEG = 'AB-'
    BLOOD_GROUP_O_POS = 'O+'
    BLOOD_GROUP_O_NEG = 'O-'
    BLOOD_GROUP_CHOICES = [
        (BLOOD_GROUP_A_POS, 'A+'),
        (BLOOD_GROUP_A_NEG, 'A-'),
        (BLOOD_GROUP_B_POS, 'B+'),
        (BLOOD_GROUP_B_NEG, 'B-'),
        (BLOOD_GROUP_AB_POS, 'AB+'),
        (BLOOD_GROUP_AB_NEG, 'AB-'),
        (BLOOD_GROUP_O_POS, 'O+'),
        (BLOOD_GROUP_O_NEG, 'O-'),
    ]
    username_validator = None
    username = None

    email = models.EmailField(max_length=255, unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    date_of_birth = models.DateField(blank=True, null=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, blank=True, null=True)
    role = models.CharField(max_length=1, choices=ROLE_CHOICES, default=ROLE_STUDENT)
    profile_picture = models.FileField(upload_to='profile_pictures/', blank=True, null=True)
    blood_group = models.CharField(max_length=3, choices=BLOOD_GROUP_CHOICES, blank=True, null=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'

    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return f'{self.first_name} {self.last_name}'


