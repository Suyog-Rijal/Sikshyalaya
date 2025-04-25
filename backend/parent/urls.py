from rest_framework import routers
from .views import ParentViewSet

router = routers.DefaultRouter()
router.register(r'', ParentViewSet)

urlpatterns = [
]

urlpatterns += router.urls