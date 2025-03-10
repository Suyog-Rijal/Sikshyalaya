# Generated by Django 5.1.6 on 2025-03-08 14:08

import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('academic', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Parent',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('profile_picture', models.ImageField(blank=True, null=True, upload_to='Profile Pictures/')),
                ('full_name', models.CharField(max_length=60)),
                ('email', models.EmailField(blank=True, max_length=254, null=True, unique=True)),
                ('phone_number', models.CharField(max_length=10)),
                ('occupation', models.CharField(blank=True, max_length=100, null=True)),
                ('relationship', models.CharField(choices=[('F', 'Father'), ('M', 'Mother'), ('G', 'Guardian')], max_length=1)),
                ('guardian_relation', models.CharField(blank=True, max_length=100, null=True)),
                ('address', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='Staff',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('profile_picture', models.ImageField(blank=True, null=True, upload_to='Profile Pictures/')),
                ('first_name', models.CharField(max_length=30)),
                ('last_name', models.CharField(max_length=30)),
                ('phone_number', models.CharField(max_length=10)),
                ('gender', models.CharField(choices=[('M', 'Male'), ('F', 'Female'), ('O', 'Other')], max_length=1)),
                ('date_of_birth', models.DateField()),
                ('permanent_address', models.TextField()),
                ('current_address', models.TextField()),
                ('marital_status', models.CharField(blank=True, choices=[('S', 'Single'), ('M', 'Married'), ('D', 'Divorced'), ('W', 'Widowed')], max_length=1, null=True)),
                ('blood_group', models.CharField(blank=True, choices=[('A+', 'A+'), ('A-', 'A-'), ('B+', 'B+'), ('B-', 'B-'), ('AB+', 'AB+'), ('AB-', 'AB-'), ('O+', 'O+'), ('O-', 'O-'), ('RN', 'Rh Null')], max_length=4, null=True)),
                ('account_status', models.CharField(choices=[('A', 'Active'), ('I', 'Inactive'), ('D', 'Disabled')], default='A', max_length=1)),
                ('personal_email', models.EmailField(blank=True, max_length=254, null=True)),
                ('email', models.EmailField(blank=True, max_length=254, unique=True)),
                ('date_of_join', models.DateField()),
                ('note', models.TextField(blank=True, null=True)),
                ('employment_type', models.CharField(choices=[('FT', 'Full Time'), ('PT', 'Part Time')], max_length=2)),
                ('salary', models.DecimalField(decimal_places=2, max_digits=10)),
                ('bank_name', models.CharField(blank=True, max_length=100, null=True)),
                ('account_holder', models.CharField(blank=True, max_length=100, null=True)),
                ('account_number', models.CharField(blank=True, max_length=20, null=True)),
                ('transportation', models.CharField(choices=[('SB', 'School Bus'), ('PV', 'Private'), ('PB', 'Public'), ('OF', 'On Foot')], max_length=2)),
                ('pickup_address', models.TextField(blank=True, null=True)),
                ('social_facebook', models.URLField(blank=True, null=True)),
                ('social_twitter', models.URLField(blank=True, null=True)),
                ('social_linkedin', models.URLField(blank=True, null=True)),
                ('social_github', models.URLField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='ManagementStaff',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('qualification', models.CharField(blank=True, max_length=100, null=True)),
                ('work_experience', models.PositiveSmallIntegerField(default=0)),
                ('previous_workplace', models.CharField(blank=True, max_length=100, null=True)),
                ('previous_workplace_address', models.TextField(blank=True, null=True)),
                ('previous_workplace_phone_number', models.CharField(blank=True, max_length=10, null=True)),
                ('pan_number', models.CharField(blank=True, max_length=10, null=True)),
                ('department', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='academic.department')),
                ('staff', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='user.staff')),
            ],
        ),
        migrations.CreateModel(
            name='Student',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('profile_picture', models.ImageField(blank=True, null=True, upload_to='Profile Pictures/')),
                ('first_name', models.CharField(max_length=30)),
                ('last_name', models.CharField(max_length=30)),
                ('date_of_birth', models.DateField()),
                ('gender', models.CharField(choices=[('M', 'Male'), ('F', 'Female'), ('O', 'Other')], max_length=1)),
                ('account_status', models.CharField(choices=[('A', 'Active'), ('I', 'Inactive'), ('D', 'Disabled')], default='A', max_length=1)),
                ('blood_group', models.CharField(blank=True, choices=[('A+', 'A+'), ('A-', 'A-'), ('B+', 'B+'), ('B-', 'B-'), ('AB+', 'AB+'), ('AB-', 'AB-'), ('O+', 'O+'), ('O-', 'O-'), ('RN', 'Rh Null')], max_length=4, null=True)),
                ('personal_email', models.EmailField(blank=True, max_length=254, null=True)),
                ('phone_number', models.CharField(blank=True, max_length=10, null=True)),
                ('email', models.EmailField(blank=True, max_length=254, unique=True)),
                ('password', models.CharField(blank=True, max_length=25)),
                ('current_address', models.TextField()),
                ('permanent_address', models.TextField()),
                ('transportation', models.CharField(choices=[('SB', 'School Bus'), ('PV', 'Private'), ('PB', 'Public'), ('OF', 'On Foot')], max_length=2)),
                ('pickup_address', models.TextField(blank=True, null=True)),
                ('previous_school', models.CharField(blank=True, max_length=100, null=True)),
                ('previous_school_address', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('father', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='father_of', to='user.parent')),
                ('guardian', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='guardian_of', to='user.parent')),
                ('mother', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='mother_of', to='user.parent')),
            ],
        ),
        migrations.CreateModel(
            name='Teacher',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('qualification', models.CharField(blank=True, max_length=100, null=True)),
                ('teaching_experience', models.PositiveSmallIntegerField(default=0)),
                ('previous_school', models.CharField(blank=True, max_length=100, null=True)),
                ('previous_school_address', models.TextField(blank=True, null=True)),
                ('previous_school_phone_number', models.CharField(blank=True, max_length=10, null=True)),
                ('school_class', models.ManyToManyField(to='academic.schoolclass')),
                ('staff', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='user.staff')),
                ('subject', models.ManyToManyField(to='academic.subject')),
            ],
        ),
    ]
