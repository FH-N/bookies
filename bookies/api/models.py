from django.db import models
from django.contrib.auth.models import User,AbstractUser
from django.utils.text import slugify
from django.contrib.auth.hashers import make_password , check_password


class Book(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=255)

    def __str__(self):
        return self.title

class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    google_books_id = models.CharField(max_length=100)
    content = models.TextField()
    rating = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    likes_count = models.PositiveIntegerField(default=0)
    dislikes_count = models.PositiveIntegerField(default=0)
    

    def __str__(self):
        return f"Review by {self.user.username} for Google Book ID {self.google_books_id}"

class ReviewReply(models.Model):
    review = models.ForeignKey(Review, related_name='replies', on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Reply by {self.user.username} on Review ID {self.review.id}"
    
class ReviewLike(models.Model):
    review = models.ForeignKey(Review, related_name='likes', on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} liked {self.review.id}"
    
class ReviewDisLike(models.Model):
    review = models.ForeignKey(Review, related_name='dislikes', on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username} disliked {self.review.id}"
    
    
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



class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('User', 'User'),
        ('Author', 'Author'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='User')  # Dropdown field for roles

    def __str__(self):
        return f"{self.user.username}'s Profile"
