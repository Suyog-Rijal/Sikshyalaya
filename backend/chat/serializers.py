from chat.models import ChatRoom, Message
from user.models import CustomUser
from rest_framework import serializers


class SearchSerializer(serializers.Serializer):
	id = serializers.UUIDField()
	email = serializers.EmailField()
	full_name = serializers.CharField()
	profile_picture = serializers.ImageField(allow_null=True, required=False)
	role = serializers.CharField()


class MessageSerializer(serializers.ModelSerializer):
	class Meta:
		model = Message
		fields = [
			'id',
			'sender',
			'content',
			'timestamp',
		]


class GetUserSerializer(serializers.Serializer):
	id = serializers.UUIDField()
	room_id = serializers.SerializerMethodField()
	email = serializers.EmailField()
	full_name = serializers.SerializerMethodField()
	profile_picture = serializers.SerializerMethodField()
	roles = serializers.SerializerMethodField()
	messages = serializers.SerializerMethodField()

	def get_full_name(self, obj):
		return obj.get_fullname()

	def get_profile_picture(self, obj):
		request = self.context.get('request')
		return request.build_absolute_uri(obj.get_profile_pic()) if obj.get_profile_pic() else None

	def get_roles(self, obj):
		return obj.get_roles_display()

	def get_room_id(self, obj):
		try:
			user_1 = self.context['request'].user
			user_2 = obj
			room = ChatRoom.objects.filter(users__in=[user_1, user_2]).distinct()
			if room.exists():
				return room.first().id
			else:
				return None
		except Exception as e:
			print(f"Error getting room ID: {e}")
			return None

	def get_messages(self, obj):
		try:
			room_id = self.get_room_id(obj)
			if room_id:
				messages = Message.objects.filter(room_id=room_id).order_by('timestamp')
				return MessageSerializer(messages, many=True, context=self.context).data
			return []
		except Exception as e:
			print(f"Error getting messages: {e}")
			return []