import React, { useEffect, useState } from "react";
import Header from "../component/Header.jsx";
import Footer from "../component/Footer.jsx";
import UserService from "../services/UserService";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    UserService.getProfile()
        .then(data => setProfile(data))
        .catch(err => {
          console.error(err);
          setError("Failed to load profile");
        })
        .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading profile…</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
      <div className="profile-page">
        <Header />
        <div className="profile-container">
          <h1>{profile.username}</h1>
          <p>Email: {profile.email}</p>
          {/* 추가 필드 렌더링 */}
        </div>
        <Footer />
      </div>
  );
};

export default ProfilePage;
