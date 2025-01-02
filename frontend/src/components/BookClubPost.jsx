import React, { useState, useEffect } from "react";
import axios from "axios";

const BookClubPost = ({ post, clubId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedContent, setUpdatedContent] = useState(post.content);
  const [error, setError] = useState(null);
  const [userIsOwner, setUserIsOwner] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0); // To track likes
  const [userLiked, setUserLiked] = useState(post.user_liked || false); // To track if the user has liked the post
  const [replies, setReplies] = useState(post.replies || []); // To track replies
  const [newReply, setNewReply] = useState(""); // To manage new reply content

  const token =
    localStorage.getItem("access") ||
    localStorage.getItem("google_access_token");

  // Fetch the current user's details
  const fetchCurrentUser = async () => {
    try {
      const currentUserResponse = await fetch(
        "http://127.0.0.1:8000/api/auth/user/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const currentUserData = await currentUserResponse.json();
      // Check if the current user's username matches the post's author
      setUserIsOwner(currentUserData.username === post.author);
    } catch (error) {
      setError("Failed to fetch current user.");
    }
  };

  // Handle post deletion
  const handleDelete = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (confirmDelete) {
      axios
        .delete(
          `http://127.0.0.1:8000/api/bookclubs/${clubId}/posts/${post.id}/`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then(() => {
          alert("Post deleted successfully");
          window.location.reload(); // Refresh the page after deletion
        })
        .catch((err) => {
          setError("Failed to delete post");
        });
    }
  };

  // Handle saving edited post
  const handleSaveEdit = () => {
    axios
      .put(
        `http://127.0.0.1:8000/api/bookclubs/${clubId}/posts/${post.id}/`,
        { content: updatedContent },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        alert("Post updated successfully");
        setIsEditing(false); // Exit edit mode
      })
      .catch((err) => {
        setError("Failed to update post");
      });
  };

  // Handle liking the post
  const handleLike = () => {
    const action = userLiked ? "unlike" : "like"; // Toggle like/unlike
    axios
      .post(
        `http://127.0.0.1:8000/api/bookclubs/${clubId}/posts/${post.id}/likes/`,
        { action },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        setLikesCount(response.data.likes_count);
        setUserLiked(!userLiked); // Toggle user liked state
      })
      .catch((err) => {
        setError("Failed to like post");
      });
  };

  // Handle adding a reply
  const handleAddReply = () => {
    if (!newReply) return;

    axios
      .post(
        `http://127.0.0.1:8000/api/bookclubs/${clubId}/posts/${post.id}/replies/`,
        { content: newReply },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        setReplies([...replies, response.data.reply]); // Add new reply to the list
        setNewReply(""); // Clear the input
      })
      .catch((err) => {
        setError("Failed to add reply");
      });
  };

  useEffect(() => {
    fetchCurrentUser(); // Fetch current user data when the component mounts
  }, []);

  return (
    <div>
      <p className="text-sm text-gray-600 mb-2">
        <strong>{post.author}</strong> at{" "}
        <span className="text-gray-400">{post.created_at}</span>
      </p>
      <div className="mb-4">
        {post.post_tags && post.post_tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {post.post_tags.map((post_tag) => (
              <span
                key={post_tag.id}
                className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
              >
                {post_tag.name}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-sm">No tags available</p>
        )}
      </div>

      {/* Editable content area */}
      {isEditing ? (
        <div>
          <textarea
            value={updatedContent}
            onChange={(e) => setUpdatedContent(e.target.value)}
            className="border p-2 mt-2 w-full"
          />
          <button
            onClick={handleSaveEdit}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save Changes
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="mt-2 ml-2 bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      ) : (
        <p className="text-lg">{post.content}</p>
      )}

      {/* Likes */}
      <div className="mt-4">
        <button
          onClick={handleLike}
          className={`bg-${
            userLiked ? "red" : "blue"
          }-500 text-white px-4 py-2 rounded`}
        >
          {userLiked ? "Unlike" : "Like"} ({likesCount})
        </button>
      </div>

      {/* Error handling */}
      {error && (
        <div className="bg-red-100 text-red-600 p-4 rounded mb-4">{error}</div>
      )}

      {/* Show edit and delete buttons only if the current user is the author of the post */}
      {userIsOwner && (
        <div className="mt-4">
          <button
            onClick={() => setIsEditing(true)}
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            Edit Post
          </button>
          <button
            onClick={handleDelete}
            className="ml-2 bg-red-500 text-white px-4 py-2 rounded"
          >
            Delete Post
          </button>
        </div>
      )}

      {/* Replies Section */}
      <div className="mt-4">
        <h3 className="text-lg font-bold">Replies</h3>
        <div className="mt-2">
          {replies.length === 0 ? (
            <p>No replies yet</p>
          ) : (
            replies.map((reply) => (
              <div key={reply.id} className="mb-2">
                <p className="text-sm">
                  {reply.author}: {reply.content}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Reply Input */}
        <textarea
          value={newReply}
          onChange={(e) => setNewReply(e.target.value)}
          placeholder="Write a reply..."
          className="border p-2 mt-2 w-full"
        />
        <button
          onClick={handleAddReply}
          className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
        >
          Reply
        </button>
      </div>
    </div>
  );
};

export default BookClubPost;
