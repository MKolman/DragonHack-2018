from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('observe', views.observe, name='observe'),
    path('state', views.get_state, name='state'),
    path('vr', views.vr, name='vr'),
]
