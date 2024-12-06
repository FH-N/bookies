import { useEffect, useState } from "react";
import axios from "axios";

const ReviewList = ({ googleBooksId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`/api/reviews/${googleBooksId}/`);
        setReviews(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchReviews();
  }, [googleBooksId]);

  return (
    <div>
      {reviews.length ? (
        reviews.map((review) => (
          <div key={review.id}>
            <p>{review.content}</p>
            <p>Rating: {review.rating}</p>
            <p>By: {review.user}</p>
          </div>
        ))
      ) : (
        <p>No reviews yet.</p>
      )}
    </div>
  );
};

export default ReviewList;
