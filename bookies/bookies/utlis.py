import requests


def search_books_by_category(categories):
    all_results = {}
    for category in categories:
        url = f"https://www.googleapis.com/books/v1/volumes?q={category}"
        response = requests.get(url)
        if response.status_code == 200:
            books = response.json().get('items', [])
            sorted_books = sorted(books, key=lambda book: book.get('volumeInfo', {}).get('averageRating', 0), reverse=True)[:3]
            all_results[category] = sorted_books
        else:
            print(f"Error fetching books for category '{category}': Status Code {response.status_code}")
            all_results[category] = []
    return all_results


categories = ['Science Fiction', 'History', 'Romance']
search_results = search_books_by_category(categories)

for category, books in search_results.items():
    print(f"Category: {category}")
    for book in books:
        print(book['volumeInfo']['title'])
    print("-" * 20)
