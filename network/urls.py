
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path('posts', views.posts, name="posts"),
    path("get_current_user", views.get_current_user, name="current_user"),
    path("posts/<int:post_id>/like", views.like, name="like")
]
