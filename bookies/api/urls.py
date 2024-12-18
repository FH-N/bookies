from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BookReviewsView, ReviewView, UpdateReview, DeleteReview, LikeReview, ReplyReview, DeleteReviewReply, DislikeReview, DeleteReviewDisLike, DeleteReviewLike, UpdateReviewReply, BookClubView, JoinBookClubView, LeaveBookClubView, BookClubPostView, ClubTagView, PostTagView

router = DefaultRouter()


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
    path('bookclubs/', BookClubView.as_view(), name='bookclubs-list-create'),
    path('bookclubs/<int:pk>/', BookClubView.as_view(), name='bookclub-detail-update-delete'),
    path('bookclubs/join/<int:club_id>/', JoinBookClubView.as_view(), name='join_book_club'), 
    path('bookclubs/leave/<int:club_id>/', LeaveBookClubView.as_view(), name='leave_book_club'),  
    path('bookclubs/<int:club_id>/posts/', BookClubPostView.as_view(), name='bookclub-posts'),
    path('clubtags/', ClubTagView.as_view(), name='clubtags-list-create'),
    path('clubtags/<int:pk>/', ClubTagView.as_view(), name='clubtag-detail-update-delete'),
    path('posttags/', PostTagView.as_view(), name='posttags-list-create'),
    path('posttags/<int:pk>/', PostTagView.as_view(), name='posttag-detail-update-delete'),

    path('', include(router.urls)),  
]
