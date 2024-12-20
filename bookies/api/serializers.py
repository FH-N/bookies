from rest_framework import serializers
from .models import Review , User, ReviewReply, ReviewLike, ReviewDisLike, BookClub, BookClubPost, ClubTag, PostTag


#User serializers
class UserSerializer(serializers.ModelSerializer):
    role = serializers.CharField(write_only=True) 

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
    user_id = serializers.IntegerField(source='user.id', read_only=True)

    class Meta:
        model = ReviewReply
        fields = ['id', 'user','user_id', 'content', 'created_at']
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
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    replies = ReviewReplySerializer(many=True, read_only=True)
    likes = ReviewLikeSerializer(many=True, read_only=True)
    dislikes = ReviewDisLikeSerializer(many=True, read_only=True)
    class Meta:
        model = Review
        fields = ['id', 'user','user_id', 'google_books_id', 'content', 'rating', 'likes','dislikes', 'replies', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']
        extra_kwargs = {
            'content': {'required': False, 'allow_blank': True},  # Mark content as optional
        }


class ClubTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClubTag
        fields = ['id', 'name']


class BookClubSerializer(serializers.ModelSerializer):
    members = serializers.StringRelatedField(many=True)
    club_tags = ClubTagSerializer(many=True, read_only=True)  # Nested serializer for tags
    tag_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=ClubTag.objects.all(), write_only=True, source='club_tags'
    )  
    is_member = serializers.SerializerMethodField()
    owner = serializers.StringRelatedField()  # Display owner's username

    class Meta:
        model = BookClub
        fields = [
            'id', 
            'name', 
            'description', 
            'members', 
            'club_tags', 
            'tag_ids', 
            'created_at', 
            'is_member', 
            'owner'  
        ]

    def get_is_member(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.members.filter(id=request.user.id).exists()
        return False


class PostTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostTag
        fields = ['id', 'name']  # Serialize the PostTag model with 'id' and 'name'


class BookClubPostSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.username')
    created_at = serializers.ReadOnlyField()
    post_tags = PostTagSerializer(many=True, read_only=True)  # Add PostTagSerializer to include post tags

    class Meta:
        model = BookClubPost
        fields = ['id', 'club', 'author', 'content', 'created_at', 'post_tags']  # Add post_tags to the list of fields

