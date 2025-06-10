import React, { useEffect, useState } from "react";
import Header from "../component/Header.jsx";
import Footer from "../component/Footer.jsx";
import EmotionItem from "../component/EmotionItem.jsx";
import "../component/EmotionItem.css";
import EmotionService from "../services/EmotionService";

const EmotionsPage = () => {
  const [emotions, setEmotions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    EmotionService.getAllEmotions()
        .then(data => {
          setEmotions(data);
          setError("");
        })
        .catch(err => {
          console.error(err);
          setError("Failed to load emotions");
        })
        .finally(() => setLoading(false));
  }, []);

  return (
      <div className="emotions-page">
        <Header />
        <div className="emotions-container">
          <h1>Track Your Emotions</h1>
          {loading && <p>Loading…</p>}
          {error && <p className="error-message">{error}</p>}
          <div className="emotion-grid">
            {emotions.map(em => (
                <div
                    key={em.id}
                    className={`emotion-item-wrapper ${selected?.id===em.id?"selected":""}`}
                    onClick={() => setSelected(em)}
                >
                  <EmotionItem emotion={em} isSelected={selected?.id===em.id} />
                </div>
            ))}
          </div>
          {selected && (
              <div className="selected-emotion">
                <h2>You selected: {selected.name}</h2>
                <p>{selected.description}</p>
              </div>
          )}
        </div>
        <Footer />
      </div>
  );
};

export default EmotionsPage;
