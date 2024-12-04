import { useState } from "react";
import SearchResultList from "../components/SearchResultList";
import { Link } from "react-router-dom";

const SearchPage = () => {
  const [search, setSearch] = useState("");
  const [author, setAuthor] = useState("");
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch(
        `http://localhost:8000/books/search/?search=${encodeURIComponent(
          search
        )}&author=${encodeURIComponent(author)}`
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
    <div className="flex flex-col justify-center items-center">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="m-2 px-4"
        />
        <button
          type="submit"
          className="text-sm bold bg-slate-500 py-2 px-3 rounded-xl text-white"
        >
          Search
        </button>
        <Link to={`/`}>Back</Link>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <SearchResultList books={books} />
    </div>
  );
};

export default SearchPage;
