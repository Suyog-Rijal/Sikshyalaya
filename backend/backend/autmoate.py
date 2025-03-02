import subprocess
import os
import django
from django.contrib.auth import get_user_model
from django.apps import apps

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()


def run_django_command(command):
	manage_py_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../manage.py')
	subprocess.run([r'D:\Temp\FYP\backend\.venv\Scripts\python.exe', manage_py_path, command], check=True)


def create_superuser():
	User = get_user_model()
	if not User.objects.filter(email='admin@admin.com').exists():
		User.objects.create_superuser(
			email='admin@admin.com',
			password='admin',
			first_name='Admin',
			last_name='Admin'
		)
		print("Superuser created.")
	else:
		print("Superuser already exists.")


def clear_migrations():
	print("Cleaning up migration files...")
	for app_config in apps.get_app_configs():
		if app_config.name.startswith('django'):
			continue

		migration_dir = os.path.join(app_config.path, 'migrations')
		if os.path.exists(migration_dir):
			for filename in os.listdir(migration_dir):
				if filename.endswith('.py') and filename != '__init__.py':
					file_path = os.path.join(migration_dir, filename)
					os.remove(file_path)
					print(f"Deleted migration file: {file_path}")


def main():
	clear_migrations()

	print("Running make migrations...")
	run_django_command('makemigrations')

	print("Running migrate...")
	run_django_command('migrate')

	print("Creating superuser...")
	create_superuser()

	print("Setup completed successfully!")


if __name__ == '__main__':
	main()
