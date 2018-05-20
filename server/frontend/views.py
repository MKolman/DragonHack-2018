from django.shortcuts import render
from django.core.cache import cache
from django.http import JsonResponse


def index(request):
    return render(request, 'index.html')

def observe(request):
    return render(request, 'observe.html')

def vr(request):
    return render(request, 'vr.html')

def mobilevr(request):
    return render(request, 'mobilevr.html')

def get_state(request):
    return JsonResponse({
        'page_state': cache.get('page_state', None),
        'location': cache.get('location', None),
        'zoom_level': cache.get('zoom_level', 10),
        'map_type': cache.get('map_type', 'default'),
    })
