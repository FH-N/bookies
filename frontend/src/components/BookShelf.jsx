import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./ui/Button";

const Bookshelf = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch books from the user's bookshelf
  const fetchBookshelf = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://127.0.0.1:8000/api/bookshelves/mybooks/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access")}`, // Replace with your actual token handling
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to fetch bookshelf. Please try again."
        );
      }

      const data = await response.json();
      setBooks(data); // Assuming the API returns the serialized books
    } catch (err) {
      setError(err.message || "An error occurred while fetching bookshelf.");
    } finally {
      setLoading(false);
    }
  };

  // Remove the book from the user's bookshelf
  const handleRemoveBook = async (bookId) => {
    try {
      // Remove the book from the user's bookshelf
      const removeBookResponse = await fetch(
        "http://127.0.0.1:8000/api/bookshelves/remove-book/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          body: JSON.stringify({ book_id: bookId }),
        }
      );

      if (!removeBookResponse.ok) {
        const errorData = await removeBookResponse.json();
        throw new Error(errorData.message || "Failed to remove the book.");
      }

      setBooks(books.filter((book) => book.book_id !== bookId)); // Remove book from local state
      alert("Book successfully removed from your bookshelf!");
    } catch (error) {
      console.error(error.message);
      setError(error.message || "An error occurred. Please try again.");
    }
  };

  // Navigate to the BookInfo page for a specific book
  const handleCardClick = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  useEffect(() => {
    fetchBookshelf();
  }, []);

  if (loading)
    return <p className="text-gray-600">Loading your bookshelf...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (books.length === 0)
    return <p className="text-gray-600">Your bookshelf is empty!</p>;

  return (
    <div className="container mx-auto p-6 font-poppins">
      <h1 className="text-2xl font-bold mb-4 text-deep-purple">
        Your Bookshelf
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <div
            key={book.book_id}
            className="bg-white rounded-lg shadow-lg p-4 cursor-pointer"
            onClick={() => handleCardClick(book.book_id)} // Navigate on card click
          >
            <div className="flex flex-col items-center">
              {book.thumbnail ? (
                <img
                  src={book.thumbnail}
                  alt={`${book.title} cover`}
                  className="w-32 h-48 object-cover mb-3 rounded-lg"
                />
              ) : (
                <div className="w-32 h-48 bg-gray-200 flex items-center justify-center rounded-lg mb-3">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
              <h2 className="text-xl font-bold text-deep-purple">
                {book.title}
              </h2>
              <p className="text-sm text-gray-600">
                By: {book.author || "Unknown Author"}
              </p>
              <Button
                className="mt-3 w-full bg-pink-flower"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click from triggering
                  handleRemoveBook(book.book_id); // Handle remove book
                }}
              >
                Remove Book
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bookshelf;
