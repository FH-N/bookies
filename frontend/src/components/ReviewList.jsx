import { useEffect, useState } from "react";
import axios from "axios";
import ReviewForm from "./CreateReview";
import ReplyComponent from "./ReplyComponent";
import StarRating from "./ui/Stars";
import Button from "./ui/Button";
import {
  IconHeart,
  IconHeartBroken,
  IconHeartFilled,
  IconMessageFilled,
  IconStarFilled,
} from "@tabler/icons-react";

const ReviewList = ({ id }) => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null); // For editing reviews
  const [selectedReply, setSelectedReply] = useState(null); // For editing replies
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false); // Reply modal state
  const [currentUserData, setCurrentUserData] = useState(null);

  const token =
    localStorage.getItem("access") ||
    localStorage.getItem("google_access_token");

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/auth/user/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch current user");
        }

        const userData = await response.json();
        setCurrentUserData(userData);
      } catch (error) {
        console.error("Error fetching current user:", error);
        alert("Failed to load user data. Please refresh the page.");
      }
    };

    fetchCurrentUser();
  }, []);

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

  const handleDeleteReview = async (reviewId) => {
    try {
      setLoading(true);
      await axios.delete(
        `http://127.0.0.1:8000/api/reviews/${reviewId}/delete/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReviews((prevReviews) =>
        prevReviews.filter((review) => review.id !== reviewId)
      );
      setMessage("Review deleted successfully!");
      fetchReviews();
    } catch (error) {
      alert("Failed to delete review.", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateReview = async (updatedContent) => {
    if (!selectedReview) return;
    try {
      setLoading(true);
      const response = await axios.put(
        `http://127.0.0.1:8000/api/reviews/${selectedReview.id}/update`,
        { content: updatedContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === selectedReview.id
            ? { ...review, ...response.data }
            : review
        )
      );
      setMessage("Review updated successfully!");
      setIsModalOpen(false);
      fetchReviews();
    } catch (error) {
      setMessage("Failed to update review.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReply = async (reviewId, replyId) => {
    try {
      setLoading(true);
      await axios.delete(
        `http://127.0.0.1:8000/api/reviews/reply/${replyId}/delete/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                replies: review.replies.filter((reply) => reply.id !== replyId),
              }
            : review
        )
      );
      setMessage("Reply deleted successfully!");
    } catch (error) {
      alert("Failed to delete reply.", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateReply = async (reviewId, updatedContent) => {
    if (!selectedReply) return;
    try {
      setLoading(true);
      await axios.put(
        `http://127.0.0.1:8000/api/reviews/reply/${selectedReply.id}/update/`,
        { content: updatedContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Reply updated successfully!");
      fetchReviews(); // Refetch reviews to get the updated replies
      setIsReplyModalOpen(false);
    } catch (error) {
      setMessage("Failed to update reply.");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (review) => {
    if (!currentUserData) {
      alert("User data is not available. Please try again.");
      return;
    }

    if (review.user_id !== currentUserData.id) {
      alert("You cannot edit this review because you are not the author.");
      return;
    }

    setSelectedReview(review);
    setIsModalOpen(true);
  };

  const openEditReplyModal = (review, reply) => {
    if (!currentUserData) {
      alert("User data is not available. Please try again.");
      return;
    }

    if (reply.user_id !== currentUserData.id) {
      alert("You cannot edit this reply because you are not the author.");
      return;
    }

    setSelectedReview(review);
    setSelectedReply(reply);
    setIsReplyModalOpen(true);
  };

  const handleLike = async (reviewId) => {
    try {
      const url = `http://127.0.0.1:8000/api/reviews/${reviewId}/like/`;
      const response = await axios({
        url,
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                likes_count: response.data.likes, // Increment like count by 1
                dislikes_count:
                  review.dislikes_count > 0 ? review.dislikes_count - 1 : 0, // Decrement dislike if it was present
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
        headers: { Authorization: `Bearer ${token}` },
      });

      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                dislikes_count: response.data.dislikes, // Increment dislike count by 1
                likes_count:
                  review.likes_count > 0 ? review.likes_count - 1 : 0, // Decrement like if it was present
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
        headers: { Authorization: `Bearer ${token}` },
      });

      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                likes_count:
                  review.likes_count > 0 ? review.likes_count - 1 : 0, // Decrement like count by 1
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
        headers: { Authorization: `Bearer ${token}` },
      });

      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                dislikes_count:
                  review.dislikes_count > 0 ? review.dislikes_count - 1 : 0, // Decrement dislike count by 1
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

  const [visibleReplies, setVisibleReplies] = useState({}); // Track which reviews' replies are visible

  const toggleReplies = (reviewId) => {
    setVisibleReplies((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId], // Toggle visibility for the specific review
    }));
  };

  return (
    <div className="mt-8 text-white">
      {/* Reviews Section */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Reviews:</h3>
        <h3 className="text-lg font-semibold mb-4">Add a Review</h3>
        <ReviewForm googleBooksId={id} onReviewAdded={handleReviewAdded} />
        {Array.isArray(reviews) && reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review.id}
              className="flex items-center p-4 border border-white rounded-2xl bg-transparent my-4"
            >
              {/* Username & Follow Button */}
              <div className="flex flex-col items-center justify-between mr-4 w-1/4">
                <p className="font-semibold font-poppins text-2xl text-white">
                  {review.user || "Anonymous"}
                </p>
                <p className="font-light font-poppins text-lg text-white mt-3">
                  followers
                </p>
                <Button className=" w-full font-semibold mt-3 text-lg">
                  Follow
                </Button>
              </div>

              {/* Review Details */}
              <div className="w-3/4">
                <div className="flex flex-row">
                  <IconStarFilled className=" text-aqua-teal h-8 w-8" />
                  <p className="font-roboto-serif font-semibold text-xl text-white px-2">
                    {review.rating}/5
                  </p>
                  <p className="text-sm">
                    {new Date(review.created_at).toLocaleString()}
                  </p>
                </div>
                <p className="font-roboto-mono font-normal leading-7">
                  {review.content}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <button
                    onClick={() => openEditModal(review)}
                    className="bg-yellow-500 hover:bg-yellow-700 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() =>
                      isLiked(review)
                        ? handleRemoveLike(review.id)
                        : handleLike(review.id)
                    }
                  >
                    {isLiked(review) ? (
                      <>
                        <IconHeartFilled className="dark:text-pink-flower text-light-purple w-8 h-8" />
                        {review.likes_count ?? 0}
                      </>
                    ) : (
                      <>
                        <IconHeartFilled className="dark:text-pink-flower text-light-purple w-8 h-8" />
                        {review.likes_count ?? 0}
                      </>
                    )}
                  </button>
                  <button
                    onClick={() =>
                      isDisliked(review)
                        ? handleRemoveDislike(review.id)
                        : handleDisLike(review.id)
                    }
                  >
                    {isDisliked(review) ? (
                      <>
                        <IconHeartBroken className="text-lemon-lime w-8 h-8" />{" "}
                        {review.dislikes_count ?? 0}
                      </>
                    ) : (
                      <>
                        <IconHeartBroken className="text-lemon-lime w-8 h-8" />{" "}
                        {review.dislikes_count ?? 0}
                      </>
                    )}
                  </button>
                  <IconMessageFilled
                    onClick={() => toggleReplies(review.id)}
                    className="text-aqua-teal w-8 h-8 cursor-pointer"
                  />
                </div>
                {/* Replies Section */}
                {visibleReplies[review.id] && (
                  <div className="ml-4 pl-4 border-l mt-4">
                    <h4 className="text-md font-semibold">Replies:</h4>
                    {review.replies && review.replies.length > 0 ? (
                      review.replies.map((reply) => (
                        <div
                          key={reply.id}
                          className="p-2 border rounded bg-gray-50 mt-2 text-black"
                        >
                          <p>
                            <strong>{reply.user || "Anonymous"}</strong>:{" "}
                            {reply.content}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(reply.created_at).toLocaleString()}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => openEditReplyModal(review, reply)}
                              className="bg-yellow-500 hover:bg-yellow-700 text-white px-2 py-1 rounded"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteReply(review.id, reply.id)
                              }
                              className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No replies yet.</p>
                    )}
                    {/* Add Reply */}
                    <div className="mt-4">
                      <ReplyComponent
                        reviewId={review.id}
                        onReplyAdded={handleReplyAdded}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>

      {/* Modal for Editing Review */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Review</h3>
            <textarea
              defaultValue={selectedReview.content}
              rows="4"
              className="w-full border p-2 rounded text-black"
              onChange={(e) =>
                setSelectedReview({
                  ...selectedReview,
                  content: e.target.value,
                })
              }
            />
            <div className="flex items-center justify-end gap-4 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateReview(selectedReview.content)}
                className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Editing Reply */}
      {isReplyModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Reply</h3>
            <textarea
              defaultValue={selectedReply.content}
              rows="4"
              className="w-full border p-2 rounded text-black"
              onChange={(e) =>
                setSelectedReply({ ...selectedReply, content: e.target.value })
              }
            />
            <div className="flex items-center justify-end gap-4 mt-4">
              <button
                onClick={() => setIsReplyModalOpen(false)}
                className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleUpdateReply(selectedReply.review, selectedReply.content)
                }
                className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
