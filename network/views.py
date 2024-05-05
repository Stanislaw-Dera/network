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


def get_current_user(request):
    if request.user:
        return JsonResponse({'current_user_id': request.user.id})
    else:
        return JsonResponse({'error': 'you are not logged in'}, status=401)


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


def profile(request, user_id):
    if request.method == 'GET':
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=400)

        return JsonResponse({'user_data': user.profile_data()})


def user_posts(request, user_id):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=400)

    # duplicate, but no idea how to implement it differently
    start = int(request.GET.get("start") or 0)
    end = int(request.GET.get("end") or (start + 9))
    data = []

    for i in range(end - start + 1):
        try:
            data.append(user.post_set.order_by('-date')[i + start].serialize())
        except IndexError:
            time.sleep(1)
            return JsonResponse(data, safe=False)

    time.sleep(1)
    return JsonResponse(data, safe=False)


@login_required(redirect_field_name=None)
def following_posts(request):

    # duplicate, but no idea how to implement it differently
    start = int(request.GET.get("start") or 0)
    end = int(request.GET.get("end") or (start + 9))
    data = []
    temp = []
    following = request.user.following.all()
    print(following)

    posts = Post.objects.filter(author__in=following).order_by('-date')
    print(posts)

    for i in range(end - start + 1):
        try:
            data.append(posts[i+start].serialize())
        except IndexError:
            time.sleep(1)
            return JsonResponse(data, safe=False)

    time.sleep(1)
    return JsonResponse(data, safe=False)


@login_required(redirect_field_name=None)
def follow(request, user_id):
    current_user = request.user
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=400)

    if request.method == 'GET':

        if user_id == current_user.id:
            return JsonResponse({'following': "It's your profile!"}, status=200)
        elif current_user in user.followers.all():
            return JsonResponse({'following': True}, status=200)
        else:
            return JsonResponse({'following': False}, status=200)

    elif request.method == 'POST':
        if user_id == current_user.id:
            return JsonResponse({'error': "you can't follow yourself"}, status=400)

        elif current_user not in user.followers.all():
            user.followers.add(current_user)
            return JsonResponse({'following': True}, status=200)

        else:
            user.followers.remove(current_user)
            return JsonResponse({'following': False}, status=200)
