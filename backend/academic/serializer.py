# from .models import Class, House, Section
# from rest_framework.serializers import ModelSerializer, Serializer
#
#
# class EnrollmentHouseGetSerializer(ModelSerializer):
# 	class Meta:
# 		model = House
# 		fields = ['id', 'color']
#
#
# class EnrollmentSectionGetSerializer(ModelSerializer):
# 	house = EnrollmentHouseGetSerializer(many=True, read_only=True)
#
# 	class Meta:
# 		model = Section
# 		fields = ['id', 'name', 'house']
#
#
# class EnrollmentClassGetSerializer(ModelSerializer):
# 	sections = EnrollmentSectionGetSerializer(many=True, read_only=True)
#
# 	class Meta:
# 		model = Class
# 		fields = ['id', 'name', 'sections']
