from django.shortcuts import render
from django.contrib.auth import authenticate
from drf_spectacular.utils import extend_schema, OpenApiResponse
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
from rest_framework_simplejwt.tokens import RefreshToken

from academic.models import Section
from .models import CustomUser, Student, Leave, Staff, Teacher
from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import serializers

from .serializer import LeaveMeSerializer, LeaveMePostSerializer, LeaveGetSerializer, LeaveUpdateSerializer, \
	MeSerializer


class LoginView(APIView):
	permission_classes = [AllowAny]

	@extend_schema(
		tags=["Authentication"],
		request=inline_serializer(
			name="LoginRequest",
			fields={
				"role": serializers.CharField(),
				"email": serializers.EmailField(),
				"password": serializers.CharField(),
			}
		),
		responses={200: OpenApiResponse(description="Login successful")},
	)
	def post(self, request):
		try:
			role = request.data["role"]
			email = request.data["email"]
			password = request.data["password"]
		except KeyError:
			return Response({"error": "Role, email, and password are required"}, status=status.HTTP_400_BAD_REQUEST)

		user = authenticate(request, email=email, password=password, role=role)
		if user is None:
			return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

		full_name = user.get_fullname() if user else None
		if hasattr(user, 'profile_picture') and user.profile_picture:
			profile_picture = request.build_absolute_uri(user.profile_picture.url)
		else:
			profile_picture = request.build_absolute_uri('/static/admin.png')

		user = CustomUser.objects.get(email=email)
		if not user.is_active:
			return Response({"error": "User is inactive"}, status=status.HTTP_403_FORBIDDEN)

		existing_tokens = OutstandingToken.objects.filter(user=user)
		if existing_tokens:
			for token in existing_tokens:
				if not BlacklistedToken.objects.filter(token=token).exists():
					BlacklistedToken.objects.create(token=token)

		refresh = RefreshToken.for_user(user)
		return Response(
			{
				"refresh": str(refresh),
				"access": str(refresh.access_token),
				"full_name": full_name,
				"profile_picture": profile_picture,
				"role": user.roles,
			}
		)


@extend_schema(tags=['Leave'])
class LeaveApiStudentView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request):
		if not request.user.has_role('student'):
			return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
		try:
			student = Student.objects.get(email=request.user.email)
			leaves = student.leaves.all()
			serializer = LeaveMeSerializer(leaves, many=True)
			return Response(serializer.data, status=status.HTTP_200_OK)
		except Exception as e:
			print(e)
			return Response({"error": "An error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

	@extend_schema(
		tags=['Leave'],
		request=LeaveMePostSerializer,
		responses={201: LeaveMePostSerializer},
	)
	def post(self, request):
		if not request.user.has_role('student'):
			return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

		serializer = LeaveMePostSerializer(data=request.data, context={'request': request})
		serializer.is_valid(raise_exception=True)
		serializer.save()
		return Response(serializer.data, status=status.HTTP_201_CREATED)


@extend_schema(tags=['Leave'])
class LeaveDeleteView(APIView):
	permission_classes = [IsAuthenticated]

	def delete(self, request, leave_id):
		if not request.user.has_role('student'):
			return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
		try:
			leave = Leave.objects.get(id=leave_id, student__email=request.user.email)
			leave.delete()
			return Response(status=status.HTTP_204_NO_CONTENT)
		except Exception as e:
			print(e)
			return Response({"error": "An error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@extend_schema(tags=['Leave'])
class LeaveAdminViewSet(ModelViewSet):
	http_method_names = ['get', 'put', 'delete']
	permission_classes = [IsAuthenticated]
	queryset = Leave.objects.all()
	serializer_class = LeaveGetSerializer

	def get_serializer_class(self):
		if self.action == 'list':
			return LeaveGetSerializer
		elif self.action == 'update':
			return LeaveUpdateSerializer
		return LeaveGetSerializer

	def get_queryset(self):
		if self.request.user.has_role('admin'):
			return Leave.objects.all()
		elif self.request.user.has_role('teacher'):
			user = self.request.user
			teacher = Teacher.objects.get(staff__email=user.email)
			section = Section.objects.filter(class_teacher=teacher).first()
			teacher_class = Section.objects.filter(class_teacher=teacher)
			return Leave.objects.filter(student__enrollments__section=section)
		else:
			return Leave.objects.none()


@extend_schema(tags=['Authentication'])
class MeView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request, id=None):
		try:
			student = Student.objects.get(id=id).select_related('enrollments')
			serializer = MeSerializer(student)
		except CustomUser.DoesNotExist:
			return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
