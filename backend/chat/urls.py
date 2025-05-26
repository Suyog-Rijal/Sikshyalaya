from django.urls import path
from .views import SearchApiView, GetUsersApiView

urlpatterns = [
	path('search-user/<str:q>/', SearchApiView.as_view(), name='search'),
	path('get-users/', GetUsersApiView.as_view(), name='get-users'),
]
