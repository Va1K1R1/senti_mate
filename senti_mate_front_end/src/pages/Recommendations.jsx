import React, { useEffect, useState } from "react";
import Header from "../component/Header.jsx";
import Footer from "../component/Footer.jsx";
import RecommendationService from "../services/RecommendationService";
import "../component/RecommendationList.css";

const RecommendationsPage = () => {
    const [recs, setRecs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        RecommendationService.getRecommendations()
            .then(setRecs)
            .catch(err => {
                console.error(err);
                setError("Failed to load recommendations");
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="recommendations-page">
            <Header />
            <div className="recommendations-container">
                <h1>Your Wellness Recommendations</h1>
                {loading && <p>Loading…</p>}
                {error && <p className="error-message">{error}</p>}
                {!loading && !error && (
                    <ul className="recommendation-list">
                        {recs.map(r => (
                            <li key={r.id}>{r.content}</li>
                        ))}
                    </ul>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default RecommendationsPage;
