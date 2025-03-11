# Generated by Django 5.1.6 on 2025-03-11 07:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('academic', '0003_alter_subject_school_class'),
        ('user', '0005_rename_date_of_join_staff_date_of_joining'),
    ]

    operations = [
        migrations.AlterField(
            model_name='teacher',
            name='subject',
            field=models.ManyToManyField(related_name='teachers', to='academic.subject'),
        ),
    ]
