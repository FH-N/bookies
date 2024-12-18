import { useState, useEffect } from "react";
import axios from "axios";
import RecommendationCard from "./RecommendationCard";
import {
  IconArrowRight,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react"; // Import Chevron icons

const RecommendedCategory = ({ searchTerm }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}`
        );
        setSearchResults(response.data.items || []);
      } catch (error) {
        console.error(
          `Error fetching results for term '${searchTerm}':`,
          error
        );
      }
    };

    fetchData();
  }, [searchTerm]);

  const nextBooks = () => {
    if (currentIndex + 3 < searchResults.length) {
      setCurrentIndex(currentIndex + 3);
    }
  };

  const prevBooks = () => {
    if (currentIndex - 3 >= 0) {
      setCurrentIndex(currentIndex - 3);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg mb-8 relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-black">
          Recommended for {searchTerm}
        </h2>
        <div className="flex space-x-4 ml-auto">
          <button
            onClick={prevBooks}
            disabled={currentIndex === 0}
            className="text-xl text-black disabled:text-gray-400"
          >
            <IconChevronLeft />
          </button>
          <button
            onClick={nextBooks}
            disabled={currentIndex + 3 >= searchResults.length}
            className="text-xl text-black disabled:text-gray-400"
          >
            <IconChevronRight />
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-6">
        {searchResults.slice(currentIndex, currentIndex + 3).map((result) => (
          <RecommendationCard key={result.id} result={result} />
        ))}
      </div>
      <div className="absolute bottom-1 right-4 flex flew-row p-1 cursor-pointer">
        <h3 className="text-black">View More</h3>
        <IconArrowRight className="text-black" />
      </div>
    </div>
  );
};

export default RecommendedCategory;
