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
      setContent("");
      setRating(5); // Reset form fields after successful submission
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Failed to post review. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Add a Review</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          <label htmlFor="content" className="block">
            Comment:
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
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
