import math

from django.core.cache import cache
from django.http import JsonResponse


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
        cache.set('page_state', 'map')
    elif command_type == 'weather':
        cache.set('location', (46.557462, 15.645982))
        cache.set('page_state', 'map')
    elif command_type == 'move':
        lat, lon = cache.get('location', (46.557462, 15.645982))
        zoom = cache.get('zoom_level', 10)
        if command_value == 'north':
            lat += 400 / 2**zoom
        elif command_value == 'south':
            lat -= 400 / 2**zoom
        elif command_value == 'east':
            lon += 400.0/math.cos(lat)/2**zoom
        elif command_value == 'west':
            lon -= 400.0/math.cos(lat)/2**zoom
        cache.set('location', (lat, lon))
    elif command_type == 'zoom':
        cache.set('zoom_level', cache.get('zoom_level', 10)+int(command_value))
    elif command_type == 'change_type':
        cache.set('map_type', command_value)

    return JsonResponse({
        'message': 'Successfully received command {}'.format(command_type),
        'success': True
    })
