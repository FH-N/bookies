from django.db import models
from django.contrib.auth.models import User
import uuid


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
    bio = models.CharField(max_length=500, blank=True, null=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"
    
class ClubTag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class PostTag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class BookClub(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    owner = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='owned_clubs'
    ) 
    members = models.ManyToManyField(User, related_name='book_clubs')
    club_tags = models.ManyToManyField(ClubTag, related_name='book_clubs', blank=True)  # Tags for the club
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class BookClubPost(models.Model):
    club = models.ForeignKey(BookClub, on_delete=models.CASCADE, related_name='bookclub_posts')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='club_posts')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    post_tags = models.ManyToManyField(PostTag, related_name='bookclub_posts', blank=True) 
    likes = models.ManyToManyField(User, related_name='liked_bookclub_posts', blank=True) 

    def __str__(self):
        return f"Post by {self.author.username} in {self.club.name}"
    
    @property
    def total_likes(self):
        return self.likes.count()


class ClubPost(models.Model): 
    club = models.ForeignKey(BookClub, on_delete=models.CASCADE, related_name='clubpost_posts')
    content = models.TextField()
    likes = models.ManyToManyField(User, related_name='liked_club_posts', blank=True)

    def __str__(self):
        return f"Post in {self.club.name}"
    
    @property
    def total_likes(self):
        return self.likes.count()


class Followings(models.Model):
    id = models.AutoField(primary_key=True)  # Auto-incrementing ID
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="following")  # The user who is following
    followed_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="followers")  # The user being followed

    created_at = models.DateTimeField(auto_now_add=True)  # Optional: Timestamp for when the follow was created

    class Meta:
        unique_together = ('user', 'followed_user')  # Ensure a user cannot follow the same user multiple times

    def __str__(self):
        return f"{self.user.username} follows {self.followed_user.username}"


class ReadingProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    google_books_id = models.CharField(max_length=100)
    current_page = models.PositiveIntegerField()
    updated_at = models.DateTimeField(auto_now=True)

    def calculate_progress_percentage(self):
        return (self.current_page / self.book.total_pages) * 100

    def __str__(self):
        return f"{self.user.username} - {self.book.title}"

class PostReply(models.Model):
    post = models.ForeignKey(BookClubPost, on_delete=models.CASCADE, related_name='replies', blank=True, null=True)
    club_post = models.ForeignKey(ClubPost, on_delete=models.CASCADE, related_name='replies', blank=True, null=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='replies')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Reply by {self.author.username} on post {self.post if self.post else self.club_post}"

class Book(models.Model):
    book_id = models.CharField(max_length=50, primary_key=True)
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    description = models.TextField()
    thumbnail = models.URLField(max_length=1000)
    
    def __str__(self):
        return self.title
    

class Bookshelf(models.Model):
    bookshelf_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='bookshelf')
    books = models.ManyToManyField(Book, related_name='bookshelves', blank=True)

    def __str__(self):
        return f"Bookshelf {self.bookshelf_id} of {self.user.username}"