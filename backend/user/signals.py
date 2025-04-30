from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from .models import Parent, Staff, Student, CustomUser


@receiver(post_save, sender=Parent)
def create_parent_profile(sender, instance, created, **kwargs):
	if created:
		CustomUser.objects.create(
			email=instance.email,
			roles='parent',
		)


@receiver(post_save, sender=Staff)
def create_staff_profile(sender, instance, created, **kwargs):
	if created:
		staff_type = instance.staff_type
		if staff_type == 'T':
			role = 'teacher'
		else:
			role = 'staff'
		CustomUser.objects.create(
			email=instance.email,
			roles=role,
		)


@receiver(post_save, sender=Student)
def create_student_profile(sender, instance, created, **kwargs):
	if created:
		CustomUser.objects.create(
			email=instance.email,
			roles='student',
		)


@receiver(post_save, sender=CustomUser)
def send_email_notification(sender, instance, created, **kwargs):
	if created:
		context = {
			'email': instance.email,
			'role': instance.roles,
			'platform_name': 'Your Platform Name',  # Customize as needed
		}

		html_message = render_to_string('mail.html', context)
		plain_message = strip_tags(html_message)

		subject = 'Welcome to Our Platform!'
		from_email = 'your-email@example.com'
		recipient_list = [instance.email]

		try:
			send_mail(
				subject=subject,
				message=plain_message,
				from_email=from_email,
				recipient_list=recipient_list,
				html_message=html_message,
				fail_silently=False,
			)
		except Exception as e:
			print(f"Failed to send email to {instance.email}: {e}")