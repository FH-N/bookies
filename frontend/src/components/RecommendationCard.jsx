import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IconStarFilled } from "@tabler/icons-react";
import Button from "./ui/Button";

const RecommendationCard = ({ result }) => {
  const navigate = useNavigate();
  const [isBookAdded, setIsBookAdded] = useState(false); // Track if book is added
  const [error, setError] = useState(""); // Track errors

  const token =
    localStorage.getItem("access") ||
    localStorage.getItem("google_access_token");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // Function to check if the book is already in the user's bookshelf
  const checkIfBookAdded = async (bookId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/bookshelves/mybooks/`, // Fetch the user's bookshelf
        {
          method: "GET",
          headers: headers,
        }
      );
      if (!response.ok) throw new Error("Failed to fetch bookshelf.");
      const data = await response.json();
      const bookExists = data.some((book) => book.book_id === bookId);
      setIsBookAdded(bookExists); // Set the state if the book is already added
    } catch (error) {
      console.error(error.message);
      setError(
        "An error occurred while checking if the book is in your bookshelf."
      );
    }
  };

  // Add the book to the user's bookshelf
  const handleAddBook = async (e) => {
    e.stopPropagation(); // Prevent the card click from triggering
    const bookId = result.id;
    if (!result) return;

    try {
      // Check if the book already exists in the backend book model
      const checkBookResponse = await fetch("http://127.0.0.1:8000/api/book/", {
        method: "GET",
        headers: headers,
      });

      if (!checkBookResponse.ok) {
        const errorData = await checkBookResponse.json();
        throw new Error(
          errorData.message || "Failed to check the book in the backend."
        );
      }

      const existingBooks = await checkBookResponse.json();
      const isBookInModel = existingBooks.some(
        (existingBook) => existingBook.book_id === bookId
      );

      // If the book is not in the book model, add it first
      if (!isBookInModel) {
        const addBookResponse = await fetch("http://127.0.0.1:8000/api/book/", {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            book_id: bookId,
            title: result.volumeInfo.title,
            author: result.volumeInfo.authors
              ? result.volumeInfo.authors.join(", ")
              : "Unknown",
            description:
              result.volumeInfo.description || "No description available.",
            thumbnail: result.volumeInfo.imageLinks?.thumbnail || null,
          }),
        });

        if (!addBookResponse.ok) {
          const errorData = await addBookResponse.json();
          throw new Error(
            errorData.message || "Failed to add the book to the backend."
          );
        }
      }

      // Now, add the book to the user's bookshelf
      const addToBookshelfResponse = await fetch(
        "http://127.0.0.1:8000/api/bookshelves/add-book/",
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify({ book_id: bookId }),
        }
      );

      if (!addToBookshelfResponse.ok) {
        const errorData = await addToBookshelfResponse.json();
        throw new Error(
          errorData.message || "Failed to add the book to the user's bookshelf."
        );
      }

      setIsBookAdded(true); // Update the state to reflect the book was added
      alert("Book successfully added to your bookshelf!");
    } catch (error) {
      console.error(error.message);
      setError(error.message || "An error occurred. Please try again.");
    }
  };

  // Remove the book from the user's bookshelf
  const handleRemoveBook = async (e) => {
    e.stopPropagation(); // Prevent the card click from triggering
    const bookId = result.id;
    if (!result) return;

    try {
      // Remove the book from the user's bookshelf
      const removeBookResponse = await fetch(
        "http://127.0.0.1:8000/api/bookshelves/remove-book/",
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify({ book_id: bookId }),
        }
      );

      if (!removeBookResponse.ok) {
        const errorData = await removeBookResponse.json();
        throw new Error(
          errorData.message || "Failed to remove the book from the bookshelf."
        );
      }

      setIsBookAdded(false); // Update the state to reflect the book was removed
      alert("Book successfully removed from your bookshelf!");
    } catch (error) {
      console.error(error.message);
      setError(error.message || "An error occurred. Please try again.");
    }
  };

  // Fetch book details and check if it's already added to the bookshelf
  useEffect(() => {
    checkIfBookAdded(result.id);
  }, [result.id]);

  const handleCardClick = () => {
    navigate(`/book/${result.id}`);
  };

  return (
    <div
      className="bg-white w-44 h-[450px] text-black font-poppins text-wrap rounded-xl shadow-xl overflow-hidden flex flex-col cursor-pointer"
      onClick={handleCardClick}
    >
      <img
        src={result.volumeInfo.imageLinks?.thumbnail}
        alt={result.volumeInfo.title}
        className="w-44 h-[250px] object-cover"
      />
      <div className="p-4 flex flex-col justify-between flex-grow">
        {/* Title */}
        <h3 className="font-bold text-base leading-4">
          {result.volumeInfo.title}
        </h3>

        {/* Author */}
        <h3 className="font-extralight text-xs">
          By:&nbsp;
          {result.volumeInfo.authors
            ? result.volumeInfo.authors.join(", ")
            : "No author available"}
        </h3>

        {/* Rating */}
        <div className="flex items-center my-2">
          <IconStarFilled stroke={1} className="text-aqua-teal mr-2" />
          <h3 className="font-roboto-serif text-sm">
            {result.volumeInfo.averageRating
              ? `${result.volumeInfo.averageRating} / 5`
              : "No rating available"}
          </h3>
        </div>

        {/* Button */}
        <Button
          onClick={isBookAdded ? handleRemoveBook : handleAddBook}
          className={isBookAdded ? "bg-pink-flower" : ""}
        >
          {isBookAdded ? "Remove Book" : "Add Book"}
        </Button>

        {/* Error message */}
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default RecommendationCard;
