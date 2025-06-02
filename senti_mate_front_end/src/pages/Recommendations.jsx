import React from "react";
import Header from "../component/Header";
import Footer from "../component/Footer";
import RecommendationList from "../component/RecommendationList";
import "../component/RecommendationList.css";

/**
 * Recommendations page component
 * Displays personalized wellness recommendations from ChatGPT
 */
const RecommendationsPage = () => {
  return (
    <div className="recommendations-page">
      <Header />
      <div className="recommendations-container">
        <h1>Your Wellness Recommendations</h1>
        <p className="recommendations-subtitle">Personalized advice based on your health diary</p>
        
        <RecommendationList />
      </div>
      <Footer />
    </div>
  );
};

export default RecommendationsPage;