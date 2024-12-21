# Bookies

**Tagline**: *"The ultimate platform for book lovers to discover, review, and share their reading journey."*

Bookies is an online platform for book lovers to connect, share reviews, and discover new reads. With features like writing reviews, rating books, creating personal book libraries, and joining book clubs, Bookies makes it easy to stay engaged with your reading journey. Whether you're tracking your reading progress or following your favorite authors, Bookies is the place to celebrate your love of books!

---

## Features

- **Browse Recommended Books:** Explore book recommendations based on a simple recommendation system. Discover hidden gems and popular titles that match your interests.
- **Search for Books:** Easily find books by title, author, genre, or keyword.
- **Write Reviews:** Share your thoughts on books and help others find their next great read.
- **Rate Books:** Rate books on a scale to express your opinion and discover highly-rated titles.
- **Improved user profiles**: Customizable profiles for users to track their reading history.
- **Create Book Libraries**: Organize your books by genre, reading status, or custom categories.
- **Follow Authors & Reviewers**: Stay updated on the latest reviews from your favorite authors or other Bookies reviewers.
- **Join Book Clubs**: Connect with other readers in shared book clubs and discuss your latest reads.

---

## Tech Stack

- **Frontend**: React
- **Backend**: Django
- **Authentication**: Google Login
- **External APIs**: Google Books API

---

## Prerequisites

Before setting up the project, ensure you have the following installed and configured:

- **Node.js** (for React)
- **Python** (for Django)
- **Google Authentication**: You will need to set up Google login. Follow the [Google OAuth setup](https://developers.google.com/identity/protocols/oauth2) to obtain a **CLIENT_ID** and **CLIENT_SECRET**.
- **Google Books API**: To access book data, you need a Google Books API key. Obtain one from the [Google Developers Console](https://console.developers.google.com/). 

Additionally, create a file called `credentials.py` in the `bookies/googlebooks` directory and add the following credentials:

```python
GOOGLE_BOOKS_API_KEY = "<your_google_books_api_key>"
CLIENT_ID = "<your_google_client_id>"
CLIENT_SECRET = "<your_google_client_secret>"
```

---

## Installation

This project is still in development (beta version). To set up the project locally, follow these steps:

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/FH-N/bookies.git
   cd bookies
   ```

2. Set Up Backend:

   - Navigate to the Django project folder and install dependencies:

     ```bash
     cd bookies
     pip install -r requirements.txt
     ```

   - Run database migrations:

     ```bash
     python manage.py migrate
     ```

3. Set up the frontend:

   - Navigate to the React project folder and install dependencies:

     ```bash
     cd frontend
     npm install
     ```

   - Start the React development server:

     ```bash
     npm run dev
     ```

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for more details.

---

## Contributing

This project is not open for contributions at the moment.

---

## Future Plans

- **Enhanced book club features**: Adding chat functionality and book club events.
- **Track Reading Statistics**: View your reading progress, including books read, average ratings, and more.

---

## Contact

For questions or feedback, feel free to open an issue in the GitHub repository.
