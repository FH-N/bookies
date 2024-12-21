from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from .models import BookClub, PostTag
from rest_framework.exceptions import NotFound
import django

django.setup()

class BookClubAPITestCase(APITestCase):
    def setUp(self):
        # Set up a user and a book club
        self.user = User.objects.create_user(username="testuser", password="testpassword")
        self.club_data = {
            "name": "Test Book Club",
            "description": "A test book club"
        }
        self.book_club = BookClub.objects.create(**self.club_data)
        self.book_club.members.add(self.user)

    def test_create_book_club(self):
        # Test creating a book club
        self.client.login(username="testuser", password="testpassword")
        response = self.client.post('/api/bookclubs/', self.club_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], self.club_data['name'])

    def test_get_book_club(self):
        # Test getting a single book club by ID
        response = self.client.get(f'/api/bookclubs/{self.book_club.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], self.book_club.name)

    def test_update_book_club(self):
        # Test updating a book club
        updated_data = {"name": "Updated Book Club", "description": "Updated description"}
        self.client.login(username="testuser", password="testpassword")
        response = self.client.put(f'/api/bookclubs/{self.book_club.id}/', updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], updated_data['name'])

    def test_delete_book_club(self):
        # Test deleting a book club
        self.client.login(username="testuser", password="testpassword")
        response = self.client.delete(f'/api/bookclubs/{self.book_club.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


    def test_join_book_club(self):
        # Ensure user is not a member initially
        self.assertNotIn(self.user, self.book_club.members.all())

        # Send a POST request to join the club
        response = self.client.post(f'/api/bookclubs/join/{self.book_club.id}/')

        # Check if the response status is 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Ensure the user has been added as a member
        self.assertIn(self.user, self.book_club.members.all())

    def test_leave_book_club(self):
        # Ensure user is a member first
        self.client.post(f'/api/bookclubs/join/{self.book_club.id}/')

        # Ensure the user is a member of the book club
        self.assertIn(self.user, self.book_club.members.all())

        # Send a POST request to leave the club
        response = self.client.post(f'/api/bookclubs/leave/{self.book_club.id}/')

        # Check if the response status is 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Ensure the user has been removed from the members list
        self.assertNotIn(self.user, self.book_club.members.all())


