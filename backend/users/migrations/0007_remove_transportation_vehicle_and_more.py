# Generated by Django 5.1.3 on 2024-12-31 08:24

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_remove_previousschool_attended_from_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='transportation',
            name='vehicle',
        ),
        migrations.DeleteModel(
            name='TransportationVehicle',
        ),
    ]
