# observer.py
class Observer:
    def update(self, *args, **kwargs):
        raise NotImplementedError("Subclasses must implement the update method")

# observers.py
class NotificationObserver(Observer):
    def __init__(self, user):
        self.user = user

    def update(self, message):
        # Import Notification inside the method to avoid circular import
        from .models import Notification
        Notification.objects.create(user=self.user, message=message)
