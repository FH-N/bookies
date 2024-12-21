import RecommendedCategory from "./RecommendedCategory";

const RecommendationList = () => {
  const searchTerms = ["Science Fiction", "History", "Romance"];

  return (
    <div>
      <RecommendedCategory searchTerms={searchTerms} />
    </div>
  );
};

export default RecommendationList;
