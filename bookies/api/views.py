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
from rest_framework import generics, status
from rest_framework.generics import ListCreateAPIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.exceptions import NotFound, ValidationError
from rest_framework_simplejwt.tokens import RefreshToken
from allauth.socialaccount.models import SocialToken, SocialAccount
import json

# Local imports
from .models import Review, ReviewReply,ReviewLike,ReviewDisLike, BookClub, BookClubPost, Tag
from .serializers import ReviewSerializer, UserSerializer ,ReviewReplySerializer,ReviewLikeSerializer,ReviewDisLikeSerializer, BookClubSerializer, BookClubPostSerializer, TagSerializer

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

class TagView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk=None):
        # Get a single tag or list all tags
        if pk:
            try:
                tag = Tag.objects.get(pk=pk)
                serializer = TagSerializer(tag)
                return Response(serializer.data)
            except Tag.DoesNotExist:
                return Response({"error": "Tag not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            tags = Tag.objects.all()
            serializer = TagSerializer(tags, many=True)
            return Response(serializer.data)

    def post(self, request):
        # Create a new tag
        serializer = TagSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        # Update an existing tag
        try:
            tag = Tag.objects.get(pk=pk)
            serializer = TagSerializer(tag, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Tag.DoesNotExist:
            return Response({"error": "Tag not found"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        # Delete a tag
        try:
            tag = Tag.objects.get(pk=pk)
            tag.delete()
            return Response({"message": "Tag deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Tag.DoesNotExist:
            return Response({"error": "Tag not found"}, status=status.HTTP_404_NOT_FOUND)


# BookClubView with CRUD Functionality
class BookClubView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk=None):
        # Get a single book club or list all book clubs
        if pk:
            try:
                club = BookClub.objects.get(pk=pk)
                serializer = BookClubSerializer(club)
                return Response(serializer.data)
            except BookClub.DoesNotExist:
                return Response({"error": "Book club not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            clubs = BookClub.objects.all()
            serializer = BookClubSerializer(clubs, many=True)
            return Response(serializer.data)

    def post(self, request):
        # Create a new book club
        data = request.data
        name = data.get('name')
        description = data.get('description')
        tag_ids = data.get('tag_ids', [])

        club = BookClub.objects.create(
            name=name,
            description=description,
        )
        club.members.add(request.user)

        if tag_ids:
            tags = Tag.objects.filter(id__in=tag_ids)
            club.tags.set(tags)

        serializer = BookClubSerializer(club)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def put(self, request, pk):
        # Update an existing book club
        try:
            club = BookClub.objects.get(pk=pk)
            data = request.data
            name = data.get('name', club.name)
            description = data.get('description', club.description)
            tag_ids = data.get('tag_ids', [])

            club.name = name
            club.description = description
            if tag_ids:
                tags = Tag.objects.filter(id__in=tag_ids)
                club.tags.set(tags)

            club.save()
            serializer = BookClubSerializer(club)
            return Response(serializer.data)
        except BookClub.DoesNotExist:
            return Response({"error": "Book club not found"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        # Delete a book club
        try:
            club = BookClub.objects.get(pk=pk)
            club.delete()
            return Response({"message": "Book club deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except BookClub.DoesNotExist:
            return Response({"error": "Book club not found"}, status=status.HTTP_404_NOT_FOUND)
        

class JoinBookClubView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, club_id):
        try:
            club = BookClub.objects.get(id=club_id)
            if request.user in club.members.all():
                raise ValidationError(f"You are already a member of {club.name}")
            club.members.add(request.user)
            return Response({"message": f"You've joined {club.name}!"}, status=status.HTTP_200_OK)
        except BookClub.DoesNotExist:
            raise NotFound("Book club not found")


class LeaveBookClubView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, club_id):
        try:
            club = BookClub.objects.get(id=club_id)
            if request.user not in club.members.all():
                raise ValidationError(f"You are not a member of {club.name}")
            club.members.remove(request.user)
            return Response({"message": f"You've left {club.name}!"}, status=status.HTTP_200_OK)
        except BookClub.DoesNotExist:
            raise NotFound("Book club not found")


class BookClubPostView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, club_id):
        try:
            club = BookClub.objects.get(id=club_id)
            posts = BookClubPost.objects.filter(club=club).order_by('-created_at')
            serializer = BookClubPostSerializer(posts, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except BookClub.DoesNotExist:
            return Response({"error": "Book club not found"}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, club_id):
        try:
            club = BookClub.objects.get(id=club_id)
            if request.user not in club.members.all():
                return Response({"error": "You must be a member of this club to post"}, status=status.HTTP_403_FORBIDDEN)

            data = request.data.copy()
            data['club'] = club.id
            data['author'] = request.user.id

            serializer = BookClubPostSerializer(data=data)
            if serializer.is_valid():
                serializer.save(author=request.user, club=club)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except BookClub.DoesNotExist:
            return Response({"error": "Book club not found"}, status=status.HTTP_404_NOT_FOUND)