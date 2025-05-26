from django.db.models.functions import Concat
from drf_spectacular.utils import extend_schema
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q, Value, CharField
from rest_framework import status
from django.db.models import Q
from chat.models import ChatRoom
from chat.serializers import SearchSerializer, GetUserSerializer
from user.models import Student, Parent, CustomUser, Staff


@extend_schema(tags=['Chat'])
class SearchApiView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request, q=None):
		try:
			q = q.strip()
			if not q:
				return Response([])

			students = Student.objects.annotate(
				full_name=Concat('first_name', Value(' '), 'last_name', output_field=CharField())
			).filter(
				Q(email__icontains=q) | Q(full_name__icontains=q)
			).distinct()

			staffs = Staff.objects.annotate(
				full_name=Concat('first_name', Value(' '), 'last_name', output_field=CharField())
			).filter(
				Q(email__icontains=q) | Q(full_name__icontains=q)
			).distinct()

			parents = Parent.objects.filter(
				Q(email__icontains=q) | Q(full_name__icontains=q) & Q(relationship__exact='G')
			).distinct()
			users = []
			for student in students:
				users.append({
					"id": CustomUser.objects.get(email=student.email).id,
					"email": student.email,
					"full_name": student.get_fullname(),
					"profile_picture": student.profile_picture if student.profile_picture else None,
					"role": "Student"
				})

			for staff in staffs:
				users.append({
					"id": CustomUser.objects.get(email=staff.email).id,
					"email": staff.email,
					"full_name": staff.get_fullname(),
					"profile_picture": staff.profile_picture if staff.profile_picture else None,
					"role": "Teacher"
				})

			for parent in parents:
				users.append({
					"id": CustomUser.objects.get(email=parent.email).id,
					"email": parent.email,
					"full_name": parent.get_fullname(),
					"profile_picture": parent.profile_picture if parent.profile_picture else None,
					"role": "parent"
				})

			serializer = SearchSerializer(users, many=True, context={'request': request})
			return Response(serializer.data)
		except Exception as e:
			print(f"Error in SearchApiView: {e}")
			return Response({'error': 'Something went wrong!'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@extend_schema(tags=['Chat'])
class GetUsersApiView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request):
		try:
			user = request.user
			rooms = ChatRoom.objects.filter(users=user).prefetch_related('users')
			users = CustomUser.objects.filter(chat_rooms__in=rooms).exclude(id=user.id).distinct()
			serializer = GetUserSerializer(users, many=True, context={'request': request})
			return Response(serializer.data, status=status.HTTP_200_OK)
		except Exception as e:
			print(f"Error in GetUsersApiView: {e}")
			return Response({'error': 'Something went wrong!'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
