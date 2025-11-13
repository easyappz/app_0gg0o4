from django.contrib import admin
from .models import Member, Ad


@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email', 'phone', 'is_active', 'created_at')
    search_fields = ('username', 'email', 'phone')


@admin.register(Ad)
class AdAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'category', 'price', 'owner', 'created_at')
    list_filter = ('category',)
    search_fields = ('title', 'description')
