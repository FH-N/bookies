# Django and DRF imports
from django.shortcuts import redirect
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required

# Third-party imports
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework import generics, status, viewsets, permissions, serializers
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework_simplejwt.tokens import RefreshToken
from allauth.socialaccount.models import SocialToken, SocialAccount
import json

# Local imports
from .models import Review, BookClub, BookClubMembership, BookClubDiscussion,ReviewReply,ReviewLike,ReviewDisLike
from .serializers import ReviewSerializer, UserSerializer, BookClubSerializer, BookClubMembershipSerializer, BookClubDiscussionSerializer,ReviewReplySerializer,ReviewLikeSerializer,ReviewDisLikeSerializer

from django.contrib.auth import authenticate


User = get_user_model()

class UserCreate(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class UserDetailView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    

@login_required
def google_login_callback(request):
    user = request.user

    social_accounts = SocialAccount.objects.filter(user=user)
    print("Social Account for user:", social_accounts)

    social_account = social_accounts.first()

    if not social_account:
        print("No social account for user:", user)
        return redirect('http://localhost:5173/login/callback/?error=NoSocialAccount')
    
    token = SocialToken.objects.filter(account=social_account, account__provider='google').first()

    if token:
        print('Google token found:', token.token)
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        return redirect(f'http://localhost:5173/login/callback/?access_token={access_token}')
    else:
        print('No Google token found for user', user)
        return redirect(f'http://localhost:5173/login/callback/?error=NoGoogleToken')

@csrf_exempt
def validate_google_token(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            google_access_token = data.get('access_token')
            print(google_access_token)

            if not google_access_token:
                return JsonResponse({'detail': 'Access Token is missing.'}, status=400)
            return JsonResponse({'valid': True})
        except json.JSONDecodeError:
            return JsonResponse({'detail': 'Invalid JSON.'}, status=400)
    return JsonResponse({'detail': 'Method not allowed.'}, status=405)



class ReviewView(APIView):
    permission_classes = [IsAuthenticated]  # Set default permissions

    # POST: Create a new review
    def post(self, request):
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # GET: Get all reviews
    def get(self, request):
        reviews = Review.objects.all()
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

class UpdateReview(APIView):
    # PUT: Update a review
    def put(self, request, review_id):
        try:
            review = Review.objects.get(id=review_id, user=request.user)
            serializer = ReviewSerializer(review, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Review.DoesNotExist:
            return Response({"error": "Review not found or permission denied."}, status=status.HTTP_404_NOT_FOUND)

class DeleteReview(APIView):
    # DELETE: Delete a review
    def delete(self, request, review_id):
        try:
            review = Review.objects.get(id=review_id, user=request.user)
            review.delete()
            return Response({"message": "Review deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except Review.DoesNotExist:
            return Response({"error": "Review not found or permission denied."}, status=status.HTTP_404_NOT_FOUND)

class LikeReview(APIView):
    permission_classes = [IsAuthenticated]

    # POST: Like a review
    def post(self, request, review_id):
        try:
            review = Review.objects.get(id=review_id)

            # If the user has already disliked the review, remove the dislike and add a like
            if ReviewDisLike.objects.filter(review=review, user=request.user).exists():
                # Remove the dislike
                ReviewDisLike.objects.filter(review=review, user=request.user).delete()
                review.dislikes_count -= 1
                review.save()

            # Check if the user has already liked the review
            if ReviewLike.objects.filter(review=review, user=request.user).exists():
                return Response({"error": "You have already liked this review."}, status=status.HTTP_400_BAD_REQUEST)

            # Create a like for the review
            ReviewLike.objects.create(review=review, user=request.user)
            review.likes_count += 1
            review.save()

            return Response({"likes": review.likes_count}, status=status.HTTP_200_OK)
        except Review.DoesNotExist:
            return Response({"error": "Review not found"}, status=status.HTTP_404_NOT_FOUND)

        
    # GET: Get all users who liked a review
    def get(self, request, review_id):
        try:
            review = Review.objects.get(id=review_id)
            likes = ReviewLike.objects.filter(review=review)  # Get all likes for this review
            serializer = ReviewLikeSerializer(likes, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Review.DoesNotExist:
            return Response({"error": "Review not found"}, status=status.HTTP_404_NOT_FOUND)


class DeleteReviewLike(APIView):
    permission_classes = [IsAuthenticated]

    # DELETE: Remove a like from a review
    def delete(self, request, review_id):
        try:
            review = Review.objects.get(id=review_id)

            # Check if the user has liked the review
            like = ReviewLike.objects.filter(review=review, user=request.user).first()
            if not like:
                return Response({"error": "You haven't liked this review."}, status=status.HTTP_400_BAD_REQUEST)

            # Remove the like
            like.delete()

            # Update the likes count safely
            review.likes_count = max(0, (review.likes_count or 0) - 1)  # Avoid negative likes count
            review.save()

            return Response({"likes": review.likes_count}, status=status.HTTP_200_OK)
        except Review.DoesNotExist:
            return Response({"error": "Review not found"}, status=status.HTTP_404_NOT_FOUND)


class DislikeReview(APIView):
    permission_classes = [IsAuthenticated]

    # POST: Dislike a review
    def post(self, request, review_id):
        try:
            review = Review.objects.get(id=review_id)

            # If the user has already liked the review, remove the like and add a dislike
            if ReviewLike.objects.filter(review=review, user=request.user).exists():
                # Remove the like
                ReviewLike.objects.filter(review=review, user=request.user).delete()
                review.likes_count -= 1
                review.save()

            # Check if the user has already disliked the review
            if ReviewDisLike.objects.filter(review=review, user=request.user).exists():
                return Response({"error": "You have already disliked this review."}, status=status.HTTP_400_BAD_REQUEST)

            # Create a dislike for the review
            ReviewDisLike.objects.create(review=review, user=request.user)
            review.dislikes_count += 1
            review.save()

            return Response({"dislikes": review.dislikes_count}, status=status.HTTP_200_OK)
        except Review.DoesNotExist:
            return Response({"error": "Review not found"}, status=status.HTTP_404_NOT_FOUND)
        
    # GET: Get all users who disliked a review
    def get(self, request, review_id):
        try:
            review = Review.objects.get(id=review_id)
            dislikes = ReviewDisLike.objects.filter(review=review)  # Get all dislikes for this review
            serializer = ReviewDisLikeSerializer(dislikes, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Review.DoesNotExist:
            return Response({"error": "Review not found"}, status=status.HTTP_404_NOT_FOUND)


class DeleteReviewDisLike(APIView):
    permission_classes = [IsAuthenticated]

    # DELETE: Remove a dislike from a review
    def delete(self, request, review_id):
        try:
            review = Review.objects.get(id=review_id)

            # Check if the user has disliked the review
            dislike = ReviewDisLike.objects.filter(review=review, user=request.user).first()
            if not dislike:
                return Response({"error": "You haven't disliked this review."}, status=status.HTTP_400_BAD_REQUEST)

            # Remove the dislike
            dislike.delete()

            # Update the dislikes count safely
            review.dislikes_count = max(0, (review.dislikes_count or 0) - 1)  # Avoid negative dislikes count
            review.save()

            return Response({"dislikes": review.dislikes_count}, status=status.HTTP_200_OK)
        except Review.DoesNotExist:
            return Response({"error": "Review not found"}, status=status.HTTP_404_NOT_FOUND)
    

class ReplyReview(APIView):
    permission_classes = [IsAuthenticated]

    # POST: Add a reply to a review
    def post(self, request, review_id):
        try:
            review = Review.objects.get(id=review_id)
            serializer = ReviewReplySerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(review=review, user=request.user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Review.DoesNotExist:
            return Response({"error": "Review not found"}, status=status.HTTP_404_NOT_FOUND)

    # GET: Get all replies for a review
    def get(self, request, review_id):
        try:
            review = Review.objects.get(id=review_id)
            replies = review.replies.all()  # Assuming Review has a related name 'replies'
            serializer = ReviewReplySerializer(replies, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Review.DoesNotExist:
            return Response({"error": "Review not found"}, status=status.HTTP_404_NOT_FOUND)

class UpdateReviewReply(APIView):
    permission_classes = [IsAuthenticated]
    # PUT: Update a reply
    def put(self, request, reply_id):
        try:
            reply = ReviewReply.objects.get(id=reply_id, user=request.user)
            serializer = ReviewReplySerializer(reply, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except ReviewReply.DoesNotExist:
            return Response({"error": "Reply not found or permission denied."}, status=status.HTTP_404_NOT_FOUND)

class DeleteReviewReply(APIView):
    permission_classes = [IsAuthenticated]
    # DELETE: Delete a reply
    def delete(self, request, reply_id):
        try:
            reply = ReviewReply.objects.get(id=reply_id, user=request.user)
            reply.delete()
            return Response({"message": "Reply deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except ReviewReply.DoesNotExist:
            return Response({"error": "Reply not found or permission denied."}, status=status.HTTP_404_NOT_FOUND)


class BookReviewsView(APIView):
    permission_classes = [AllowAny]

    # GET: Get reviews for a specific book
    def get(self, request, google_books_id):
        reviews = Review.objects.filter(google_books_id=google_books_id)
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)


class BookClubViewSet(viewsets.ModelViewSet):
    queryset = BookClub.objects.all()
    serializer_class = BookClubSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=['get'])
    def members(self, request, pk=None):
        book_club = self.get_object()
        memberships = BookClubMembership.objects.filter(book_club=book_club)
        serializer = BookClubMembershipSerializer(memberships, many=True)
        return Response(serializer.data)

class BookClubMembershipViewSet(viewsets.ModelViewSet):
    queryset = BookClubMembership.objects.all()
    serializer_class = BookClubMembershipSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Automatically assign the current user to the club
        user = self.request.user
        book_club = serializer.validated_data['book_club']
        if not BookClubMembership.objects.filter(user=user, book_club=book_club).exists():
            serializer.save(user=user)
        else:
            raise serializers.ValidationError("User is already a member of this club.")

    @action(detail=True, methods=['get'])
    def users(self, request, pk=None):
        membership = self.get_object()
        user = membership.user
        serializer = UserSerializer(user)
        return Response(serializer.data)

class BookClubDiscussionViewSet(viewsets.ModelViewSet):
    queryset = BookClubDiscussion.objects.all()
    serializer_class = BookClubDiscussionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        # Automatically assign the current user as the creator of the discussion
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['get'])
    def book_club_discussions(self, request, pk=None):
        book_club = self.get_object()
        discussions = BookClubDiscussion.objects.filter(book_club=book_club)
        serializer = BookClubDiscussionSerializer(discussions, many=True)
        return Response(serializer.data)


class LoginAPIView(APIView):
    permission_classes = [AllowAny]  # Allow anyone to access this endpoint
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({'detail': 'Username and password are required.'}, status=400)

        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                })
            return Response({'detail': 'Account is disabled.'}, status=403)
        return Response({'detail': 'Invalid credentials.'}, status=401)
