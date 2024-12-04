import RecommendedCategory from "./RecommendedCategory";

const RecommendationList = ({ booksByCategory }) => {
  console.log("Books by Category:", booksByCategory);
  return (
    <div className="recommendation-list">
      {/* Iterate over each category and books */}
      {Object.entries(booksByCategory).map(([category, books]) => {
        if (!books || books.length === 0) {
          return (
            <div key={category}>
              <h2 className="text-xl font-bold">{category}</h2>
              <p>No books available.</p>
            </div>
          );
        }

        return (
          <RecommendedCategory
            key={category}
            category={category}
            books={books}
          />
        );
      })}
    </div>
  );
};

export default RecommendationList;
