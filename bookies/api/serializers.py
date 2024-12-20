from rest_framework import serializers
from .models import Review , User, BookClub, BookClubMembership, BookClubDiscussion , ReviewReply, ReviewLike, ReviewDisLike



class UserSerializer(serializers.ModelSerializer):
    role = serializers.CharField(write_only=True)  # Add `role` as a writable field

    class Meta:
        model = User
        fields = ('id', 'username', 'email','password', 'role')
        extra_kwargs = { 'password': {'write_only': True}}

    def create(self, validated_data):
        role = validated_data.pop('role', 'viewer')

        user = User.objects.create_user(**validated_data)

        user.profile.role = role
        user.profile.save()

        return user

class ReviewReplySerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = ReviewReply
        fields = ['id', 'user', 'content', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']

class ReviewLikeSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = ReviewLike
        fields = ['id', 'user', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']

class ReviewDisLikeSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = ReviewDisLike
        fields = ['id', 'user', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']

class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    replies = ReviewReplySerializer(many=True, read_only=True)
    likes = ReviewLikeSerializer(many=True, read_only=True)
    dislikes = ReviewDisLikeSerializer(many=True, read_only=True)
    class Meta:
        model = Review
        fields = ['id', 'user', 'google_books_id', 'content', 'rating', 'likes','dislikes', 'replies', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']
        extra_kwargs = {
            'content': {'required': False, 'allow_blank': True},  # Mark content as optional
        }

class BookClubMembershipSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    role = serializers.ChoiceField(choices=BookClubMembership.ROLE_CHOICES)

    class Meta:
        model = BookClubMembership
        fields = ['user', 'role', 'joined_at']

class BookClubSerializer(serializers.ModelSerializer):
    owner = UserSerializer()
    members = BookClubMembershipSerializer(many=True, read_only=True)
    is_private = serializers.BooleanField()

    class Meta:
        model = BookClub
        fields = ['id', 'name', 'description', 'created_at', 'updated_at', 'slug', 'owner', 'members', 'is_private']

class BookClubDiscussionSerializer(serializers.ModelSerializer):
    created_by = UserSerializer()
    book_club = BookClubSerializer()

    class Meta:
        model = BookClubDiscussion
        fields = ['id', 'book_club', 'title', 'content', 'created_by', 'created_at', 'updated_at']

