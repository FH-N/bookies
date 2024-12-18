import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ReviewForm from "./CreateReview";
import ReplyComponent from "./ReplyComponent";

const BookInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");  // For showing success or error message

  const fetchBookDetails = async () => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes/${id}`
      );
      if (!response.ok) throw new Error("Failed to fetch book details.");
      const data = await response.json();
      setBook(data);
    } catch (err) {
      setError("Could not fetch book details. Please try again later.");
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/books/${id}/reviews/`
      );
      setReviews(response.data || []);
    } catch (err) {
      console.error("Error fetching reviews:", err.message);
      setReviews([]);
    }
  };

  useEffect(() => {
    fetchBookDetails();
    fetchReviews();
  }, [id]);

  const handleReviewAdded = () => {
    fetchReviews(); // Refetch reviews after a new review is added
  };

  const handleReplyAdded = (reviewId, newReply) => {
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.id === reviewId
          ? { ...review, replies: [...(review.replies || []), newReply] }
          : review
      )
    );
  };

  const handleLike = async (reviewId) => {
    try {
      const url = `http://127.0.0.1:8000/api/reviews/${reviewId}/like/`;
      const response = await axios({
        url,
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      });

      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                likes_count: response.data.likes , // Increment like count by 1
                dislikes_count: review.dislikes_count > 0 ? review.dislikes_count - 1 : 0, // Decrement dislike if it was present
              }
            : review
        )
      );
      setMessage("Review liked successfully!");
    } catch (error) {
      setMessage(`Failed to like review: ${error.message}`);
    }
  };



  const handleDisLike = async (reviewId) => {
    try {
      const url = `http://127.0.0.1:8000/api/reviews/${reviewId}/dislike/`;
      const response = await axios({
        url,
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      });

      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                dislikes_count: response.data.dislikes, // Increment dislike count by 1
                likes_count: review.likes_count > 0 ? review.likes_count - 1 : 0, // Decrement like if it was present
              }
            : review
        )
      );
      setMessage("Review disliked successfully!");
    } catch (error) {
      setMessage(`Failed to dislike review: ${error.message}`);
    }
  };

  const handleRemoveLike = async (reviewId) => {
    try {
      const url = `http://127.0.0.1:8000/api/reviews/${reviewId}/like/delete`;
      const response = await axios({
        url,
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      });

      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                likes_count: review.likes_count > 0 ? review.likes_count - 1 : 0, // Decrement like count by 1
              }
            : review
        )
      );
      setMessage("like removed successfully!");
    } catch (error) {
      setMessage(`Failed to remove like: ${error.message}`);
    }
  };

  const handleRemoveDislike = async (reviewId) => {
    try {
      const url = `http://127.0.0.1:8000/api/reviews/${reviewId}/dislike/delete`;
      const response = await axios({
        url,
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      });

      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                dislikes_count: review.dislikes_count > 0 ? review.dislikes_count - 1 : 0, // Decrement dislike count by 1
              }
            : review
        )
      );
      setMessage("Dislike removed successfully!");
    } catch (error) {
      setMessage(`Failed to remove dislike: ${error.message}`);
    }
  };

  const isLiked = (review) => {
    return review.likes_count > 0;
  };

  const isDisliked = (review) => {
    return review.dislikes_count > 0;
  };

  if (error) return <p className="text-red-500">{error}</p>;
  if (!book) return <p className="text-gray-600">Loading...</p>;

  const { volumeInfo } = book;
  const { title, authors, description, pageCount, publishedDate, imageLinks } =
    volumeInfo;

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Book Details */}
      <div className="flex flex-col md:flex-row items-start rounded-lg border shadow-md p-4">
        {imageLinks?.thumbnail ? (
          <img
            src={imageLinks.thumbnail}
            alt={`${title} cover`}
            className="w-48 h-auto rounded-lg"
          />
        ) : (
          <div className="w-48 h-64 bg-gray-200 flex items-center justify-center rounded-lg">
            <span className="text-gray-500">No Image Available</span>
          </div>
        )}
        <div className="p-4 w-full md:w-2/3">
          <h2 className="text-2xl font-semibold">{title}</h2>
          <p className="text-lg text-gray-600">
            {authors ? authors.join(", ") : "Unknown Author"}
          </p>
          <p className="mt-4">{description || "No description available."}</p>
          <p>Published: {publishedDate || "N/A"}</p>
          <p>Page Count: {pageCount || "N/A"}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Back
          </button>
        </div>
      </div>

      {/* Success/Error Message */}
      {message && <p className="mt-4 text-green-500">{message}</p>}

      {/* Reviews Section */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Reviews:</h3>
        {Array.isArray(reviews) && reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="p-4 border rounded-lg bg-gray-100 mb-4">
              <p>
                <strong>{review.user || "Anonymous"}</strong> rated: {review.rating}/5
              </p>
              <p>{review.content}</p>
              <p className="text-sm text-gray-500">
                {new Date(review.created_at).toLocaleString()}
              </p>
              <div className="flex items-center gap-4 mt-2">
                <button
                  onClick={() =>
                    isLiked(review) ? handleRemoveLike(review.id) : handleLike(review.id)
                  }
                  className={`${
                    isLiked(review) ? "bg-blue-700" : "bg-blue-500"
                  } hover:bg-blue-700 text-white px-2 py-1 rounded`}
                >
                  {isLiked(review) ? `👍 Like (${review.likes_count })` : `👍 Like (${review.likes_count || 0})`}
                </button>

                <button
                  onClick={() =>
                    isDisliked(review)
                      ? handleRemoveDislike(review.id)
                      : handleDisLike(review.id)
                  }
                  className={`${
                    isDisliked(review) ? "bg-red-700" : "bg-red-500"
                  } hover:bg-red-700 text-white px-2 py-1 rounded`}
                >
                  {isDisliked(review)
                    ? `👎 Dislike (${review.dislikes_count })`
                    : `👎 Dislike (${review.dislikes_count || 0})`}
                </button>
              </div>
              {/* Replies */}
              <div className="ml-4 pl-4 border-l mt-4">
                <h4 className="text-md font-semibold">Replies:</h4>
                {review.replies && review.replies.length > 0 ? (
                  review.replies.map((reply) => (
                    <div key={reply.id} className="p-2 border rounded bg-gray-50 mt-2">
                      <p>
                        <strong>{reply.user || "Anonymous"}</strong>: {reply.content}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(reply.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p>No replies yet.</p>
                )}
                <ReplyComponent
                  reviewId={review.id}
                  onReplyAdded={handleReplyAdded}
                />
              </div>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>

      {/* Add a Review */}
      <ReviewForm bookId={id} onReviewAdded={handleReviewAdded} />
    </div>
  );
};

export default BookInfo;
