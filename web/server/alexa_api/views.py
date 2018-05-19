from django.http import JsonResponse

# Create your views here.
def parse_command(request, command):
    return JsonResponse({
        'message': 'Successfully received command {}'.format(command),
        'success': True
    })
