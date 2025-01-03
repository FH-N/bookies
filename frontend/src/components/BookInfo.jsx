import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IconStarFilled } from "@tabler/icons-react";
import Button from "./ui/Button";
import ReadingProgress from "./ReadingProgress";
import ReviewList from "./ReviewList";

const BookInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0); // State for the rating
  const [isBookAdded, setIsBookAdded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const token =
    localStorage.getItem("access") ||
    localStorage.getItem("google_access_token");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const fetchBookDetails = async () => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes/${id}`
      );
      if (!response.ok) throw new Error("Failed to fetch book details.");
      const data = await response.json();
      setBook(data);
      checkIfBookAdded(data.id); // Check if the book is already in the bookshelf
    } catch (err) {
      setError("Could not fetch book details. Please try again later.");
    }
  };

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

  const handleAddBook = async () => {
    if (!book) return;

    try {
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
        (existingBook) => existingBook.book_id === id
      );

      if (!isBookInModel) {
        const addBookResponse = await fetch("http://127.0.0.1:8000/api/book/", {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            book_id: id,
            title: book.volumeInfo.title,
            author: book.volumeInfo.authors
              ? book.volumeInfo.authors.join(", ")
              : "Unknown",
            description:
              book.volumeInfo.description || "No description available.",
            thumbnail: book.volumeInfo.imageLinks?.thumbnail || null,
          }),
        });

        if (!addBookResponse.ok) {
          const errorData = await addBookResponse.json();
          throw new Error(
            errorData.message || "Failed to add the book to the backend."
          );
        }
      }

      const addToBookshelfResponse = await fetch(
        "http://127.0.0.1:8000/api/bookshelves/add-book/",
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify({ book_id: id }),
        }
      );

      if (!addToBookshelfResponse.ok) {
        const errorData = await addToBookshelfResponse.json();
        throw new Error(
          errorData.message || "Failed to add the book to the user's bookshelf."
        );
      }

      setIsBookAdded(true);
      alert("Book successfully added to your bookshelf!");
    } catch (error) {
      console.error(error.message);
      setError(error.message || "An error occurred. Please try again.");
    }
  };

  const handleRemoveBook = async () => {
    if (!book) return;

    try {
      const removeBookResponse = await fetch(
        "http://127.0.0.1:8000/api/bookshelves/remove-book/",
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify({ book_id: id }),
        }
      );

      if (!removeBookResponse.ok) {
        const errorData = await removeBookResponse.json();
        throw new Error(
          errorData.message || "Failed to remove the book from the bookshelf."
        );
      }

      setIsBookAdded(false);
      alert("Book successfully removed from your bookshelf!");
    } catch (error) {
      console.error(error.message);
      setError(error.message || "An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    fetchBookDetails();
  }, [id]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!book) return <p className="text-gray-600">Loading...</p>;

  const { volumeInfo } = book;
  const { title, authors, description, pageCount, publishedDate, imageLinks } =
    volumeInfo;

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;

    return (
      <div className="flex items-center space-x-1">
        {Array.from({ length: fullStars }).map((_, index) => (
          <IconStarFilled
            key={`filled-${index}`}
            className="text-aqua-teal"
            stroke={2}
          />
        ))}
        {Array.from({ length: emptyStars }).map((_, index) => (
          <IconStarFilled key={`empty-${index}`} className="text-gray-300" />
        ))}
      </div>
    );
  };

  const handleRatingClick = (newRating) => {
    setRating(newRating);
  };

  return (
    <div className="container w-full min-h-screen mt-16 mx-auto p-6 flex flex-row font-poppin">
      <div className="flex-none w-[300px] h-[500px] mr-6">
        {imageLinks?.thumbnail ? (
          <img
            src={imageLinks.thumbnail}
            alt={`${title} cover`}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
            <span className="text-gray-500">No Image Available</span>
          </div>
        )}
        <Button
          className="bg-electric-indigo w-full font-semibold mt-5 text-lg"
          onClick={(e) => {
            e.stopPropagation();
            window.open(book.infoLink, "_blank");
          }}
        >
          Buy Book
        </Button>
        <Button
          className={`w-full font-semibold mt-5 text-lg ${
            isBookAdded ? "bg-pink-flower" : ""
          }`}
          onClick={isBookAdded ? handleRemoveBook : handleAddBook}
        >
          {isBookAdded ? "Remove Book" : "+ Add Book"}
        </Button>

        {/* Conditionally render the "Edit Progress" button */}
        {isBookAdded && (
          <>
            <Button
              onClick={() => setIsEditing((prev) => !prev)}
              className="w-full font-semibold mt-5 text-lg"
            >
              {isEditing ? "Cancel" : "Edit Progress"}
            </Button>
            <ReadingProgress
              bookId={book.id}
              totalPages={pageCount}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
            />
          </>
        )}
      </div>

      <div className=" flex flex-col ">
        <div className="bg-white rounded-lg shadow-lg p-10 flex flex-col justify-start h-full">
          <h2 className="text-3xl font-bold text-deep-purple py-1">{title}</h2>
          <p className="text-gray-600 text-xl py-1">
            By: {authors ? authors.join(", ") : "Unknown Author"}
          </p>
          <div className="flex items-center space-x-4 text-sm font-roboto-serif">
            <div className="flex items-center space-x-1">
              {renderStars(book.rating || 0)}
            </div>
            <p className=" font-bold">
              {book.rating || "No rating available"} /5
            </p>
            <p className="font-light text-light-purple">no. of reviews</p>
            <p className="font-light text-light-purple">no. of ratings</p>
          </div>
          <p
            className="font-roboto-mono leading-5 my-3 font-thin text-deep-purple"
            dangerouslySetInnerHTML={{
              __html: description || "No description available.",
            }}
          />
          <p className="text-sm text-gray-500">
            Categories: {book.categories || "No categories available"}
          </p>
          <p className="text-gray-700 text-base mt-4">
            Page Count: {pageCount || "N/A"}
          </p>
          <p className="text-gray-700 text-base mt-4">
            Published: {publishedDate || "Unknown Date"}
          </p>
        </div>
        <ReviewList id={id} />
      </div>
    </div>
  );
};

export default BookInfo;
