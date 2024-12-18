import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BookClubList = () => {
  const [bookClubs, setBookClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Fetch book clubs
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/bookclubs/")
      .then((response) => {
        const sortedClubs = response.data.sort(
          (a, b) => b.members_count - a.members_count
        );
        setBookClubs(sortedClubs);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching book clubs");
        setLoading(false);
      });
  }, []);

  // Handle joining a book club
  const handleJoinBookClub = (clubId) => {
    const token = localStorage.getItem("access");

    axios
      .post(
        `http://127.0.0.1:8000/api/bookclubs/join/${clubId}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        alert(response.data.message);
        setBookClubs((prevClubs) =>
          prevClubs.map((club) =>
            club.id === clubId ? { ...club, is_member: true } : club
          )
        );
      })
      .catch((err) => {
        // Handle error gracefully
        if (err.response && err.response.data) {
          const errorMessage =
            err.response.data.message || "Error joining book club";
          alert(errorMessage); // Show the error message from backend
        } else {
          alert("Error joining book club");
        }
      });
  };

  // Navigate to BookClubDetails when clicked
  const handleNavigateToDetails = (id) => {
    navigate(`/bookclubs/${id}`);
    console.log("clubpage rendered", id);
  };

  // Navigate to CreateClub page
  const handleCreateClubRedirect = () => {
    navigate("/createclub"); // Assuming this route exists for CreateClub
  };

  if (loading) {
    return <div>Loading book clubs...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 min-h-[calc(100vh-4rem)]">
      <h2 className="text-2xl font-bold mb-6">Book Clubs</h2>

      {/* Button to redirect to the Create Club page */}
      <button
        onClick={handleCreateClubRedirect}
        className="mb-6 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
      >
        Create a New Book Club
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {bookClubs.map((club) => (
          <div
            key={club.id}
            className="bg-white shadow-md p-4 rounded-lg cursor-pointer hover:shadow-lg flex flex-col justify-between"
            onClick={() => handleNavigateToDetails(club.id)}
          >
            <div>
              <h3 className="text-lg font-semibold mb-2">{club.name}</h3>
              <p className="text-sm mb-4">{club.description}</p>
            </div>

            {/* Display Tags */}
            <div className="mb-4">
              {club.club_tags && club.club_tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {club.club_tags.map((club_tag) => (
                    <span
                      key={club_tag.id}
                      className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
                    >
                      {club_tag.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-sm">No tags available</p>
              )}
            </div>

            <div className="flex items-center justify-between mt-4">
              <p className="text-gray-600 text-sm">
                {club.members_count}{" "}
                {club.members_count === 1 ? "member" : "members"}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!club.is_member) {
                    handleJoinBookClub(club.id);
                  }
                }}
                className={`${
                  club.is_member
                    ? "bg-gray-400 text-white"
                    : "bg-blue-500 text-white"
                } px-4 py-2 rounded-lg`}
                disabled={club.is_member}
              >
                {club.is_member ? "Joined" : "Join"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookClubList;
