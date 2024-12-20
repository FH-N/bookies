import { Link } from "react-router-dom";
import Button from "./ui/Button";
import { IconStarFilled } from "@tabler/icons-react";

const SearchResultCard = ({ book }) => {
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;

    return (
      <div className="flex items-center space-x-1">
        {Array.from({ length: fullStars }).map((_, index) => (
          <IconStarFilled key={`filled-${index}`} className="text-aqua-teal" />
        ))}
        {Array.from({ length: emptyStars }).map((_, index) => (
          <IconStarFilled key={`empty-${index}`} className="text-gray-300" />
        ))}
      </div>
    );
  };

  return (
    <li className="grid grid-cols-1 gap-4 bg-white text-black rounded-xl mt-6 font-poppins">
      {/* Wrap the entire card with a Link */}
      <Link
        to={`/book/${book.id}`}
        className="flex flex-row p-5 border border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        <img
          src={book.thumbnail}
          alt={book.title}
          width={120}
          height={180}
          className="object-cover rounded-md"
        />
        <div className="flex flex-col p-4 space-y-1 w-full">
          <h3 className="font-sans font-bold text-2xl text-deep-purple">
            {book.title}
          </h3>
          <p className="text-base text-black">By: {book.authors}</p>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            {/* Render Rating Stars */}
            <div className="flex items-center space-x-1">
              {renderStars(book.rating || 0)}
            </div>
            <p className="font-roboto-serif font-bold">
              {book.rating || "No rating available"} /5
            </p>
            <p className="font-semibold">
              Page count: {book.pageCount || "No page count available"}
            </p>
            <p className="font-semibold">
              First pub:{" "}
              {book.publicationDate || "No publication date available"}
            </p>
          </div>

          <p className="text-sm text-gray-500">
            Categories: {book.categories || "No categories available"}
          </p>
        </div>

        {/* Buttons on the right */}
        <div className="flex flex-col items-center justify-center ml-4 space-y-4 w-full max-w-[200px]">
          <Button className="w-full font-semibold">+ Add Book</Button>
          <Button
            className="bg-pink-flower w-full font-semibold"
            onClick={(e) => {
              // Prevent Link click behavior when clicking on Buy Book button
              e.stopPropagation();
              window.open(book.infoLink, "_blank");
            }}
          >
            Buy Book
          </Button>
          <Button className="bg-light-purple w-full font-semibold">
            Mark as owned
          </Button>
        </div>
      </Link>
    </li>
  );
};

export default SearchResultCard;
