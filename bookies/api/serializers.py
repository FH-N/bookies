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

    def update(self, instance, validated_data):
        """
        Update the user fields: username, email, password, and profile fields like role and bio.
        """
        # Update user fields
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)

        # Update password if provided
        password = validated_data.get('password', None)
        if password:
            instance.set_password(password)  # Hash the new password securely

        # Save the updated user instance
        instance.save()

        # Update UserProfile fields (role, bio)
        profile_data = self.context['request'].data  # Directly fetch extra fields like role & bio
        profile = instance.profile  # Assumes a OneToOne relationship exists with UserProfile

        role = profile_data.get('role', profile.role)
        bio = profile_data.get('bio', profile.bio)

        profile.role = role
        profile.bio = bio
        profile.save()

        return instance

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

