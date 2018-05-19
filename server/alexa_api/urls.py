from django.urls import path

from . import views

urlpatterns = [
    path('command', views.parse_command, name='command'),
]
