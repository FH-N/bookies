import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BookClubList = () => {
  const [bookClubs, setBookClubs] = useState([]);
  const [groupedBookClubs, setGroupedBookClubs] = useState({});
  const [filteredBookClubs, setFilteredBookClubs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTag, setSelectedTag] = useState(""); // State for selected tag filter
  const [sortOption, setSortOption] = useState("newest"); // State for selected sorting option

  const navigate = useNavigate();

  // Fetch book clubs
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/bookclubs/")
      .then((response) => {
        const clubs = response.data;
        setBookClubs(clubs);
        groupByTags(clubs); // Group by tags after fetching clubs
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching book clubs");
        setLoading(false);
      });
  }, []);

  // Group book clubs by tags
  const groupByTags = (clubs) => {
    const grouped = {};

    clubs.forEach((club) => {
      club.club_tags.forEach((tag) => {
        if (!grouped[tag.name]) {
          grouped[tag.name] = [];
        }
        grouped[tag.name].push(club);
      });
    });

    setGroupedBookClubs(grouped);
    setFilteredBookClubs(grouped); // Initialize filtered clubs with all clubs
  };

  // Filter book clubs based on selected tag
  const handleFilterChange = (e) => {
    const tag = e.target.value;
    setSelectedTag(tag);

    if (tag === "") {
      setFilteredBookClubs(groupedBookClubs); // No filter, show all clubs
    } else {
      const filtered = {};
      for (const tagName in groupedBookClubs) {
        if (tagName === tag) {
          filtered[tagName] = groupedBookClubs[tagName];
        }
      }
      setFilteredBookClubs(filtered); // Filter the clubs by selected tag
    }
  };

  // Handle sorting based on selected option
  const handleSortChange = (e) => {
    const option = e.target.value;
    setSortOption(option);

    const sorted = {};
    for (const tagName in filteredBookClubs) {
      let sortedClubs = [...filteredBookClubs[tagName]];

      if (option === "popular") {
        sortedClubs.sort((a, b) => b.members.length - a.members.length); // Sort by members count (descending)
      } else if (option === "newest") {
        sortedClubs.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        ); // Sort by creation date (newest first)
      }

      sorted[tagName] = sortedClubs;
    }

    setFilteredBookClubs(sorted); // Update filtered clubs with sorted clubs
  };

  // Handle joining a book club
  const handleJoinBookClub = (clubId, e) => {
    e.stopPropagation(); // Prevent the event from bubbling to the parent div

    const token =
      localStorage.getItem("access") ||
      localStorage.getItem("google_access_token");

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

        // Update the is_member state for the club in the bookClubs state
        setBookClubs((prevClubs) => {
          const updatedClubs = prevClubs.map((club) =>
            club.id === clubId ? { ...club, is_member: true } : club
          );
          return updatedClubs;
        });

        // Also update the filtered list to make sure the UI reflects the change
        setFilteredBookClubs((prevFilteredClubs) => {
          const updatedFiltered = { ...prevFilteredClubs };
          for (const tagName in updatedFiltered) {
            updatedFiltered[tagName] = updatedFiltered[tagName].map((club) =>
              club.id === clubId ? { ...club, is_member: true } : club
            );
          }
          return updatedFiltered;
        });
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

      {/* Filter Dropdown */}
      <div className="mb-6">
        <select
          value={selectedTag}
          onChange={handleFilterChange}
          className="border border-gray-300 p-2 rounded-md"
        >
          <option value="">All Tags</option>
          {Object.keys(groupedBookClubs).map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      {/* Sort Dropdown */}
      <div className="mb-6">
        <select
          value={sortOption}
          onChange={handleSortChange}
          className="border border-gray-300 p-2 rounded-md"
        >
          <option value="newest">Newest</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>

      {/* Loop through the grouped book clubs by tag */}
      {Object.keys(filteredBookClubs).map((tag) => (
        <div key={tag} className="mb-8">
          <h3 className="text-xl font-semibold mb-4">{tag}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredBookClubs[tag].map((club) => (
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
                    {club.members.length}{" "}
                    {club.members.length === 1 ? "member" : "members"}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!club.is_member) {
                        handleJoinBookClub(club.id, e);
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
      ))}
    </div>
  );
};

export default BookClubList;
