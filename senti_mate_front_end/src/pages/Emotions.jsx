import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../component/Header";
import Footer from "../component/Footer";
import EmotionItem from "../component/EmotionItem";
import EmotionService from "../services/EmotionService";
import { useApi } from "../hooks/useApi";
import { useLocalStorage } from "../hooks/useLocalStorage";
import "./Emotions.css";

/**
 * Emotions page component
 * Displays and allows selection of emotions for tracking and analysis
 */
const EmotionsPage = () => {
  const navigate = useNavigate();
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [notes, setNotes] = useState("");
  const [emotionHistory, setEmotionHistory] = useLocalStorage("emotionHistory", []);
  const [showForm, setShowForm] = useState(false);

  // Use the useApi hook to fetch emotions from the API
  const { 
    data: emotionList, 
    loading, 
    error 
  } = useApi(EmotionService.getAllEmotions, [], [
    // Fallback data if API call fails
    { id: 1, name: "Happy", image: "/emotions/happy.png", description: "Feeling joyful and content" },
    { id: 2, name: "Sad", image: "/emotions/sad.png", description: "Feeling down or unhappy" },
    { id: 3, name: "Angry", image: "/emotions/angry.png", description: "Feeling frustrated or irritated" },
    { id: 4, name: "Anxious", image: "/emotions/anxious.png", description: "Feeling worried or nervous" },
    { id: 5, name: "Calm", image: "/emotions/calm.png", description: "Feeling peaceful and relaxed" },
    { id: 6, name: "Excited", image: "/emotions/excited.png", description: "Feeling enthusiastic and eager" },
    { id: 7, name: "Tired", image: "/emotions/tired.png", description: "Feeling fatigued or exhausted" },
    { id: 8, name: "Confused", image: "/emotions/confused.png", description: "Feeling uncertain or puzzled" }
  ]);

  // Use the useApi hook to fetch emotion statistics
  const { 
    data: emotionStats, 
    loading: statsLoading, 
    error: statsError,
    refetch: refetchStats
  } = useApi(() => {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    return EmotionService.getEmotionStats(
      oneMonthAgo.toISOString().split('T')[0],
      today.toISOString().split('T')[0]
    );
  }, { counts: {}, trends: [] });

  const handleEmotionSelect = (emotion) => {
    setSelectedEmotion(emotion);
    setShowForm(true);
  };

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
  };

  const handleSubmit = async () => {
    if (!selectedEmotion) return;

    const newEntry = {
      id: Date.now(),
      emotionId: selectedEmotion.id,
      emotionName: selectedEmotion.name,
      emotionImage: selectedEmotion.image,
      notes: notes,
      timestamp: new Date().toISOString()
    };

    // Add to local history
    const updatedHistory = [newEntry, ...emotionHistory].slice(0, 50); // Keep only the last 50 entries
    setEmotionHistory(updatedHistory);

    // Clear form
    setNotes("");
    setShowForm(false);

    // Analyze text if there are notes
    if (notes.trim()) {
      try {
        const analysis = await EmotionService.analyzeText(notes);
        console.log("Emotion analysis:", analysis);
        // You could show this analysis to the user or use it in some way
      } catch (err) {
        console.error("Error analyzing text:", err);
      }
    }

    // Refresh stats
    refetchStats();
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Render emotion chart (placeholder for now)
  const renderEmotionChart = () => {
    return (
      <div className="emotion-chart">
        <p style={{ textAlign: 'center', paddingTop: '120px' }}>
          Emotion trend chart would be displayed here.
          <br />
          This would show your emotion patterns over time.
        </p>
      </div>
    );
  };

  return (
    <div className="emotions-page">
      <Header />
      <div className="emotions-container">
        <h1>Track Your Emotions</h1>
        <p className="emotions-subtitle">Select an emotion to track how you're feeling</p>

        {selectedEmotion && !showForm && (
          <div className="selected-emotion">
            <h2>You selected: {selectedEmotion.name}</h2>
            <p>{selectedEmotion.description}</p>
          </div>
        )}

        {!showForm && (
          <div className="emotion-grid">
            {loading ? (
              <p>Loading emotions...</p>
            ) : error ? (
              <p>Error loading emotions. Using default set.</p>
            ) : (
              emotionList.map((emotion) => (
                <div 
                  key={emotion.id} 
                  className={`emotion-item-wrapper ${selectedEmotion?.id === emotion.id ? 'selected' : ''}`}
                  onClick={() => handleEmotionSelect(emotion)}
                >
                  <EmotionItem 
                    emotion={emotion}
                    onClick={() => handleEmotionSelect(emotion)}
                    isSelected={selectedEmotion?.id === emotion.id}
                  />
                </div>
              ))
            )}
          </div>
        )}

        {showForm && (
          <div className="emotion-form">
            <h2>How are you feeling {selectedEmotion.name} today?</h2>
            <div className="emotion-form-group">
              <label htmlFor="emotion-notes">Add some notes about how you're feeling (optional):</label>
              <textarea 
                id="emotion-notes"
                value={notes}
                onChange={handleNotesChange}
                placeholder="Describe your feelings in more detail..."
              />
            </div>
            <div className="emotion-form-actions">
              <button onClick={() => setShowForm(false)} style={{ marginRight: '10px', backgroundColor: '#ccc' }}>
                Cancel
              </button>
              <button onClick={handleSubmit}>
                Save Emotion
              </button>
            </div>
          </div>
        )}

        {emotionHistory.length > 0 && (
          <div className="emotion-history">
            <h2>Your Emotion History</h2>

            {renderEmotionChart()}

            <div className="emotion-log">
              {emotionHistory.slice(0, 6).map((entry) => (
                <div key={entry.id} className="emotion-log-item">
                  <img src={entry.emotionImage} alt={entry.emotionName} />
                  <div className="emotion-log-content">
                    <div className="emotion-log-date">{formatDate(entry.timestamp)}</div>
                    <div className="emotion-log-name">{entry.emotionName}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default EmotionsPage;
