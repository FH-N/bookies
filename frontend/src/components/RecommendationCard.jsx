import { IconStarFilled } from "@tabler/icons-react";
import Button from "./ui/Button";

const RecommendationCard = ({ result }) => {
  return (
    <div className="bg-white w-44 h-[450px] text-black font-poppins text-wrap rounded-lg shadow-xl overflow-hidden flex flex-col">
      <img
        src={result.volumeInfo.imageLinks?.thumbnail}
        alt={result.volumeInfo.title}
        className="w-44 h-[250px] object-cover" // Set image size to make space for the content below
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
        <Button>Add Book</Button>
      </div>
    </div>
  );
};

export default RecommendationCard;
