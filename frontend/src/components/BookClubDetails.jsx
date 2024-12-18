import React from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import BookClubPosts from "./BookClubPosts";
import CreatePost from "./CreatePost";

const BookClubDetails = () => {
  const { id } = useParams();

  return (
    <div className="container w-full min-h-[calc(100vh-4rem)]">
      <h1>Book Club Details</h1>
      <CreatePost clubId={id} />
      <BookClubPosts clubId={id} />
    </div>
  );
};

export default BookClubDetails;
