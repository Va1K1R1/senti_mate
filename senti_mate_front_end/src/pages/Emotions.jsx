import React, { useState } from "react";
import Header from "../component/Header";
import Footer from "../component/Footer";
import EmotionItem from "../component/EmotionItem";
import "../component/EmotionItem.css";

/**
 * Emotions page component
 * Displays and allows selection of emotions for tracking
 */
const EmotionsPage = () => {
  // Sample emotions data - in a real app, this would come from an API
  const emotionList = [
    { id: 1, name: "Happy", img: "emotion1.png", description: "Feeling joyful and content" },
    { id: 2, name: "Sad", img: "emotion2.png", description: "Feeling down or unhappy" },
    { id: 3, name: "Angry", img: "emotion3.png", description: "Feeling frustrated or irritated" },
    { id: 4, name: "Anxious", img: "emotion4.png", description: "Feeling worried or nervous" },
    { id: 5, name: "Calm", img: "emotion5.png", description: "Feeling peaceful and relaxed" }
  ];

  const [selectedEmotion, setSelectedEmotion] = useState(null);

  const handleEmotionSelect = (emotion) => {
    setSelectedEmotion(emotion);
  };

  return (
    <div className="emotions-page">
      <Header />
      <div className="emotions-container">
        <h1>Track Your Emotions</h1>
        <p className="emotions-subtitle">Select an emotion to track how you're feeling</p>
        
        {selectedEmotion && (
          <div className="selected-emotion">
            <h2>You selected: {selectedEmotion.name}</h2>
            <p>{selectedEmotion.description}</p>
          </div>
        )}
        
        <div className="emotion-grid">
          {emotionList.map((emotion) => (
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
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EmotionsPage;