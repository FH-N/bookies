import { useState } from "react";
import axios from "axios";
import StarRating from "./ui/Stars";

const ReviewForm = ({ googleBooksId, onReviewAdded }) => {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0); // Default rating set to 0

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token =
      localStorage.getItem("access") ||
      localStorage.getItem("google_access_token");

    try {
      const reviewData = {
        google_books_id: googleBooksId,
        rating,
      };

      // Include content only if it is not empty
      if (content.trim()) {
        reviewData.content = content;
      }

      await axios.post(
        `http://127.0.0.1:8000/api/reviews/create/`,
        reviewData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setContent("");
      setRating(0); // Reset to 0 after submission
      onReviewAdded();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-semibold">Rating:</label>
        <StarRating
          rating={rating}
          onRatingChange={setRating}
          editable={true}
        />
      </div>
      <div>
        <label className="block font-semibold">Content (Optional):</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Write your review (optional)"
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
