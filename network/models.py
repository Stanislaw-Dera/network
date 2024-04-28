from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    followers = models.ManyToManyField('self', related_name='following', symmetrical=False, blank=True, null=True)
    # to get all the posts, use u.post_set.all()


class Post(models.Model):
    title = models.CharField(max_length=100)
    body = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(User, related_name='posts_liked', blank=True)

    def serialize(self):
        return {
            'author': self.author.username,
            'title': self.title,
            'body': self.body,
            'date': self.date.strftime("%a, %d %b %Y %H:%M"),
            'likes': self.likes.count()
        }

