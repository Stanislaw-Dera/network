# Generated by Django 5.0.4 on 2024-04-27 16:45

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0005_user_following'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='following',
        ),
        migrations.DeleteModel(
            name='UserProfile',
        ),
    ]
