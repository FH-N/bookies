from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BookReviewsView, BookClubMembershipViewSet, BookClubDiscussionViewSet, ReviewView, BookClubViewSet

router = DefaultRouter()
router.register(r'book-clubs', BookClubViewSet)
router.register(r'book-club-memberships', BookClubMembershipViewSet)
router.register(r'book-club-discussions', BookClubDiscussionViewSet)

urlpatterns = [
    path('books/', BookReviewsView.as_view(), name='book-list'), 
    path('reviews/', ReviewView.as_view(), name='review-list-create'), 
    path('', include(router.urls)),  
]
