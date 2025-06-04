import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Button from "./Button";
import "./UserProfile.css";

/**
 * UserProfile component for displaying user information
 * Allows viewing and editing basic profile information
 */
const UserProfile = () => {
  // Get user data from Redux store
  const { user, loading, error } = useSelector((state) => state.auth);
  
  // Local state for edit mode and form data
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    profileImage: "",
    birthdate: "",
    gender: "",
    height: "",
    weight: "",
    healthGoals: ""
  });
  
  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Initialize form data with user data when available
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        profileImage: user.profileImage || "",
        birthdate: user.birthdate || "",
        gender: user.gender || "",
        height: user.height || "",
        weight: user.weight || "",
        healthGoals: user.healthGoals || ""
      });
    }
  }, [user]);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Toggle edit mode
  const toggleEditMode = () => {
    if (isEditMode) {
      // Reset form data to original user data when canceling edit
      setFormData({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        profileImage: user.profileImage || "",
        birthdate: user.birthdate || "",
        gender: user.gender || "",
        height: user.height || "",
        weight: user.weight || "",
        healthGoals: user.healthGoals || ""
      });
    }
    setIsEditMode(!isEditMode);
    setSubmitError("");
    setSubmitSuccess(false);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);
    
    try {
      // In a real application, this would be an API call
      // Example: await userService.updateProfile(formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set success state
      setSubmitSuccess(true);
      setIsEditMode(false);
      
      // In a real application, you would dispatch an action to update the Redux store
      // Example: dispatch(updateUserProfile(formData));
    } catch (err) {
      setSubmitError("프로필 업데이트 중 오류가 발생했습니다. 다시 시도해주세요.");
      console.error("Profile update error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle profile image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real application, you would upload the file to a server
      // For now, just create a local URL for preview
      const imageUrl = URL.createObjectURL(file);
      setFormData({
        ...formData,
        profileImage: imageUrl
      });
    }
  };
  
  // Loading state
  if (loading) {
    return <div className="UserProfile UserProfile_loading">사용자 정보를 불러오는 중...</div>;
  }
  
  // Error state
  if (error) {
    return <div className="UserProfile UserProfile_error">사용자 정보를 불러오는 중 오류가 발생했습니다: {error}</div>;
  }
  
  // If no user data is available
  if (!user) {
    return <div className="UserProfile UserProfile_error">사용자 정보를 찾을 수 없습니다. 로그인이 필요합니다.</div>;
  }
  
  return (
    <div className="UserProfile">
      <div className="UserProfile_header">
        <h2>사용자 프로필</h2>
        <Button
          text={isEditMode ? "취소" : "프로필 수정"}
          onClick={toggleEditMode}
          type={isEditMode ? "default" : "default"}
          className="UserProfile_edit_button"
        />
      </div>
      
      {submitSuccess && (
        <div className="UserProfile_success">
          프로필이 성공적으로 업데이트되었습니다.
        </div>
      )}
      
      {submitError && (
        <div className="UserProfile_error">
          {submitError}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="UserProfile_form">
        <div className="UserProfile_image_section">
          <div className="UserProfile_image_container">
            <img
              src={formData.profileImage || "https://via.placeholder.com/150"}
              alt={`${formData.name || "사용자"}의 프로필 이미지`}
              className="UserProfile_image"
            />
            
            {isEditMode && (
              <div className="UserProfile_image_upload">
                <label htmlFor="profile-image-upload" className="UserProfile_image_upload_label">
                  이미지 변경
                </label>
                <input
                  type="file"
                  id="profile-image-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="UserProfile_image_upload_input"
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="UserProfile_info_section">
          <div className="UserProfile_info_group">
            <label htmlFor="name">이름</label>
            {isEditMode ? (
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={isSubmitting}
                required
              />
            ) : (
              <div className="UserProfile_info_value">{formData.name || "이름 정보 없음"}</div>
            )}
          </div>
          
          <div className="UserProfile_info_group">
            <label htmlFor="email">이메일</label>
            {isEditMode ? (
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isSubmitting || true} // Email is typically not editable
                required
              />
            ) : (
              <div className="UserProfile_info_value">{formData.email || "이메일 정보 없음"}</div>
            )}
          </div>
          
          <div className="UserProfile_info_group">
            <label htmlFor="bio">자기소개</label>
            {isEditMode ? (
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                disabled={isSubmitting}
                rows={3}
              />
            ) : (
              <div className="UserProfile_info_value">{formData.bio || "자기소개 정보 없음"}</div>
            )}
          </div>
          
          <div className="UserProfile_info_row">
            <div className="UserProfile_info_group">
              <label htmlFor="birthdate">생년월일</label>
              {isEditMode ? (
                <input
                  type="date"
                  id="birthdate"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              ) : (
                <div className="UserProfile_info_value">{formData.birthdate || "생년월일 정보 없음"}</div>
              )}
            </div>
            
            <div className="UserProfile_info_group">
              <label htmlFor="gender">성별</label>
              {isEditMode ? (
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                >
                  <option value="">선택하세요</option>
                  <option value="male">남성</option>
                  <option value="female">여성</option>
                  <option value="other">기타</option>
                  <option value="prefer_not_to_say">응답하지 않음</option>
                </select>
              ) : (
                <div className="UserProfile_info_value">
                  {formData.gender === "male" ? "남성" :
                   formData.gender === "female" ? "여성" :
                   formData.gender === "other" ? "기타" :
                   formData.gender === "prefer_not_to_say" ? "응답하지 않음" :
                   "성별 정보 없음"}
                </div>
              )}
            </div>
          </div>
          
          <div className="UserProfile_info_row">
            <div className="UserProfile_info_group">
              <label htmlFor="height">키 (cm)</label>
              {isEditMode ? (
                <input
                  type="number"
                  id="height"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  min="0"
                  step="0.1"
                />
              ) : (
                <div className="UserProfile_info_value">{formData.height ? `${formData.height} cm` : "키 정보 없음"}</div>
              )}
            </div>
            
            <div className="UserProfile_info_group">
              <label htmlFor="weight">몸무게 (kg)</label>
              {isEditMode ? (
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  min="0"
                  step="0.1"
                />
              ) : (
                <div className="UserProfile_info_value">{formData.weight ? `${formData.weight} kg` : "몸무게 정보 없음"}</div>
              )}
            </div>
          </div>
          
          <div className="UserProfile_info_group">
            <label htmlFor="healthGoals">건강 목표</label>
            {isEditMode ? (
              <textarea
                id="healthGoals"
                name="healthGoals"
                value={formData.healthGoals}
                onChange={handleInputChange}
                disabled={isSubmitting}
                rows={3}
              />
            ) : (
              <div className="UserProfile_info_value">{formData.healthGoals || "건강 목표 정보 없음"}</div>
            )}
          </div>
        </div>
        
        {isEditMode && (
          <div className="UserProfile_actions">
            <Button
              text="저장"
              type="positive"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            />
            <Button
              text="취소"
              type="default"
              onClick={toggleEditMode}
              disabled={isSubmitting}
            />
          </div>
        )}
      </form>
    </div>
  );
};

export default UserProfile;