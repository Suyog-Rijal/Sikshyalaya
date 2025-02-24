# Generated by Django 5.1.3 on 2024-12-29 07:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_alter_section_unique_together_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='guardian',
            name='address',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='guardian',
            name='email',
            field=models.EmailField(blank=True, max_length=254, null=True),
        ),
        migrations.AlterField(
            model_name='guardian',
            name='full_name',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='guardian',
            name='phone_number',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='guardian',
            name='relationship',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
