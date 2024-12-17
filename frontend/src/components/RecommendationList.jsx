import RecommendedCategory from "./RecommendedCategory";

const RecommendationList = () => {
  const searchTerms = ["Science Fiction", "History", "Romance"];

  return (
    <div>
      <h1>Book Search App</h1>
      <RecommendedCategory searchTerms={searchTerms} />
    </div>
  );
};

export default RecommendationList;
