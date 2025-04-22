from django.db.models.signals import post_save
from django.dispatch import receiver
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