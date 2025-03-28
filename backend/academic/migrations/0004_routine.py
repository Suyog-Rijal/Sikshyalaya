# Generated by Django 5.1.6 on 2025-03-19 12:38

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('academic', '0003_alter_enrollment_unique_together_and_more'),
        ('user', '0003_alter_managementstaff_department_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Routine',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('day', models.CharField(choices=[('Sunday', 'Sunday'), ('Monday', 'Monday'), ('Tuesday', 'Tuesday'), ('Wednesday', 'Wednesday'), ('Thursday', 'Thursday'), ('Friday', 'Friday'), ('Saturday', 'Saturday')], max_length=10)),
                ('start_time', models.TimeField()),
                ('end_time', models.TimeField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('school_class', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='routines', to='academic.schoolclass')),
                ('section', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='routines', to='academic.section')),
                ('subject', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='routines', to='academic.subject')),
                ('teacher', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='routines', to='user.student')),
            ],
        ),
    ]
