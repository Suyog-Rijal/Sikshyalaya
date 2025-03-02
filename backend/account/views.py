from rest_framework import status
from rest_framework.permissions import AllowAny

from .models import *
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from .serializer import *


class EnrollmentApiView(APIView):
	permission_classes = [AllowAny]

	def get(self, request):
		try:
			academic_year = AcademicYear.objects.get(is_active=True)
			grade = Grade.objects.all()

			data = {
				'academic_year': AcademicYearSerializer(academic_year).data,
				'grades': SimpleGradeSerializer(grade, many=True).data
			}
			return Response(data, status=status.HTTP_200_OK)
		except Exception as e:
			return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
