import React from "react";
import Header from "../component/Header";
import Footer from "../component/Footer";
import HealthDataDashboard from "../component/HealthDataDashboard";
import "../component/HealthDataDashboard.css";

/**
 * HealthData page component
 * Displays health data from Samsung Health integration
 */
const HealthDataPage = () => {
  return (
    <div className="health-data-page">
      <Header />
      <div className="health-data-container">
        <h1>Your Health Data</h1>
        <p className="health-data-subtitle">Track your health metrics and progress</p>
        
        <HealthDataDashboard />
      </div>
      <Footer />
    </div>
  );
};

export default HealthDataPage;