import React from "react";
import { useParams } from "react-router-dom";
import BookInfo from "../components/BookInfo";
import ReviewList from "../components/ReviewList";


const BookDetailsPage = () => {
  const { id } = useParams(); 
  return (
    <div className="page-container">
      
        <BookInfo />
        <ReviewList id ={id}/>
    </div>
  );
};

export default BookDetailsPage;
