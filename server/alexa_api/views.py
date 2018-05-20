import math
from datetime import datetime

from django.core.cache import cache
from django.http import JsonResponse, HttpResponse



def gps_from_location(location):
    from geopy.geocoders import Nominatim
    geolocator = Nominatim()
    location = geolocator.geocode(location)
    return location.latitude, location.longitude


# Create your views here.
def parse_command(request):
    # init, location, weather, zoom in/out, move left/west, type change
    # cache: pages state (null, intro, map, vr), location, zoom level(def:10), map type
    if request.method == 'GET':
        data = request.GET
    elif request.method == 'POST':
        data = request.POST

    command_type = data.get('type')
    command_value = data.get('value')
    if command_type == 'reset':
        cache.set('page_state', None)
        cache.set('location', None)
        cache.set('zoom_level', 10)
        cache.set('map_type', 'default')
    elif command_type == 'init':
        cache.set('page_state', 'intro')
        cache.set('zoom_level', 10)
    elif command_type == 'location':
        cache.set('location', gps_from_location(command_value))
        send_location_to_arduino()
        if cache.get('page_state', 'intro') == 'intro':
            cache.set('page_state', 'map')
    elif command_type == 'weather':
        cache.set('location', (46.557462, 15.645982))
        send_location_to_arduino()
        if cache.get('page_state', 'intro') == 'intro':
            cache.set('page_state', 'map')
    elif command_type == 'move':
        lat, lon = cache.get('location', (46.557462, 15.645982))
        zoom = cache.get('zoom_level', 10)
        if command_value == 'north':
            lat += 400 / 2**zoom
        elif command_value == 'south':
            lat -= 400 / 2**zoom
        elif command_value == 'east':
            lon -= 400.0/math.cos(lat)/2**zoom
        elif command_value == 'west':
            lon += 400.0/math.cos(lat)/2**zoom
        cache.set('location', (lat, lon))
        send_location_to_arduino()
    elif command_type == 'zoom':
        cache.set('zoom_level', cache.get('zoom_level', 10)+int(command_value))
    elif command_type == 'change_type':
        cache.set('map_type', command_value)
    elif command_type == 'vr':
        cache.set('page_state', 'vr')

    return JsonResponse({
        'message': 'Successfully received command {}'.format(command_type),
        'success': True
    })


def set_rotation(request):
    if request.method == 'GET':
        data = request.GET
    elif request.method == 'POST':
        data = request.POST

    cache.set('rotation_data', (data.get('x'), data.get('y'), data.get('z')))
    return JsonResponse({
        'success': True
    })


def get_rotation(request):
    x, y, z = cache.get('rotation_data', (0, 0, 0))
    return JsonResponse({
        'success': True,
        'x': x,
        'y': y,
        'z': z,
    })


def arduino(request):
    """ Get and save arduino IP """
    cache.set('arduino_ip', request.GET.get('ip', None), 3600*24)
    n1, n2 = 1, 1
    return HttpResponse('{} {}'.format(n1, n2))


def send_location_to_arduino():
    if cache.get('location', None) is None or cache.get('arduino_ip', '193.2.178.222') is None:
        return
    from urllib import request
    lat, lon = cache.get('location', None)
    lat, lon = int(lat), int(lon)
    request.urlopen('http://{}/body?lat={}&lon={}'.format(cache.get('arduino_ip'), lat, lon), timeout=1)
