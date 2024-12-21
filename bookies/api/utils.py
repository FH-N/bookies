import requests

def get_book_total_pages(google_books_id):
    url = f'https://www.googleapis.com/books/v1/volumes/{google_books_id}'
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        total_pages = data.get('volumeInfo', {}).get('pageCount', None)
        
        return total_pages
    else:
        return None
