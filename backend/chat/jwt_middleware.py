# middleware/jwt_middleware.py

from urllib.parse import parse_qs
from channels.middleware import BaseMiddleware
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from user.models import CustomUser
from django.conf import settings
from jwt import decode as jwt_decode
from jwt.exceptions import InvalidTokenError
from channels.db import database_sync_to_async


class JWTAuthMiddleware(BaseMiddleware):
	async def __call__(self, scope, receive, send):
		query_string = parse_qs(scope["query_string"].decode())
		token = query_string.get("token", [None])[0]
		if token:
			try:
				UntypedToken(token)

				decoded_data = jwt_decode(token, settings.SECRET_KEY, algorithms=["HS256"])
				user_id = decoded_data.get("user_id")

				user = await self.get_user(user_id)
				scope["user"] = user
			except (InvalidToken, TokenError, InvalidTokenError, KeyError):
				scope["user"] = AnonymousUser()
		else:
			scope["user"] = AnonymousUser()

		return await super().__call__(scope, receive, send)

	@database_sync_to_async
	def get_user(self, user_id):
		try:
			return CustomUser.objects.get(id=user_id)
		except CustomUser.DoesNotExist:
			return AnonymousUser()
