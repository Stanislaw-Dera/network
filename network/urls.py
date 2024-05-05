
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("post", views.post, name="post"),
    path('posts', views.posts, name="posts"),
    path('following', views.following_posts, name="following"),
    path("get_current_user", views.get_current_user, name="current_user"),
    path("posts/<int:post_id>/like", views.like, name="like"),
    path("profile/<int:user_id>", views.profile, name="profile"),
    path("profile/<int:user_id>/posts", views.user_posts, name="user_posts"),
    path("profile/<int:user_id>/follow", views.follow, name="follow")
]
