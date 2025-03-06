from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from user.serializer import AddStudentSerializer


class EnrollmentApiView(APIView):
	permission_classes = [AllowAny]

	# def get(self, request):
	# 	try:
	# 		classes = Class.objects.prefetch_related(
	# 			'sections',
	# 			'sections__house'
	# 		)
	# 		serializer = EnrollmentClassGetSerializer(classes, many=True)
	# 		return Response(serializer.data, status=status.HTTP_200_OK)
	# 	except Exception as e:
	# 		return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

	def post(self, request):
		try:
			serializer = AddStudentSerializer(data=request.data.get('personal_info'))
			serializer.is_valid(raise_exception=True)
			serializer.save()
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		except Exception as e:
			return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
