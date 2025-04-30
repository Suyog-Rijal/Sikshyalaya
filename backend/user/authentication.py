from django.contrib.auth import get_user_model
from django.contrib.auth.backends import BaseBackend
from .models import Student, Staff, CustomUser, Parent


class CustomAuthenticationBackend(BaseBackend):
	def authenticate(self, request, email=None, password=None, role=None):
		user = None

		if not role:
			role = "admin"

		if role == "admin":
			user = self.get_user_by_email(get_user_model(), email, password)
		elif role == "student":
			user = self.get_user_by_email(Student, email, password)
		elif role == "staff":
			user = self.get_user_by_email(Staff, email, password)
		elif role == "parent":
			user = self.get_user_by_email(Parent, email, password)

		print("Uesr: ", user)
		return user

	def get_user_by_email(self, user_model, email, password):
		try:
			user = user_model.objects.get(email=email)
			print("User:", user)
			if user.check_password(password):
				return user
		except user_model.DoesNotExist:
			return None

	def get_user(self, user_id):
		try:
			return get_user_model().objects.get(pk=user_id)
		except get_user_model().DoesNotExist:
			return None
