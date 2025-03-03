from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import AcademicYear, Class, House, Section, Subject
from .serializer import EnrollmentGetSerializer
from rest_framework.permissions import AllowAny


class EnrollmentApiView(APIView):
	permission_classes = [AllowAny]

	def get(self, request):
		try:
			academic_year = AcademicYear.objects.get(is_active=True)
			classes = Class.objects.all()
			sections = Section.objects.all()
			houses = House.objects.all()
			serializer = EnrollmentGetSerializer({
				"academic_year": academic_year,
				"classes": classes,
				"sections": sections,
				"houses": houses,
			})
			return Response(serializer.data, status=status.HTTP_200_OK)

		except AcademicYear.DoesNotExist:
			return Response({"detail": "No active academic year found."}, status=status.HTTP_404_NOT_FOUND)
