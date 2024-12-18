import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IconStarFilled } from "@tabler/icons-react";
import Button from "./ui/Button";

const BookInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0); // State for the rating

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch book details.");
        }
        const data = await response.json();
        setBook(data);
      } catch (err) {
        setError("Could not fetch book details. Please try again later.");
      }
    };

    fetchBookDetails();
  }, [id]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!book) {
    return <p className="text-gray-600">Loading...</p>;
  }

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
    <div className="container w-full h-full mx-auto p-6 flex flex-row font-poppins">
      {/* Image Section (Outside White Card) */}
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
        <Button className="w-full font-semibold mt-5 text-lg">
          + Add Book
        </Button>
        <Button
          className="bg-pink-flower w-full font-semibold mt-5 text-lg"
          onClick={(e) => {
            e.stopPropagation();
            window.open(book.infoLink, "_blank");
          }}
        >
          Buy Book
        </Button>
        <div className="flex flex-col items-center mt-5">
          <div className="flex items-center space-x-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <IconStarFilled
                key={`blank-${index}`}
                className="text-gray-300 cursor-pointer"
                onClick={() => handleRatingClick(index + 1)}
              />
            ))}
          </div>
          <p className=" text-white">Rate this book</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-10 flex-1">
        <div className="flex flex-col justify-start">
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
      </div>
    </div>
  );
};

export default BookInfo;
