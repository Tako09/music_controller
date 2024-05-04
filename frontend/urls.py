from django.urls import path
from .views import index

app_name = 'frontend' # 他のアプリからfrontendのurlを特定できるようにapp_nameを指定しておく

urlpatterns = [
    path("", index, name=''),
    path("join", index),
    path("create", index),
    path("room/<str:roomCode>", index),
]
