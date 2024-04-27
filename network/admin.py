from django.contrib import admin
from network.models import User, Post


# Register your models here.
class NetworkAdmin(admin.ModelAdmin):
    pass


class PostAdmin(admin.ModelAdmin):
    readonly_fields = ('date',)


admin.site.register(User, NetworkAdmin)
admin.site.register(Post, PostAdmin)
