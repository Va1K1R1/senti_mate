import React, { useState } from "react";
import Header from "../component/Header";
import Footer from "../component/Footer";
import "./Profile.css";

/**
 * Profile page component
 * Displays and allows editing of user profile information
 */
const ProfilePage = () => {
  // Sample user profile data - in a real app, this would come from an API
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    bio: "Health enthusiast and mindfulness practitioner",
    age: 32,
    gender: "male",
    height: 180, // cm
    weight: 75, // kg
    profilePicture: "https://via.placeholder.com/150",
    joinDate: "January 15, 2023"
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({...profile});

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing
      setEditedProfile({...profile});
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile({
      ...editedProfile,
      [name]: value
    });
  };

  const handleSaveProfile = () => {
    // In a real app, this would save profile to the backend
    setProfile({...editedProfile});
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  return (
    <div className="profile-page">
      <Header />
      <div className="profile-container">
        <h1>Your Profile</h1>
        <p className="profile-subtitle">Manage your personal information</p>

        <div className="profile-header">
          <div className="profile-picture">
            <img src={profile.profilePicture} alt={profile.name} />
            {isEditing && (
              <button className="change-picture-button">Change Picture</button>
            )}
          </div>
          <div className="profile-info">
            <h2>{profile.name}</h2>
            <p>Member since {profile.joinDate}</p>
            <button 
              className={isEditing ? "cancel-button" : "edit-button"} 
              onClick={handleEditToggle}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
            {isEditing && (
              <button className="save-button" onClick={handleSaveProfile}>
                Save Changes
              </button>
            )}
          </div>
        </div>

        <div className="profile-details">
          {isEditing ? (
            // Edit mode
            <form className="profile-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={editedProfile.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={editedProfile.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={editedProfile.bio}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="age">Age</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={editedProfile.age}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="gender">Gender</label>
                  <select
                    id="gender"
                    name="gender"
                    value={editedProfile.gender}
                    onChange={handleInputChange}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="height">Height (cm)</label>
                  <input
                    type="number"
                    id="height"
                    name="height"
                    value={editedProfile.height}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="weight">Weight (kg)</label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    value={editedProfile.weight}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </form>
          ) : (
            // View mode
            <div className="profile-info-view">
              <div className="info-group">
                <h3>Personal Information</h3>
                <p><strong>Name:</strong> {profile.name}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Bio:</strong> {profile.bio}</p>
              </div>

              <div className="info-group">
                <h3>Health Information</h3>
                <p><strong>Age:</strong> {profile.age}</p>
                <p><strong>Gender:</strong> {profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1)}</p>
                <p><strong>Height:</strong> {profile.height} cm</p>
                <p><strong>Weight:</strong> {profile.weight} kg</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
