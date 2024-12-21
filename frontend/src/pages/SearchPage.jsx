import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import SearchResultList from "../components/SearchResultList";

const SearchPage = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("query") || "";

  useEffect(() => {
    if (searchTerm) {
      fetchBooks(searchTerm);
    }
  }, [searchTerm]);

  const fetchBooks = async (search) => {
    setError("");
    try {
      const response = await fetch(
        `http://localhost:8000/books/search/?search=${encodeURIComponent(
          search
        )}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch books.");
      }
      const data = await response.json();
      setBooks(data.books);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col container px-48 text-white font-poppins">
      <h2 className="text-4xl font-bold text-left mt-4">
        Showing results for:{" "}
        <span className="text-lemon-lime font-medium">{searchTerm}</span>
      </h2>
      <h3 className="text-2xl py-3 font-roboto-serif">
        {books.length} {books.length === 1 ? "result" : "results"}
      </h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <SearchResultList books={books} />
      <Link to={`/`} className="mt-4 text-blue-500">
        Back
      </Link>
    </div>
  );
};

export default SearchPage;
