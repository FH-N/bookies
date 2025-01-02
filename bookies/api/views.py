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
from rest_framework.permissions import AllowAny, IsAuthenticated, BasePermission
from rest_framework.exceptions import NotFound, ValidationError
from rest_framework_simplejwt.tokens import RefreshToken
from allauth.socialaccount.models import SocialToken, SocialAccount
import json

# Local imports
from .models import Review, ReviewReply,ReviewLike,ReviewDisLike, BookClub, BookClubPost, ClubTag, PostTag, Followings, UserProfile
from .serializers import ReviewSerializer, UserSerializer ,ReviewReplySerializer,ReviewLikeSerializer,ReviewDisLikeSerializer, BookClubSerializer, BookClubPostSerializer, ClubTagSerializer, PostTagSerializer

from django.contrib.auth import authenticate


User = get_user_model()

class UserCreate(generics.CreateAPIView):
    #test
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class UserDetailView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Return details of the currently authenticated user
        user = request.user
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            # Add other fields you want to include
        })

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
    

class ClubTagView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk=None):
        # Get a single tag or list all tags
        if pk:
            try:
                tag = ClubTag.objects.get(pk=pk)
                serializer = ClubTagSerializer(tag)
                return Response(serializer.data)
            except ClubTag.DoesNotExist:
                return Response({"error": "Tag not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            club_tags = ClubTag.objects.all()
            serializer = ClubTagSerializer(club_tags, many=True)
            return Response(serializer.data)

    def post(self, request):
        # Create a new tag
        serializer = ClubTagSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        # Update an existing tag
        try:
            tag = ClubTag.objects.get(pk=pk)
            serializer = ClubTagSerializer(tag, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except ClubTag.DoesNotExist:
            return Response({"error": "Tag not found"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        # Delete a tag
        try:
            tag = ClubTag.objects.get(pk=pk)
            tag.delete()
            return Response({"message": "Tag deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except ClubTag.DoesNotExist:
            return Response({"error": "Tag not found"}, status=status.HTTP_404_NOT_FOUND)


# Custom Permissions
class IsClubOwnerOrAdmin(BasePermission):
    """
    Custom permission to only allow the owner of the club (or an admin) to delete or modify a book club.
    """
    def has_object_permission(self, request, view, obj):
        # Check if the user is the owner of the book club or is an admin
        if request.user == obj.owner or request.user.is_staff:
            return True
        return False

class IsPostOwnerOrAdmin(BasePermission):
    """
    Custom permission to only allow the author of the post (or an admin) to modify or delete the post.
    """
    def has_object_permission(self, request, view, obj):
        if request.user == obj.author or request.user.is_staff:
            return True
        return False


class IsOwnerOrAdminPermission(BasePermission):
    """
    Custom permission to check if the user is the owner or an admin.
    """

    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user or request.user.is_staff

class BookClubView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk=None):
        # Get a single book club or list all book clubs
        if pk:
            try:
                club = BookClub.objects.get(pk=pk)
                serializer = BookClubSerializer(club, context={'request': request})
                return Response(serializer.data)
            except BookClub.DoesNotExist:
                return Response({"error": "Book club not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            clubs = BookClub.objects.all()
            serializer = BookClubSerializer(clubs, many=True, context={'request': request})
            return Response(serializer.data)

    def post(self, request):
        # Ensure required fields are provided
        data = request.data
        name = data.get('name')
        description = data.get('description')

        if not name or not description:
            return Response({"error": "Both 'name' and 'description' are required."}, status=status.HTTP_400_BAD_REQUEST)

        tag_ids = data.get('tag_ids', [])
        club = BookClub.objects.create(
            name=name,
            description=description,
            owner=request.user,  # Set the owner as the logged-in user
        )
        club.members.add(request.user)  # Automatically add the owner as a member

        if tag_ids:
            club_tags = ClubTag.objects.filter(id__in=tag_ids)
            club.club_tags.set(club_tags)

        serializer = BookClubSerializer(club, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def put(self, request, pk):
        # Update book club only if the user is the owner or admin
        try:
            club = BookClub.objects.get(pk=pk)
            self.check_object_permissions(request, club)  # Check ownership or admin status

            data = request.data
            name = data.get('name', club.name)
            description = data.get('description', club.description)

            if not name or not description:
                return Response({"error": "Both 'name' and 'description' are required."}, status=status.HTTP_400_BAD_REQUEST)

            tag_ids = data.get('tag_ids', [])

            club.name = name
            club.description = description
            if tag_ids:
                club_tags = ClubTag.objects.filter(id__in=tag_ids)
                club.club_tags.set(club_tags)

            club.save()
            serializer = BookClubSerializer(club, context={'request': request})
            return Response(serializer.data)
        except BookClub.DoesNotExist:
            return Response({"error": "Book club not found"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        # Delete book club only if the user is the owner or admin
        try:
            club = BookClub.objects.get(pk=pk)
            self.check_object_permissions(request, club)  # Check ownership or admin status
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
        except ValidationError as e:
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)


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


class PostTagView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retrieve all post tags.
        """
        post_tags = PostTag.objects.all()
        serializer = PostTagSerializer(post_tags, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """
        Create a new post tag.
        """
        serializer = PostTagSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, tag_id):
        """
        Update an existing post tag by its ID.
        """
        try:
            post_tag = PostTag.objects.get(id=tag_id)
        except PostTag.DoesNotExist:
            return Response({"error": "Post tag not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = PostTagSerializer(post_tag, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, tag_id):
        """
        Delete a post tag by its ID.
        """
        try:
            post_tag = PostTag.objects.get(id=tag_id)
        except PostTag.DoesNotExist:
            return Response({"error": "Post tag not found"}, status=status.HTTP_404_NOT_FOUND)

        post_tag.delete()
        return Response({"message": "Post tag deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


class BookClubPostView(APIView):
    permission_classes = [IsAuthenticated]

    # Get all posts in a book club or a specific post if post_id is provided
    def get(self, request, club_id, post_id=None):
        if post_id:
            # Fetch a single post by post_id
            try:
                post = BookClubPost.objects.get(id=post_id, club_id=club_id)
                serializer = BookClubPostSerializer(post)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except BookClubPost.DoesNotExist:
                return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            # Fetch all posts in the book club
            try:
                club = BookClub.objects.get(id=club_id)
                posts = BookClubPost.objects.filter(club=club).order_by('-created_at')
                serializer = BookClubPostSerializer(posts, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except BookClub.DoesNotExist:
                return Response({"error": "Book club not found"}, status=status.HTTP_404_NOT_FOUND)

    # Create a post in the book club
    def post(self, request, club_id):
        try:
            club = BookClub.objects.get(id=club_id)
            if request.user not in club.members.all():
                return Response({"error": "You must be a member of this club to post"}, status=status.HTTP_403_FORBIDDEN)

            content = request.data.get('content')
            if not content:
                return Response({"error": "'content' is required."}, status=status.HTTP_400_BAD_REQUEST)

            post_tag_ids = request.data.get('post_tags', [])
            post_tags = PostTag.objects.filter(id__in=post_tag_ids)

            data = request.data.copy()
            data['club'] = club.id
            data['author'] = request.user.id

            serializer = BookClubPostSerializer(data=data)
            if serializer.is_valid():
                post = serializer.save(author=request.user, club=club)
                post.post_tags.set(post_tags)
                post.save()

                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except BookClub.DoesNotExist:
            return Response({"error": "Book club not found"}, status=status.HTTP_404_NOT_FOUND)

    # Update a specific post by ID (PUT method)
    def put(self, request, club_id, post_id):
        try:
            post = BookClubPost.objects.get(id=post_id, club_id=club_id)
            self.check_object_permissions(request, post)  # Check ownership or admin status

            serializer = BookClubPostSerializer(post, data=request.data, partial=True)
            if serializer.is_valid():
                post = serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except BookClubPost.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

    # Delete a specific post by ID (DELETE method)
    def delete(self, request, club_id, post_id):
        try:
            post = BookClubPost.objects.get(id=post_id, club_id=club_id)
            self.check_object_permissions(request, post)  # Check ownership or admin status
            post.delete()
            return Response({"message": "Post deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except BookClubPost.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

        
class UserDetailByUsernameAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        # Extract username from query parameters
        username = request.query_params.get('username')

        if not username:
            return Response({"error": "Username is required as a query parameter."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Fetch the user and related profile
            user = User.objects.get(username=username)
            profile = user.profile  # Assuming UserProfile exists with a OneToOne relationship

            # Prepare the response data
            response_data = {
                "username": user.username,
                "email": user.email,
                "password": user.password,  # Hashed password for reference
                "role": profile.role if profile else None,
                "bio": profile.bio if profile else None,
            }
            return Response(response_data, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

class UserDetailByUserIdAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        # Extract username from query parameters
        userId = request.query_params.get('user_id')

        if not userId:
            return Response({"error": "userId is required as a query parameter."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Fetch the user and related profile
            user = User.objects.get(id=userId)
            profile = user.profile  # Assuming UserProfile exists with a OneToOne relationship

            # Prepare the response data
            response_data = {
                "username": user.username,
                "email": user.email,
                "password": user.password,  # Hashed password for reference
                "role": profile.role if profile else None,
                "bio": profile.bio if profile else None,
            }
            return Response(response_data, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)


class UpdateUserAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        """
        Update user details (username, email, password) and UserProfile fields (role, bio).
        """
        #user = request.user  # Get the currently logged-in user

        # Fetch data from the request
        username = request.data.get('username', None)
        email = request.data.get('email', None)
        #password = request.data.get('password', None)
        role = request.data.get('role', None)
        bio = request.data.get('bio', None)

        try:
            # Check for username conflict with another user
            user = User.objects.get(username=username)

            # Update user fields
            user.username = username
            user.email = email
            #if password:
            #    user.password = password # Securely update the password
            user.save()

            # Update UserProfile fields
            profile, created = UserProfile.objects.get_or_create(user=user)
            if role:
                profile.role = role
            if bio:
                profile.bio = bio
            profile.save()

            return Response({"message": "User updated successfully."}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        

class AuthorListView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        authors = UserProfile.objects.filter(role='Author')  # Filter authors
        author_list = [
            {
                "userid": author.user.id,
                "username": author.user.username,
                "email": author.user.email,
                "role": author.role,
                "bio": author.bio,
            }
            for author in authors
        ]
        return Response(author_list, status=status.HTTP_200_OK)
    
    
class AllUsersListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        excluded_user_id = request.query_params.get('user_id')  # Get the user_id to exclude from query params

        if not excluded_user_id:
            return Response({"error": "user_id is required as a query parameter."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            excluded_user_id = int(excluded_user_id)
        except ValueError:
            return Response({"error": "user_id must be a valid integer."}, status=status.HTTP_400_BAD_REQUEST)

        # Exclude the user with the given user_id
        users = User.objects.exclude(id=excluded_user_id)

        user_list = [
            {
                "userid": user.id,
                "username": user.username,
                "email": user.email,
                "role": getattr(user.profile, 'role', 'User'),  # Get role from UserProfile or default to 'User'
                "bio": getattr(user.profile, 'bio', None),      # Get bio from UserProfile if available
            }
            for user in users
        ]

        return Response(user_list, status=status.HTTP_200_OK)


class FollowAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user_id = request.data.get("user_id")
        followed_user_id = request.data.get("followed_user_id")

        # Check if both user IDs are provided
        if not user_id or not followed_user_id:
            return Response({"error": "Both user_id and followed_user_id are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Fetch user objects
            user = User.objects.get(id=user_id)
            followed_user = User.objects.get(id=followed_user_id)

            # Prevent self-following
            if user == followed_user:
                return Response({"error": "Users cannot follow themselves."}, status=status.HTTP_400_BAD_REQUEST)

            # Create a follow relationship
            following, created = Followings.objects.get_or_create(user=user, followed_user=followed_user)
            if created:
                return Response({"message": f"{user.username} successfully followed {followed_user.username}."}, status=status.HTTP_201_CREATED)
            else:
                return Response({"error": "Follow relationship already exists."}, status=status.HTTP_400_BAD_REQUEST)

        except User.DoesNotExist:
            return Response({"error": "One or both users do not exist."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    
class UnfollowAPIView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        user_id = request.data.get('user_id')  # The ID of the user performing the unfollow
        followed_user_id = request.data.get('followed_user_id')  # The ID of the user to be unfollowed

        # Validate both user IDs
        try:
            user = User.objects.get(id=user_id)
            followed_user = User.objects.get(id=followed_user_id)
        except User.DoesNotExist:
            return Response({"error": "Invalid user ID(s) provided."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the follow relationship exists
        try:
            follow = Followings.objects.get(user=user, followed_user=followed_user)
        except Followings.DoesNotExist:
            return Response({"error": "Follow relationship does not exist."}, status=status.HTTP_404_NOT_FOUND)

        # Remove the follow relationship
        follow.delete()

        return Response({"message": f"{user.username} successfully unfollowed {followed_user.username}."}, status=status.HTTP_200_OK)
    
class FollowingsListView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, user_id):
        try:
            # Validate the current_user_id
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "Invalid user_id provided."}, status=status.HTTP_400_BAD_REQUEST)

        # Get all users the current user is following
        followings = Followings.objects.filter(user=user).select_related('followed_user')

        # Prepare the response data
        following_list = [
            {
                "followed_user_id": following.followed_user.id,
                "username": following.followed_user.username,
                "email": following.followed_user.email,
                "role": getattr(following.followed_user.profile, 'role', 'User'),  # Get role from UserProfile or default to 'User'
                "bio": getattr(following.followed_user.profile, 'bio', None),      # Get bio from UserProfile if available
            }
            for following in followings
        ]

        return Response(following_list, status=status.HTTP_200_OK)
    
class FollowersListView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, user_id):
        try:
            # Validate the user_id
            followed_user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "Invalid user_id provided."}, status=status.HTTP_400_BAD_REQUEST)

        # Get all users following the specified user
        followers = Followings.objects.filter(followed_user=followed_user).select_related('user')

        # Prepare the response data
        followers_list = [
            {
                "follower_user_id": follower.user.id,
                "username": follower.user.username,
                "email": follower.user.email,
                "role": getattr(follower.user.profile, 'role', 'User'),  # Get role from UserProfile or default to 'User'
                "bio": getattr(follower.user.profile, 'bio', None),      # Get bio from UserProfile if available
            }
            for follower in followers
        ]

        return Response(followers_list, status=status.HTTP_200_OK)
    

class FollowingStatsAPIView(APIView):
    permission_classes = [AllowAny]
    def get(self, request ,user_id):
        try:
            user = User.objects.get(id=user_id)  # Validate the user_id
        except User.DoesNotExist:
            return Response({"error": "Invalid user ID provided."}, status=status.HTTP_400_BAD_REQUEST)

        # Number of users this user is following
        following_count = Followings.objects.filter(user=user).count()

        # Number of users following this user
        followers_count = Followings.objects.filter(followed_user=user).count()

        return Response(
            {
                "following_count": following_count,
                "followers_count": followers_count,
            },
            status=status.HTTP_200_OK

        )

