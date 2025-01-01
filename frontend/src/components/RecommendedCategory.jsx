import { useState, useEffect, useRef } from "react";
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
  const [columns, setColumns] = useState(3); // Default to 3 columns
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Search by category (i.e., searchTerm) directly
        const response = await axios.get(
          `https://www.googleapis.com/books/v1/volumes?q=subject:${searchTerm}`
        );
        const books = response.data.items || [];

        // Sort the books by averageRating in descending order
        const sortedBooks = books.sort((a, b) => {
          const ratingA = a.volumeInfo.averageRating || 0;
          const ratingB = b.volumeInfo.averageRating || 0;
          return ratingB - ratingA; // Sort by highest rating
        });

        setSearchResults(sortedBooks);
      } catch (error) {
        console.error(
          `Error fetching results for category '${searchTerm}':`,
          error
        );
      }
    };

    fetchData();
  }, [searchTerm]);

  useEffect(() => {
    // Function to handle container resizing
    const handleResize = () => {
      const containerWidth = containerRef.current?.offsetWidth;
      if (containerWidth) {
        // Adjust number of columns based on container width
        if (containerWidth >= 1200) {
          setColumns(6); // Large container, 6 cards per row
        } else if (containerWidth >= 900) {
          setColumns(4); // Medium container, 4 cards per row
        } else if (containerWidth >= 600) {
          setColumns(3); // Small container, 3 cards per row
        } else {
          setColumns(1); // Very small container, 1 card per row
        }
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    handleResize();
    return () => resizeObserver.disconnect();
  }, []);

  const nextBooks = () => {
    if (currentIndex + columns <= searchResults.length) {
      setCurrentIndex(currentIndex + columns);
    }
  };

  const prevBooks = () => {
    if (currentIndex - columns >= 0) {
      setCurrentIndex(currentIndex - columns);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg mb-8 relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-black mx-2">
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
            disabled={currentIndex + columns > searchResults.length}
            className="text-xl text-black disabled:text-gray-400"
          >
            <IconChevronRight />
          </button>
        </div>
      </div>
      <div
        ref={containerRef}
        className="grid gap-5"
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
        }}
      >
        {searchResults
          .slice(currentIndex, currentIndex + columns)
          .map((result) => (
            <RecommendationCard key={result.id} result={result} />
          ))}
      </div>

      <div className="absolute bottom-1 right-4 flex flex-row p-1 cursor-pointer">
        <h3 className="text-black">View More</h3>
        <IconArrowRight className="text-black" />
      </div>
    </div>
  );
};

export default RecommendedCategory;
