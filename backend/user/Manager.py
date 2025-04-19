from django.contrib.auth.base_user import BaseUserManager


class CustomUserManager(BaseUserManager):
	def create_user(self, email, password=None, roles=None, **extra_fields):
		if not email:
			raise ValueError("The Email field must be set")
		email = self.normalize_email(email)
		roles = roles or []

		user = self.model(email=email, roles=",".join(roles), **extra_fields)
		user.set_password(password)
		user.save(using=self._db)
		return user

	def create_superuser(self, email, password=None, **extra_fields):
		extra_fields.setdefault("is_staff", True)
		extra_fields.setdefault("is_superuser", True)
		return self.create_user(email, password, roles=["admin"], **extra_fields)