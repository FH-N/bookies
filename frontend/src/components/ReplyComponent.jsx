import { useState } from "react";
import axios from "axios";

const ReplyComponent = ({ reviewId, onReplyAdded }) => {
  const [reply, setReply] = useState("");

  const token =
    localStorage.getItem("access") ||
    localStorage.getItem("google_access_token");

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/reviews/${reviewId}/reply/`,
        { content: reply },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onReplyAdded(response.data); // Notify parent to refresh replies
      setReply("");
    } catch (error) {
      console.error("Failed to add reply:", error);
    }
  };

  return (
    <form onSubmit={handleReplySubmit} className="mt-4 space-y-2">
      <textarea
        className="w-full p-2 border rounded text-black"
        placeholder="Add a reply..."
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        required
      />
      <button
        type="submit"
        className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        Submit Reply
      </button>
    </form>
  );
};

export default ReplyComponent;
