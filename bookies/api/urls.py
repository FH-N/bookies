from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuthorListView, BookClubMembershipViewSet, BookClubDiscussionViewSet, BookClubViewSet , BookReviewsView, ReviewView, UpdateReview, DeleteReview, LikeReview, ReplyReview, DeleteReviewReply, DislikeReview, DeleteReviewDisLike, DeleteReviewLike, UpdateReviewReply, UpdateUserAPIView, UserDetailByUserIdAPIView, UserDetailByUsernameAPIView

router = DefaultRouter()
router.register(r'book-clubs', BookClubViewSet)
router.register(r'book-club-memberships', BookClubMembershipViewSet)
router.register(r'book-club-discussions', BookClubDiscussionViewSet)

urlpatterns = [
    path('books/', BookReviewsView.as_view(), name='book-list'), 
    path('reviews/', ReviewView.as_view(), name='review-list-create'), 
    path('reviews/<int:review_id>/update', UpdateReview.as_view(), name="update-review"),
    path('reviews/<int:review_id>/delete/', DeleteReview.as_view(), name="delete-review"),
    path('reviews/<int:review_id>/like/', LikeReview.as_view(), name='like_review'),
    path('reviews/<int:review_id>/like/delete', DeleteReviewLike.as_view(), name="delete-review"),
    path('reviews/<int:review_id>/reply/', ReplyReview.as_view(), name='reply_review'),
    path('reviews/reply/<int:reply_id>/delete/', DeleteReviewReply.as_view(), name="delete-reply"),
    path('reviews/reply/<int:reply_id>/update/', UpdateReviewReply.as_view(), name="delete-reply"),
    path('books/<str:google_books_id>/reviews/', BookReviewsView.as_view(), name='book_reviews'),
    path('reviews/<int:review_id>/dislike/', DislikeReview.as_view(), name='dislike_review'),
    path('reviews/<int:review_id>/dislike/delete', DeleteReviewDisLike.as_view(), name="delete-review"),
    path('user/', UserDetailByUserIdAPIView.as_view(), name='user-detail-by-userid'),
    path('update-user/', UpdateUserAPIView.as_view(), name='update-user'),
    path('authors/', AuthorListView.as_view(), name='author-list'),

    path('', include(router.urls)),  
]
