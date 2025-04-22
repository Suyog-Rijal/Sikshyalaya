from django.shortcuts import render
from django.contrib.auth import authenticate
from drf_spectacular.utils import extend_schema, OpenApiResponse
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser
from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import serializers


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
		print("User: ", user)
		if user is None:
			return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

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
				"role": user.roles,
			}
		)
