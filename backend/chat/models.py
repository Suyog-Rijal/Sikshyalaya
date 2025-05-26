from django.db import models
from user.models import CustomUser
import uuid


class ChatRoom(models.Model):
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	users = models.ManyToManyField(CustomUser, related_name='chat_rooms')
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ['created_at']

	def __str__(self):
		return f"Chat Room"


class Message(models.Model):
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	room = models.ForeignKey(ChatRoom, related_name='messages', on_delete=models.CASCADE)
	sender = models.ForeignKey(CustomUser, related_name='messages', on_delete=models.CASCADE)
	content = models.TextField()
	timestamp = models.DateTimeField(auto_now_add=True)
	attachment = models.FileField(upload_to='chat-attachments/', blank=True, null=True)

	class Meta:
		ordering = ['timestamp']

	def __str__(self):
		return f"Message from {self.sender} in Room {self.room.id} at {self.timestamp}"
