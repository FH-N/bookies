from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BookReviewsView, BookClubMembershipViewSet, BookClubDiscussionViewSet, ReviewView, BookClubViewSet , BookReviewsLike,BookReviewsReply

router = DefaultRouter()
router.register(r'book-clubs', BookClubViewSet)
router.register(r'book-club-memberships', BookClubMembershipViewSet)
router.register(r'book-club-discussions', BookClubDiscussionViewSet)

urlpatterns = [
    path('books/', BookReviewsView.as_view(), name='book-list'), 
    path('reviews/', ReviewView.as_view(), name='review-list-create'), 
    path('reviews/<int:review_id>/like/', BookReviewsLike.as_view(), name='like_review'),
    path('reviews/<int:review_id>/reply/', BookReviewsReply.as_view(), name='reply_review'),
    path('books/<str:google_books_id>/reviews/', BookReviewsView.as_view(), name='book_reviews'),
    path('', include(router.urls)),  
]
