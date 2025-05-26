import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from chat.models import Message, ChatRoom


class ChatConsumer(AsyncWebsocketConsumer):

	async def connect(self):
		self.user = self.scope["user"]
		if self.user.is_anonymous:
			await self.close()
		else:
			self.group_name = f"user_{self.user.id}"
			await self.channel_layer.group_add(
				self.group_name,
				self.channel_name
			)
			await self.accept()

	async def disconnect(self, close_code):
		await self.channel_layer.group_discard(
			self.group_name,
			self.channel_name
		)

	async def receive(self, text_data):
		data = json.loads(text_data)
		room_id = data["room_id"]
		content = data.get("content", "")

		message = await self.create_message(room_id, self.user.id, content)

		user_ids = await self.get_user_ids_in_room(room_id)

		# Send message to all users in the chat
		for uid in user_ids:
			await self.channel_layer.group_send(
				f"user_{uid}",
				{
					"type": "chat.message",
					"message_id": str(message.id),
					"room_id": str(room_id),
					"sender_id": self.user.id,
					"content": content,
					"timestamp": str(message.timestamp),
				}
			)

	async def chat_message(self, event):
		await self.send(text_data=json.dumps({
			"message_id": event["message_id"],
			"room_id": event["room_id"],
			"sender_id": event["sender_id"],
			"content": event["content"],
			"timestamp": event["timestamp"],
		}))

	@database_sync_to_async
	def create_message(self, room_id, sender_id, content):
		return Message.objects.create(
			room_id=room_id,
			sender_id=sender_id,
			content=content
		)

	@database_sync_to_async
	def get_user_ids_in_room(self, room_id):
		room = ChatRoom.objects.get(id=room_id)
		return list(room.users.values_list("id", flat=True))



