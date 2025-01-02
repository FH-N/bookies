import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BookClubPostsList from "./BookClubPostsList";
import CreatePost from "./CreatePost";

const BookClubDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bookClubDetails, setBookClubDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [userIsOwner, setUserIsOwner] = useState(false);
  const [isMember, setIsMember] = useState(false);

  const accessToken =
    localStorage.getItem("access") ||
    localStorage.getItem("google_access_token");

  useEffect(() => {
    const fetchBookClubDetails = async () => {
      // Assuming token is stored in localStorage
      if (!accessToken) {
        setError("No access token found.");
        return;
      }

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/bookclubs/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch book club details");
        }

        const data = await response.json();
        setBookClubDetails(data);
        setUpdatedName(data.name);
        setUpdatedDescription(data.description);

        // Check if the current user is the owner of the book club
        const currentUser = await fetch(
          "http://127.0.0.1:8000/api/auth/user/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const currentUserData = await currentUser.json();
        if (currentUserData.username === data.owner) {
          setUserIsOwner(true);
        }
        console.log(data.members);
        console.log(currentUserData.username);

        // Check if the current user is a member of the book club
        if (
          data.members.some((member) => member === currentUserData.username)
        ) {
          console.log("here");
          setIsMember(true);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookClubDetails();
  }, [id]);

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
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          alert("Book club deleted successfully!");
          navigate("/bookclubs");
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
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
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
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLeave = async () => {
    const confirmLeave = window.confirm(
      "Are you sure you want to leave this book club?"
    );
    if (confirmLeave) {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/bookclubs/leave/${id}/`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          alert("You have left the book club.");
          setIsMember(false);
          navigate("/bookclubs");
        } else {
          throw new Error("Failed to leave the book club");
        }
      } catch (err) {
        setError(err.message);
      }
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

      {/* Leave Club Button */}
      {isMember && !userIsOwner && (
        <button
          onClick={handleLeave}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Leave Book Club
        </button>
      )}

      <CreatePost clubId={id} />
      <BookClubPostsList clubId={id} />
    </div>
  );
};

export default BookClubDetails;
