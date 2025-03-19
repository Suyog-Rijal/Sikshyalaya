from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from user.models import Parent
from .serializers import ParentListSerializer


class ParentViewSet(ModelViewSet):
	http_method_names = ['get']
	queryset = Parent.objects.filter(relationship='G')
	serializer_class = ParentListSerializer
