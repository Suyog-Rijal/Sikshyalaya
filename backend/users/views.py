from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from .serializers import EnrollmentFormGetSerializer, EnrollmentSerializer
from .models import Enrollment

# class EnrollmentViewSet(viewsets.ModelViewSet):
#     http_method_names = ['get', 'post']
#
#     def get_queryset(self):
#         return Enrollment.objects.all()
#
#     # Custom GET action using EnrollmentFormGetSerializer
#     @action(detail=False, methods=['get'], serializer_class=EnrollmentFormGetSerializer)
#     def get(self, request):
#         data = self.get_queryset()
#         serializer = EnrollmentFormGetSerializer(data, many=True)  # Ensure using queryset
#         return Response(serializer.data)
#
#     # Dynamic serializer selection
#     def get_serializer_class(self):
#         if self.action == 'get':
#             return EnrollmentFormGetSerializer
#         return EnrollmentSerializer


class EnrollmentViewSet(viewsets.ModelViewSet):
    serializer_class = EnrollmentSerializer
    queryset = Enrollment.objects.all()
