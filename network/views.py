import time

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.core.serializers import serialize
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_protect, requires_csrf_token

from .models import User, Post


def index(request):
    return render(request, "network/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")


def posts(request):
    start = int(request.GET.get("start") or 0)
    end = int(request.GET.get("end") or (start + 9))
    data = []

    for i in range(end-start+1):
        try:
            data.append(Post.objects.order_by('-date')[i+start].serialize())
        except IndexError:
            time.sleep(1)
            return JsonResponse(data, safe=False)

    time.sleep(1)
    return JsonResponse(data, safe=False)


@requires_csrf_token
@login_required(redirect_field_name=None)
def post(request):
    if request.method == "POST":
        print('Post data: ', request.POST.get('body'))

        post = Post(
            body=request.POST.get("body"),
            author=request.user,
        )
        post.save()
        if post.body == '':
            return JsonResponse({"error": "post body is empty"}, status=400)

        print(post.serialize())
        return JsonResponse({"you post!": f'{post.body}'})


@login_required(redirect_field_name=None)
def get_current_user(request):
    return JsonResponse({'current_user_id': request.user.id})


@login_required(redirect_field_name=None)
def like(request, post_id):
    current_user = request.user
    post = Post.objects.get(id=post_id)

    if request.method == "POST":
        if current_user in post.likes.all():
            post.likes.remove(current_user)
            return JsonResponse({'liked': False})
        else:
            post.likes.add(current_user)
            return JsonResponse({'liked': True})
    elif request.method == "GET":
        if current_user in post.likes.all():
            return JsonResponse({'liked': True})
        else:
            return JsonResponse({'liked': False})
