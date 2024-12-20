import requests
from django.http import JsonResponse
from .credentials import GOOGLE_BOOKS_API_KEY, CLIENT_SECRET, CLIENT_ID


def search_books(request):
    search_query = request.GET.get("search", "")
    author = request.GET.get("author", "")

    if not search_query and not author:
        return JsonResponse({'error': 'Search term or author is required.'}, status=400)

    queries = {'q': search_query, 'inauthor': author, 'key': GOOGLE_BOOKS_API_KEY}
    response = requests.get('https://www.googleapis.com/books/v1/volumes', params=queries)

    if response.status_code != 200:
        return JsonResponse({'error': 'Failed to fetch books from Google API.'}, status=500)

    data = response.json()
    if 'items' not in data:
        return JsonResponse({'books': []})  

    books = []
    for item in data['items']:
        volume = item.get('volumeInfo', {})
        books.append({
            'title': volume.get('title', 'No title available'),
            'authors': ", ".join(volume.get('authors', [])),
            'thumbnail': volume.get('imageLinks', {}).get('thumbnail', ''),
            'infoLink': volume.get('infoLink', '#'),
        })

    return JsonResponse({'books': books})