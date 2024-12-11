from rest_framework import serializers
from .models import Review , User, BookClub, BookClubMembership, BookClubDiscussion



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
            # user_type=validated_data.get('user_type', 'reader'),
        )
        user.set_password(validated_data['password'])  
        user.save()
        return user
    
class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'user', 'google_books_id', 'content', 'rating', 'created_at']
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

