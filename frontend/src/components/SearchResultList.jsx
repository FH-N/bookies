import SearchResultCard from "./SearchResultCard";

const SearchResultList = ({ books }) => {
  return (
    <div className="flex flex-col">
      {books.length > 0 ? (
        <ul>
          {books.map((book, index) => (
            <SearchResultCard key={index} book={book} />
          ))}
        </ul>
      ) : (
        <p>No books found.</p>
      )}
    </div>
  );
};

export default SearchResultList;
