// StarRating.js
import React from "react";

const StarRating = ({ rating, onRatingChange, editable = false }) => {
  const totalStars = 5; // Assuming a 5-star rating system

  // Create an array of stars based on the rating
  const stars = Array.from({ length: totalStars }, (_, index) => {
    return index < rating ? "★" : "☆";
  });

  const handleStarClick = (index) => {
    if (editable && onRatingChange) {
      onRatingChange(index + 1); // Pass the selected rating value
    }
  };

  return (
    <div style={{ cursor: editable ? "pointer" : "default" }}>
      {stars.map((star, index) => (
        <span
          key={index}
          style={{ color: "#ffcc00", fontSize: "20px" }}
          onClick={() => handleStarClick(index)}
        >
          {star}
        </span>
      ))}
    </div>
  );
};

export default StarRating;
