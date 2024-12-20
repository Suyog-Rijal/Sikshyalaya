import json
from django.urls import reverse
from django.test import TestCase
from rest_framework import status
from django.core.files.uploadedfile import SimpleUploadedFile
from .models import User


class UserCreateTestCase(TestCase):

    def setUp(self):
        self.url = reverse('user-list')
        self.valid_user_data = {
            'email': 'testuser@example.com',
            'password': 'testpassword123',
            'first_name': 'John',
            'last_name': 'Doe',
            'date_of_birth': '1990-01-01',
            'gender': 'm',
            'role': 's',
            'blood_group': 'A+'
        }

    def test_create_user_success(self):
        response = self.client.post(self.url, self.valid_user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['email'], self.valid_user_data['email'])
        self.assertEqual(response.data['first_name'], self.valid_user_data['first_name'])
        self.assertEqual(response.data['last_name'], self.valid_user_data['last_name'])

    def test_create_user_success_with_optional_fields(self):
        valid_user_data_with_picture = self.valid_user_data.copy()
        valid_user_data_with_picture['profile_picture'] = SimpleUploadedFile(name='test_profile_picture.jpg', content=b'file_content', content_type='image/jpeg')
        response = self.client.post(self.url, valid_user_data_with_picture, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['email'], valid_user_data_with_picture['email'])
        self.assertTrue('profile_picture' in response.data)

    def test_create_user_success_with_all_fields(self):
        valid_user_data_with_all_fields = self.valid_user_data.copy()
        valid_user_data_with_all_fields['profile_picture'] = SimpleUploadedFile(name='test_profile_picture.jpg', content=b'file_content', content_type='image/jpeg')
        valid_user_data_with_all_fields['blood_group'] = 'A+'
        response = self.client.post(self.url, valid_user_data_with_all_fields, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['email'], valid_user_data_with_all_fields['email'])
        self.assertEqual(response.data['blood_group'], 'A+')
        self.assertNotIn('password', response.data)

    def test_create_user_duplicate_email(self):
        """Test creating a user with a duplicate email"""
        self.client.post(self.url, self.valid_user_data, format='json')
        response = self.client.post(self.url, self.valid_user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)
        self.assertEqual(response.data['email'][0], 'user with this email already exists.')

    def test_create_user_invalid_role(self):
        """Test creating a user with an invalid role"""
        invalid_role_data = self.valid_user_data.copy()
        invalid_role_data['role'] = 'x'  # Invalid role
        response = self.client.post(self.url, invalid_role_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('role', response.data)
        self.assertEqual(response.data['role'][0], '"x" is not a valid choice.')

    def test_create_user_missing_required_field(self):
        """Test creating a user with missing required field (e.g., email)"""
        invalid_data = self.valid_user_data.copy()
        del invalid_data['email']  
        response = self.client.post(self.url, invalid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

    def test_create_user_invalid_email_format(self):
        """Test creating a user with an invalid email format"""
        invalid_email_data = self.valid_user_data.copy()
        invalid_email_data['email'] = 'invalid_email'
        response = self.client.post(self.url, invalid_email_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)
        self.assertEqual(response.data['email'][0], 'Enter a valid email address.')
