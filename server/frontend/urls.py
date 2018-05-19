from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('observe', views.observe, name='observe'),
]
