import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "./Button";
import UserService from "../services/UserService";
import { updateUserProfile, setError, clearError } from "../store/slices/authSlice";
import "./AccountSettings.css";

/**
 * AccountSettings component for updating user settings
 * Allows changing password, notification preferences, and other account settings
 */
const AccountSettings = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  
  // State for password change form
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  // State for notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: false,
    pushNotifications: false,
    dailyDigest: false,
    weeklyReport: false
  });
  
  // State for privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    shareHealthData: false,
    shareEmotions: false,
    shareDiaryEntries: false
  });
  
  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState({
    password: false,
    notifications: false,
    privacy: false
  });
  
  // Initialize settings with user data when available
  useEffect(() => {
    if (user) {
      setNotificationSettings({
        emailNotifications: user.emailNotifications || false,
        pushNotifications: user.pushNotifications || false,
        dailyDigest: user.dailyDigest || false,
        weeklyReport: user.weeklyReport || false
      });
      
      setPrivacySettings({
        profileVisibility: user.profileVisibility || "public",
        shareHealthData: user.shareHealthData || false,
        shareEmotions: user.shareEmotions || false,
        shareDiaryEntries: user.shareDiaryEntries || false
      });
    }
  }, [user]);
  
  // Handle password form input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value
    });
  };
  
  // Handle notification settings changes
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked
    });
  };
  
  // Handle privacy settings changes
  const handlePrivacyChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPrivacySettings({
      ...privacySettings,
      [name]: type === "checkbox" ? checked : value
    });
  };
  
  // Handle password form submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      dispatch(setError("새 비밀번호와 확인 비밀번호가 일치하지 않습니다."));
      return;
    }
    
    if (passwordForm.newPassword.length < 8) {
      dispatch(setError("비밀번호는 최소 8자 이상이어야 합니다."));
      return;
    }
    
    setIsSubmitting(true);
    dispatch(clearError());
    setSubmitSuccess({ ...submitSuccess, password: false });
    
    try {
      await UserService.changePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword
      });
      
      // Reset form and show success message
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      
      setSubmitSuccess({ ...submitSuccess, password: true });
    } catch (err) {
      dispatch(setError(err.response?.data?.message || "비밀번호 변경 중 오류가 발생했습니다."));
      console.error("Password change error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle notification settings submission
  const handleNotificationSubmit = async (e) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    dispatch(clearError());
    setSubmitSuccess({ ...submitSuccess, notifications: false });
    
    try {
      const updatedUser = await UserService.updateProfile({
        emailNotifications: notificationSettings.emailNotifications,
        pushNotifications: notificationSettings.pushNotifications,
        dailyDigest: notificationSettings.dailyDigest,
        weeklyReport: notificationSettings.weeklyReport
      });
      
      // Update Redux store with updated user data
      dispatch(updateUserProfile(updatedUser));
      setSubmitSuccess({ ...submitSuccess, notifications: true });
    } catch (err) {
      dispatch(setError(err.response?.data?.message || "알림 설정 업데이트 중 오류가 발생했습니다."));
      console.error("Notification settings update error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle privacy settings submission
  const handlePrivacySubmit = async (e) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    dispatch(clearError());
    setSubmitSuccess({ ...submitSuccess, privacy: false });
    
    try {
      const updatedUser = await UserService.updateProfile({
        profileVisibility: privacySettings.profileVisibility,
        shareHealthData: privacySettings.shareHealthData,
        shareEmotions: privacySettings.shareEmotions,
        shareDiaryEntries: privacySettings.shareDiaryEntries
      });
      
      // Update Redux store with updated user data
      dispatch(updateUserProfile(updatedUser));
      setSubmitSuccess({ ...submitSuccess, privacy: true });
    } catch (err) {
      dispatch(setError(err.response?.data?.message || "개인정보 설정 업데이트 중 오류가 발생했습니다."));
      console.error("Privacy settings update error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Loading state
  if (loading) {
    return <div className="AccountSettings AccountSettings_loading">사용자 정보를 불러오는 중...</div>;
  }
  
  // Error state
  if (error) {
    return <div className="AccountSettings AccountSettings_error">사용자 정보를 불러오는 중 오류가 발생했습니다: {error}</div>;
  }
  
  // If no user data is available
  if (!user) {
    return <div className="AccountSettings AccountSettings_error">사용자 정보를 찾을 수 없습니다. 로그인이 필요합니다.</div>;
  }
  
  return (
    <div className="AccountSettings">
      <h2 className="AccountSettings_title">계정 설정</h2>
      
      {/* Password Change Section */}
      <div className="AccountSettings_section">
        <h3 className="AccountSettings_section_title">비밀번호 변경</h3>
        
        {submitSuccess.password && (
          <div className="AccountSettings_success">
            비밀번호가 성공적으로 변경되었습니다.
          </div>
        )}
        
        <form onSubmit={handlePasswordSubmit} className="AccountSettings_form">
          <div className="AccountSettings_form_group">
            <label htmlFor="oldPassword">현재 비밀번호</label>
            <input
              type="password"
              id="oldPassword"
              name="oldPassword"
              value={passwordForm.oldPassword}
              onChange={handlePasswordChange}
              disabled={isSubmitting}
              required
            />
          </div>
          
          <div className="AccountSettings_form_group">
            <label htmlFor="newPassword">새 비밀번호</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              disabled={isSubmitting}
              required
              minLength={8}
            />
            <small className="AccountSettings_form_help">비밀번호는 최소 8자 이상이어야 합니다.</small>
          </div>
          
          <div className="AccountSettings_form_group">
            <label htmlFor="confirmPassword">새 비밀번호 확인</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              disabled={isSubmitting}
              required
              minLength={8}
            />
          </div>
          
          <div className="AccountSettings_form_actions">
            <Button
              text="비밀번호 변경"
              type="positive"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            />
          </div>
        </form>
      </div>
      
      {/* Notification Settings Section */}
      <div className="AccountSettings_section">
        <h3 className="AccountSettings_section_title">알림 설정</h3>
        
        {submitSuccess.notifications && (
          <div className="AccountSettings_success">
            알림 설정이 성공적으로 업데이트되었습니다.
          </div>
        )}
        
        <form onSubmit={handleNotificationSubmit} className="AccountSettings_form">
          <div className="AccountSettings_form_group AccountSettings_checkbox_group">
            <input
              type="checkbox"
              id="emailNotifications"
              name="emailNotifications"
              checked={notificationSettings.emailNotifications}
              onChange={handleNotificationChange}
              disabled={isSubmitting}
            />
            <label htmlFor="emailNotifications">이메일 알림 받기</label>
          </div>
          
          <div className="AccountSettings_form_group AccountSettings_checkbox_group">
            <input
              type="checkbox"
              id="pushNotifications"
              name="pushNotifications"
              checked={notificationSettings.pushNotifications}
              onChange={handleNotificationChange}
              disabled={isSubmitting}
            />
            <label htmlFor="pushNotifications">푸시 알림 받기</label>
          </div>
          
          <div className="AccountSettings_form_group AccountSettings_checkbox_group">
            <input
              type="checkbox"
              id="dailyDigest"
              name="dailyDigest"
              checked={notificationSettings.dailyDigest}
              onChange={handleNotificationChange}
              disabled={isSubmitting}
            />
            <label htmlFor="dailyDigest">일일 요약 받기</label>
          </div>
          
          <div className="AccountSettings_form_group AccountSettings_checkbox_group">
            <input
              type="checkbox"
              id="weeklyReport"
              name="weeklyReport"
              checked={notificationSettings.weeklyReport}
              onChange={handleNotificationChange}
              disabled={isSubmitting}
            />
            <label htmlFor="weeklyReport">주간 리포트 받기</label>
          </div>
          
          <div className="AccountSettings_form_actions">
            <Button
              text="알림 설정 저장"
              type="positive"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            />
          </div>
        </form>
      </div>
      
      {/* Privacy Settings Section */}
      <div className="AccountSettings_section">
        <h3 className="AccountSettings_section_title">개인정보 설정</h3>
        
        {submitSuccess.privacy && (
          <div className="AccountSettings_success">
            개인정보 설정이 성공적으로 업데이트되었습니다.
          </div>
        )}
        
        <form onSubmit={handlePrivacySubmit} className="AccountSettings_form">
          <div className="AccountSettings_form_group">
            <label htmlFor="profileVisibility">프로필 공개 범위</label>
            <select
              id="profileVisibility"
              name="profileVisibility"
              value={privacySettings.profileVisibility}
              onChange={handlePrivacyChange}
              disabled={isSubmitting}
            >
              <option value="public">전체 공개</option>
              <option value="friends">친구에게만 공개</option>
              <option value="private">비공개</option>
            </select>
          </div>
          
          <div className="AccountSettings_form_group AccountSettings_checkbox_group">
            <input
              type="checkbox"
              id="shareHealthData"
              name="shareHealthData"
              checked={privacySettings.shareHealthData}
              onChange={handlePrivacyChange}
              disabled={isSubmitting}
            />
            <label htmlFor="shareHealthData">건강 데이터 공유</label>
          </div>
          
          <div className="AccountSettings_form_group AccountSettings_checkbox_group">
            <input
              type="checkbox"
              id="shareEmotions"
              name="shareEmotions"
              checked={privacySettings.shareEmotions}
              onChange={handlePrivacyChange}
              disabled={isSubmitting}
            />
            <label htmlFor="shareEmotions">감정 데이터 공유</label>
          </div>
          
          <div className="AccountSettings_form_group AccountSettings_checkbox_group">
            <input
              type="checkbox"
              id="shareDiaryEntries"
              name="shareDiaryEntries"
              checked={privacySettings.shareDiaryEntries}
              onChange={handlePrivacyChange}
              disabled={isSubmitting}
            />
            <label htmlFor="shareDiaryEntries">일기 항목 공유</label>
          </div>
          
          <div className="AccountSettings_form_actions">
            <Button
              text="개인정보 설정 저장"
              type="positive"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountSettings;