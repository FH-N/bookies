from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import *
import pdb


class UserCreateTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = 'http://localhost:8000/api/user/register/'

    def test_create_user(self):
        data = {
            'username': 'testuser',
            'password': 'testpassword',
            'email': 'testuser@example.com',
            'role':'booker'
        }
        response = self.client.post(self.url, data, format='json')
        print(response.status_code)
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class FollowAPIViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(username='testuser1', password='testpassword', email='testuser1@example.com')
        self.user2 = User.objects.create_user(username='testuser2', password='testpassword', email='testuser2@example.com')
        self.client.force_authenticate(user=self.user1)
        self.url = '/api/follow/'

    def test_follow_user(self):
        data = {
            'user_id': self.user1.id,
            'followed_user_id': self.user2.id
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Followings.objects.count(), 1)
        self.assertEqual(Followings.objects.get().followed_user, self.user2)


# class ReviewCreateTestCase(TestCase):
#     def setUp(self):
#         self.client = APIClient()
#         self.user = User.objects.create_user(username='testuser', password='testpassword', email='testuser@example.com')
#         self.client.force_authenticate(user=self.user)
#         self.url = 'http://localhost:8000/api/reviews/create/'

#     def test_create_review(self):
#         data = {
#             'content': 'This is a test review',
#             'google_books_id': 'test_google_books_id'
#         }
#         response = self.client.post(self.url, data, format='json')
#         print(response.status_code)
#         print(response.data)
#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)
#         self.assertEqual(Review.objects.count(), 1)
#         self.assertEqual(Review.objects.get().content, 'This is a test review')