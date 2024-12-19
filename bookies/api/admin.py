from django.contrib import admin
from django.contrib.auth.models import User
from .models import (
    UserProfile,
    Review, 
    ReviewReply, 
    ReviewLike, 
    ReviewDisLike, 
    BookClub, 
    ClubTag,
    PostTag,
)

# Inline UserProfile for User
class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False

class CustomUserAdmin(admin.ModelAdmin):
    search_fields = ('username', 'email')
    inlines = (UserProfileInline,)

class ReviewAdmin(admin.ModelAdmin):
    list_display = ('user', 'google_books_id', 'rating', 'created_at')
    search_fields = ('user__username', 'google_books_id')
    list_filter = ('rating', 'created_at')


class ClubTagAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

class PostTagAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)


class BookClubAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'owner', 'description', 'created_at')  # Added 'owner'
    search_fields = ('name', 'description', 'owner__username')  # Allow searching by owner's username
    filter_horizontal = ('members', 'club_tags')  # For ManyToManyFields
    list_filter = ('created_at', 'owner')  # Allow filtering by owner
    autocomplete_fields = ('club_tags', 'owner')  # Enable autocomplete for owner and tags
    raw_id_fields = ('members',)  # Display raw IDs for members for performance optimization


class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role')

# Register models with customization
admin.site.register(Review, ReviewAdmin)
admin.site.register(ReviewReply)
admin.site.register(ReviewLike)
admin.site.register(ReviewDisLike)
admin.site.register(BookClub, BookClubAdmin)
admin.site.register(UserProfile, UserProfileAdmin)
admin.site.register(ClubTag, ClubTagAdmin)
admin.site.register(PostTag, PostTagAdmin)

# Unregister the default User admin and register the custom one
admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)
