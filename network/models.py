from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    followers = models.ManyToManyField('self', related_name='following', symmetrical=False, blank=True, null=True)
    # to get all the posts, use u.post_set.all()

    def profile_data(self):
        return {
            'username': self.username,
            'followers_count': self.followers.count(),
            'following_count': self.following.count()
        }


class Post(models.Model):
    body = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(User, related_name='posts_liked', blank=True)

    def serialize(self):
        return {
            'id': self.id,
            'author': self.author.username,
            'body': self.body,
            'date': self.date.strftime("%a, %d %b %Y %H:%M"),
            'likes': self.likes.count()
        }

