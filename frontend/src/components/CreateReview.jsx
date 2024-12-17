import { useState } from "react";
import axios from "axios";

const ReviewForm = ({ googleBooksId }) => {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/api/reviews/",
        { google_books_id: googleBooksId, content, rating },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Review posted successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to post review.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-center mb-8">Bookstore Reviews</h1>

      <div id="books" className="mb-8">
        {books.map((book) => (
          <div key={book.id} className="p-4 border mb-6 rounded-lg">
            <h3 className="text-2xl font-semibold">{book.title}</h3>
            <p className="text-lg mb-2">
              <strong>Author:</strong> {book.author}
            </p>
            <p className="text-sm mb-4">
              {book.description || "No description available"}
            </p>
            <h4 className="font-semibold">Reviews:</h4>
            <ul className="space-y-2">
              {book.reviews.map((review, index) => (
                <li key={index} className="text-sm">
                  <strong>{review.user}</strong>: {review.rating}/5 -{" "}
                  {review.comment}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-semibold mb-4">Add a Review</h2>
      <form onSubmit={submitReview} className="space-y-4">
        <div>
          <label htmlFor="book-id" className="block">
            Book ID:
          </label>
          <input
            type="number"
            id="book-id"
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label htmlFor="rating" className="block">
            Rating (1-5):
          </label>
          <input
            type="number"
            id="rating"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label htmlFor="comment" className="block">
            Comment:
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full p-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-400"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
