import { useState } from "react";
import axios from "axios";

const ReviewForm = ({ googleBooksId ,onReviewAdded }) => {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/reviews/create/`,
        { google_books_id: googleBooksId, content, rating },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
        }
      );
      setContent("");
      setRating(5);
      onReviewAdded();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-semibold">Rating (1-5):</label>
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block font-semibold">Content:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        Submit Review
      </button>
    </form>
  );
  
};

export default ReviewForm;
