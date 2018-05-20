from django.urls import path

from . import views

urlpatterns = [
    path('command', views.parse_command, name='command'),
    path('set_rotation', views.set_rotation, name='set_rotation'),
    path('get_rotation', views.get_rotation, name='get_rotation'),
    path('arduino', views.arduino, name='arduino'),
]
