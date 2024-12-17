import { Link } from "react-router-dom";

const SearchResultCard = ({ book }) => {
  return (
    <li className="grid grid-cols-1 gap-1">
      <div className="flex flex-row p-5">
        <img
          src={book.thumbnail}
          alt={book.title}
          width={100}
          height={100}
          className="object-cover"
        />
        <div className="flex flex-col p-4">
          <h3 className="font-sans font-bold text-2xl">{book.title}</h3>
          <p>Authors: {book.authors}</p>
          <a
            href={book.infoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            More Info
          </a>
          <Link to={`/book/${book.id}`} className="mt-2 text-blue-500">
            View Details
          </Link>
        </div>
      </div>
    </li>
  );
};

export default SearchResultCard;
