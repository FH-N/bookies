import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory
import BookClubPosts from "./BookClubPosts";
import CreatePost from "./CreatePost";

const BookClubDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // useNavigate hook to navigate programmatically
  const [bookClubDetails, setBookClubDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // To toggle between view and edit mode
  const [updatedName, setUpdatedName] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [userIsOwner, setUserIsOwner] = useState(false); // Track if the current user is the owner

  const accessToken = localStorage.getItem("access_token"); // Get the access token from localStorage

  useEffect(() => {
    const fetchBookClubDetails = async () => {
      try {
        // Fetch the book club details
        const response = await fetch(
          `http://127.0.0.1:8000/api/bookclubs/${id}/`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch book club details");
        }
        const data = await response.json();
        setBookClubDetails(data);
        setUpdatedName(data.name);
        setUpdatedDescription(data.description);

        // Fetch the current user details using the access token
        const userResponse = await fetch(
          `http://127.0.0.1:8000/api/user/`, // Your endpoint for user details
          {
            headers: {
              Authorization: `Bearer ${accessToken}`, // Send the access token in the header
            },
          }
        );
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user details");
        }
        const userData = await userResponse.json();

        // Check if the current user is the owner of the book club
        if (userData.username === data.owner) {
          setUserIsOwner(true); // Set userIsOwner to true if they are the owner
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookClubDetails();
  }, [id, accessToken]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book club?"
    );
    if (confirmDelete) {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/bookclubs/${id}/`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`, // Send the access token for authentication
            },
          }
        );
        if (response.ok) {
          alert("Book club deleted successfully!");
          navigate("/bookclubs"); // Redirect to list of all book clubs using navigate
        } else {
          throw new Error("Failed to delete book club");
        }
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/bookclubs/${id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // Send the access token for authentication
          },
          body: JSON.stringify({
            name: updatedName,
            description: updatedDescription,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update book club details");
      }
      const updatedData = await response.json();
      setBookClubDetails(updatedData);
      setIsEditing(false); // Exit edit mode
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container w-full min-h-[calc(100vh-4rem)]">
      <h1 className="text-2xl font-bold">{bookClubDetails?.name}</h1>
      <p className="text-gray-600">{bookClubDetails?.description}</p>
      <p className="text-sm text-gray-500">
        Created by: {bookClubDetails?.owner}
      </p>
      <p className="text-sm text-gray-500">
        Members: {bookClubDetails?.members?.length || 0}
      </p>

      {/* Conditional rendering for editing */}
      {isEditing ? (
        <div>
          <input
            type="text"
            value={updatedName}
            onChange={(e) => setUpdatedName(e.target.value)}
            className="border p-2 mt-2"
            placeholder="Update Book Club Name"
          />
          <textarea
            value={updatedDescription}
            onChange={(e) => setUpdatedDescription(e.target.value)}
            className="border p-2 mt-2 w-full"
            placeholder="Update Book Club Description"
          />
          <button
            onClick={handleUpdate}
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
        // Only show these buttons if the current user is the owner of the club
        userIsOwner && (
          <div className="mt-4">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Edit Book Club
            </button>
            <button
              onClick={handleDelete}
              className="ml-2 bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete Book Club
            </button>
          </div>
        )
      )}

      <CreatePost clubId={id} />
      <BookClubPosts clubId={id} />
    </div>
  );
};

export default BookClubDetails;
