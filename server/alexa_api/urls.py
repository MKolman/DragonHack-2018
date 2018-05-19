from django.urls import path

from . import views

urlpatterns = [
    path('command/<command>', views.parse_command, name='command'),
]
