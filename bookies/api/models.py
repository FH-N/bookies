from django.db import models
from django.contrib.auth.models import User, AbstractUser
from django.utils.text import slugify
from django.contrib.auth.hashers import make_password , check_password


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


class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('User', 'User'),
        ('Author', 'Author'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='User')  

    def __str__(self):
        return f"{self.user.username}'s Profile"


class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class BookClub(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    members = models.ManyToManyField(User, related_name='book_clubs')
    tags = models.ManyToManyField(Tag, related_name='book_clubs', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class BookClubPost(models.Model):
    club = models.ForeignKey(BookClub, on_delete=models.CASCADE, related_name='bookclub_posts')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='club_posts')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Post by {self.author.username} in {self.club.name}"


class ClubPost(models.Model):  # Assuming this is another model you already have
    club = models.ForeignKey(BookClub, on_delete=models.CASCADE, related_name='clubpost_posts')
    content = models.TextField()

    def __str__(self):
        return f"Post in {self.club.name}"

