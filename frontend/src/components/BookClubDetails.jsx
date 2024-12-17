import React from "react";
import { useParams } from "react-router-dom";
import BookClubPosts from "./BookClubPosts";

const BookClubDetails = () => {
  const { id } = useParams();
  return (
    <div>
      <h1>Book Club Details</h1>
      <BookClubPosts clubId={id} />
    </div>
  );
};

export default BookClubDetails;
