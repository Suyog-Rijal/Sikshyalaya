# Generated by Django 5.1.6 on 2025-03-14 07:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('academic', '0002_initial'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='enrollment',
            unique_together=set(),
        ),
        migrations.AddField(
            model_name='enrollment',
            name='roll_number',
            field=models.PositiveSmallIntegerField(blank=True, null=True),
        ),
        migrations.AlterUniqueTogether(
            name='enrollment',
            unique_together={('academic_year', 'school_class', 'section', 'roll_number')},
        ),
    ]
