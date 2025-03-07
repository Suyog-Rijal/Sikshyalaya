from django.shortcuts import render
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from academic.serializer import EnrollmentSerializer
from user.serializer import StudentSerializer


class EnrollmentApiView(APIView):
	permission_classes = [AllowAny]

	def post(self, request):
		print(request.data)
		try:
			student_info = request.data.get('student_info')
			father_info = request.data.get('father_info')
			mother_info = request.data.get('mother_info')
			guardian_info = request.data.get('guardian_info')
			enrollment_info = request.data.get('enrollment_info')

			student_serializer = StudentSerializer(data=student_info)
			student_serializer.is_valid(raise_exception=True)




			return Response({'message': 'Student enrolled successfully'}, status=status.HTTP_201_CREATED)

		except Exception as e:
			return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)