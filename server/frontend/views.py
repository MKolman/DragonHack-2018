from django.shortcuts import render


def index(request):
    return render(request, 'index.html')


def observe(request):
    return render(request, 'observe.html')

