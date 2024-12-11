from django.db import models
from django.contrib.auth.models import User,AbstractUser,Group, Permission
from django.utils.text import slugify
from django.contrib.auth.hashers import make_password , check_password

class User(AbstractUser):
    USER_TYPE_CHOICES = (
        ('author', 'Author'),
        ('reader', 'Reader'),
    )

    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default='reader')
    bio = models.TextField(blank=True, null=True)

    groups = models.ManyToManyField(
        Group,
        related_name="custom_user_set",  # Avoid clash with the default 'user_set'
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="custom_user_permissions",  # Avoid clash with the default 'user_set'
        blank=True,
    )

class Book(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=255)

class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  
    google_books_id = models.CharField(max_length=100)
    content = models.TextField()
    rating = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.user.username} on {self.book.title}"
    

class BookClub(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    slug = models.SlugField(unique=True, blank=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="owned_clubs")
    members = models.ManyToManyField(User, through="BookClubMembership", related_name="book_clubs")
    is_private = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class BookClubMembership(models.Model):
    ROLE_CHOICES = [
        ('member', 'Member'),
        ('moderator', 'Moderator'),
        ('owner', 'Owner'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="club_memberships")
    book_club = models.ForeignKey(BookClub, on_delete=models.CASCADE, related_name="memberships")
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='member')
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'book_club')

    def __str__(self):
        return f"{self.user.username} - {self.book_club.name} ({self.role})"

class BookClubDiscussion(models.Model):
    book_club = models.ForeignKey(BookClub, on_delete=models.CASCADE, related_name="discussions")
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="discussions")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} ({self.book_club.name})"
