from django.contrib import admin
from .models import ChatRoom, Message


@admin.register(ChatRoom)
class ChatRoomAdmin(admin.ModelAdmin):
	list_display = ('id', 'created_at')
	search_fields = ('id',)
	readonly_fields = ('created_at',)


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
	list_display = ('id', 'room', 'sender', 'timestamp')
	search_fields = ('room__id', 'sender__email', 'content')
	readonly_fields = ('timestamp',)

