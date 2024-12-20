from rest_framework.views import APIView
from django.shortcuts import render
from rest_framework import generics, permissions
from .models import Book, Review , ReadingProgress
from .serializers import BookSerializer, ReviewSerializer, ProgressSerializer
from rest_framework.response import Response
from rest_framework import status

class BookListView(APIView):
    def get(self, request):
        books = Book.objects.all()
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data)

class UpdateProgressView(APIView):
    def post(self, request):
        serializer = ProgressSerializer(data=request.data)
        if serializer.is_valid():
            progress, created = ReadingProgress.objects.update_or_create(
                user=request.user,
                book_id=serializer.validated_data['book_id'],
                defaults={'current_page': serializer.validated_data['current_page']}
            )
            return Response({"message": "Progress updated successfully"})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProgressView(APIView):
    def get(self, request):
        progress = ReadingProgress.objects.filter(user=request.user)
        serializer = ProgressSerializer(progress, many=True)
        return Response(serializer.data)
    class BookListView(generics.ListCreateAPIView):
        queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class ReviewListCreateView(generics.ListCreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)