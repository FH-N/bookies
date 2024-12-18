from django.contrib import admin
from django.contrib.auth.models import User
from .models import (
    UserProfile,
    Review, 
    ReviewReply, 
    ReviewLike, 
    ReviewDisLike, 
    BookClub, 
    Tag,
)

# Inline UserProfile for User
class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False

class CustomUserAdmin(admin.ModelAdmin):
    inlines = (UserProfileInline,)

class ReviewAdmin(admin.ModelAdmin):
    list_display = ('user', 'google_books_id', 'rating', 'created_at')
    search_fields = ('user__username', 'google_books_id')
    list_filter = ('rating', 'created_at')


class TagAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)


class BookClubAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description', 'created_at')
    search_fields = ('name', 'description')
    filter_horizontal = ('members', 'tags')  # For ManyToManyFields
    list_filter = ('created_at',)
    autocomplete_fields = ('tags',)  # Enables autocomplete for tags if there are many
    raw_id_fields = ('members',) 

class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role')

# Register models with customization
admin.site.register(Review, ReviewAdmin)
admin.site.register(ReviewReply)
admin.site.register(ReviewLike)
admin.site.register(ReviewDisLike)
admin.site.register(BookClub, BookClubAdmin)
admin.site.register(UserProfile, UserProfileAdmin)
admin.site.register(Tag, TagAdmin)

# Unregister the default User admin and register the custom one
admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)
