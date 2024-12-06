import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BookInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [error, setError] = useState(null);

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

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center rounded-lg border border-gray-300 shadow-md p-4">
        {imageLinks?.thumbnail ? (
          <img
            src={imageLinks.thumbnail}
            alt={`${title} cover`}
            className="w-48 h-auto rounded-lg object-cover"
          />
        ) : (
          <div className="w-48 h-64 bg-gray-200 flex items-center justify-center rounded-lg">
            <span className="text-gray-500">No Image Available</span>
          </div>
        )}
        <div className="p-4 flex flex-col justify-start w-full md:w-2/3">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">{title}</h2>
          <p className="text-gray-600 text-lg mb-4">
            {authors ? authors.join(", ") : "Unknown Author"}
          </p>
          <p
            className="text-gray-700 text-base mt-4"
            dangerouslySetInnerHTML={{
              __html: description || "No description available.",
            }}
          />
          <p className="text-gray-700 text-base mt-4">
            Published: {publishedDate || "Unknown Date"}
          </p>
          <p className="text-gray-700 text-base mt-4">
            Page Count: {pageCount || "N/A"}
          </p>
          {/* <button onClick={() => navigate("/review")}>Add Review</button> */}
          <button
            onClick={() => navigate("/")}
            className="mt-4 text-white bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookInfo;
