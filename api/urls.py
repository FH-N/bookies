from django.urls import path
from .views import BookListView, ReviewListCreateView 
from .views import BookListView, UpdateProgressView, UserProgressView

urlpatterns = [
    path('books/', BookListView.as_view(), name='book-list'),
    path('api/', ReviewListCreateView.as_view(), name='review-list-create'),
    path('progress/update/', UpdateProgressView.as_view(), name='update-progress'),
    path('progress/user/', UserProgressView.as_view(), name='user-progress'),
]
