# Generated by Django 5.1.6 on 2025-04-28 10:23

import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('academic', '0015_exam_fees_leave'),
    ]

    operations = [
        migrations.CreateModel(
            name='OnlinePaymentTransaction',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('transaction_id', models.CharField(max_length=100, unique=True)),
                ('payment_method', models.CharField(choices=[('ESEWA', 'eSewa'), ('KHALTI', 'Khalti'), ('CARD', 'Card'), ('PAYPAL', 'PayPal')], max_length=10)),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('status', models.CharField(choices=[('PENDING', 'Pending'), ('SUCCESS', 'Success'), ('FAILED', 'Failed'), ('CANCELLED', 'Cancelled')], default='PENDING', max_length=20)),
                ('response_message', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('fees', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='transactions', to='academic.fees')),
            ],
        ),
    ]
