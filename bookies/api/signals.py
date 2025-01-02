from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from allauth.socialaccount.models import SocialAccount
from .models import UserProfile, Bookshelf, BookClubPost, Notification

# Signal to handle User creation and Social Account login
@receiver(post_save, sender=User)
def create_user_related_objects(sender, instance, created, **kwargs):
    """
    Automatically create UserProfile and Bookshelf when a User is created.
    This handles both regular User creation and Google login.
    """
    if created:
        # Create UserProfile
        UserProfile.objects.create(user=instance)

        # Create Bookshelf
        Bookshelf.objects.create(user=instance)

    # Always save the UserProfile (for regular or Google logins)
    if instance.profile:
        instance.profile.save()

# Signal to handle Google login and UserProfile creation
@receiver(post_save, sender=SocialAccount)
def create_user_profile_for_google(sender, instance, created, **kwargs):
    """
    Create a UserProfile and Bookshelf when a User logs in via Google.
    """
    if created:
        # Check if the social account is for Google login
        if instance.provider == "google":
            user = instance.user
            # Create related objects (UserProfile and Bookshelf)
            UserProfile.objects.get_or_create(user=user)
            Bookshelf.objects.get_or_create(user=user)

@receiver(post_save, sender=BookClubPost)
def send_notification_to_club_members(sender, instance, created, **kwargs):
    if created:  # Ensure the signal only triggers for new posts
        club = instance.book_club
        members = club.members.all()  # Assuming a ManyToManyField for members in the BookClub model
        for member in members:
            if member != instance.author:  # Avoid notifying the post's author
                Notification.objects.create(
                    user=member,
                    message=f"New post in '{club.name}' by {instance.author.username}: {instance.title}"
                )