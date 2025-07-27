import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './EditProfile.scss';
import Notification from '../../../components/Notification';
import { User, ImageIcon, Globe, Save, XCircle, UploadCloud, Link as LinkIcon, Mail, Lock } from 'lucide-react'; // Added Mail and Lock
import { useUploadAvatarMutation, useGetProfileQuery } from '../../../services/user/userApi';

const API_BASE_URL = ''; 
const COUNTRIES_LIST = [
  'Ukraine', 'United States', 'Canada', 'United Kingdom', 'Germany',
  'France', 'Poland', 'Australia', 'Japan', 'South Korea', 'Other'
];

const EditProfile = ({ currentProfileData }) => { 
  const [formData, setFormData] = useState({
    username: '',
    avatarUrl: '', 
    bannerImageUrl: '', 
    bio: '',
    country: COUNTRIES_LIST[0],
    favoriteGameTitle: '',
    currentEmail: '', // New field
    newEmail: '',     // New field
    currentPassword: '', // New field
    newPassword: '',     // New field
    confirmPassword: '' // New field
  });
  
  const [avatarFile, setAvatarFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [bannerPreview, setBannerPreview] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [pageLoading, setPageLoading] = useState(true); 
  const [apiError, setApiError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [uploadAvatar] = useUploadAvatarMutation();
  const { data: profileData } = useGetProfileQuery();
  const userId = profileData?.payload?.id;
  
  const navigate = useNavigate();
  const avatarInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  const populateFormWithData = useCallback((data) => {
    setFormData({
      username: data?.username || 'CurrentUser', 
      avatarUrl: data?.avatarUrl || 'https://via.placeholder.com/150/2a333d/cdd6f4?Text=Avatar',
      bannerImageUrl: data?.bannerImageUrl || 'https://via.placeholder.com/1000x200/1e252e/5e81ac?Text=Profile+Banner',
      bio: data?.bio || 'This is a sample bio.',
      country: data?.country || COUNTRIES_LIST[0],
      favoriteGameTitle: data?.favoriteGame?.title || data?.favoriteGameTitle || '',
      currentEmail: data?.email || '', // Populate current email
      newEmail: '',                   // New email always starts empty
      currentPassword: '',            // Passwords always start empty for security
      newPassword: '',
      confirmPassword: '',
    });
    setAvatarPreview(data?.avatarUrl || 'https://via.placeholder.com/150/2a333d/cdd6f4?Text=Avatar');
    setBannerPreview(data?.bannerImageUrl || 'https://via.placeholder.com/1000x200/1e252e/5e81ac?Text=Profile+Banner');
  }, []);


  useEffect(() => {
    const fetchInitialProfileData = async () => {
      setPageLoading(true);
      setApiError(null);
      try {
        if (currentProfileData && currentProfileData.username !== 'User') {
            populateFormWithData(currentProfileData);
        } else {
            // Fallback to mock data or a direct fetch if currentProfileData is not sufficient
            await new Promise(resolve => setTimeout(resolve, 500));
            const mockData = {
                username: 'FluxUser',
                avatarUrl: 'https://via.placeholder.com/150/2a333d/cdd6f4?Text=Avatar',
                bannerImageUrl: 'https://via.placeholder.com/1000x200/1e252e/5e81ac?Text=Profile+Banner',
                bio: 'Welcome to my Flux profile! Exploring new games and connecting with players.',
                country: COUNTRIES_LIST[0], // Ukraine
                favoriteGameTitle: 'Cyberpunk 2077',
                email: 'user@example.com' // Mock current email
            };
            populateFormWithData(mockData);
        }
      } catch (err) {
        console.error("Failed to fetch initial profile data:", err);
        setApiError(err.message || 'Could not load profile data to edit.');
        populateFormWithData({}); // Populate with defaults on error
      } finally {
        setPageLoading(false);
      }
    };

    fetchInitialProfileData();
  }, [currentProfileData, populateFormWithData]);

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      if (fileType === 'avatar') {
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
      } else if (fileType === 'banner') {
        setBannerFile(file);
        setBannerPreview(URL.createObjectURL(file));
      }
    }
  };
  
  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview);
      }
      if (bannerPreview && bannerPreview.startsWith('blob:')) {
        URL.revokeObjectURL(bannerPreview);
      }
    };
  }, [avatarPreview, bannerPreview]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null); // Clear previous errors

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setApiError("New passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage(null);

    const submissionData = new FormData();
    submissionData.append('username', formData.username);
    submissionData.append('bio', formData.bio);
    submissionData.append('country', formData.country);
    submissionData.append('favoriteGameTitle', formData.favoriteGameTitle);
    
    if (avatarFile) {
      submissionData.append('avatar', avatarFile);
    } else {
      submissionData.append('avatarUrl', formData.avatarUrl);
    }
    if (bannerFile) {
      submissionData.append('banner', bannerFile);
    } else {
      submissionData.append('bannerImageUrl', formData.bannerImageUrl);
    }

    // Add email change fields if newEmail is provided and different
    if (formData.newEmail && formData.newEmail.trim() !== '' && formData.newEmail !== formData.currentEmail) {
      submissionData.append('newEmail', formData.newEmail.trim());
      // The backend might require currentEmail for verification, or infer it from the session.
      // submissionData.append('currentEmailForVerification', formData.currentEmail);
    }

    // Add password change fields if newPassword is provided
    if (formData.newPassword && formData.newPassword.trim() !== '') {
      if (!formData.currentPassword || formData.currentPassword.trim() === '') {
        setApiError("Current password is required to set a new password.");
        setIsSubmitting(false);
        return;
      }
      submissionData.append('currentPassword', formData.currentPassword);
      submissionData.append('newPassword', formData.newPassword);
      submissionData.append('confirmPassword', formData.confirmPassword); // For server re-validation
    } else if (formData.currentPassword && formData.currentPassword.trim() !== '' && 
               formData.newEmail && formData.newEmail.trim() !== '' && formData.newEmail !== formData.currentEmail) {
      // If ONLY email is being changed (no new password) AND current password was supplied,
      // send currentPassword as it's likely for authorizing the email change.
      submissionData.append('currentPassword', formData.currentPassword);
    }


    try {
      // console.log("Submitting FormData (raw):");
      // for (let [key, value] of submissionData.entries()) {
      //   console.log(key, value instanceof File ? `${value.name} (File)` : value);
      // }
      console.log("Submitting FormData (as object for easier logging):", Object.fromEntries(submissionData.entries()));

      // const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
      //   method: 'PUT', 
      //   body: submissionData,
      //   // Headers for FormData are usually set automatically by the browser,
      //   // including 'Content-Type': 'multipart/form-data; boundary=...'
      //   // Do not set 'Content-Type': 'application/json' when sending FormData.
      // });
      // if (!response.ok) { 
      //   const errorData = await response.json().catch(() => ({ message: response.statusText }));
      //   throw new Error(errorData.message || `Server responded with ${response.status}`);
      // }
      // const result = await response.json();
      
      if (avatarFile && userId) {
        const formData = new FormData();
        formData.append("UserId", userId);
        formData.append("Image", avatarFile);

        try {
          const uploadResult = await uploadAvatar(formData).unwrap();
          console.log("Avatar uploaded:", uploadResult);
        } catch (err) {
          console.error("Avatar upload error:", err);
          setApiError("Failed to upload avatar.");
          setIsSubmitting(false);
          return;
        }
      }


      await new Promise(resolve => setTimeout(resolve, 1500)); 
      // console.log("Profile update submitted (mock API):", formData, {avatarFile, bannerFile});
      
      setSuccessMessage('Profile updated successfully!');
      // const newEmailAfterUpdate = result?.newEmail || (formData.newEmail && formData.newEmail.trim() !== '' ? formData.newEmail.trim() : formData.currentEmail);

      setFormData(prev => ({
        ...prev,
        // currentEmail: newEmailAfterUpdate, // Update currentEmail if changed
        newEmail: '', // Clear new email input
        currentPassword: '', // Always clear password fields after submission
        newPassword: '',
        confirmPassword: '',
        // If backend returns new URLs for avatar/banner after upload:
        // avatarUrl: result.newAvatarUrl || prev.avatarUrl,
        // bannerImageUrl: result.newBannerUrl || prev.bannerImageUrl,
      }));
      // If email was successfully changed, you might want to update `formData.currentEmail` based on API response
      // For now, keeping it simple as the mock doesn't return a new email.

      // setAvatarFile(null); 
      // setBannerFile(null);

      setTimeout(() => navigate('/profile'), 2000);

    } catch (err) {
      console.error("Failed to update profile:", err);
      setApiError(err.message || 'Could not update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (pageLoading) {
    return <div className="edit-profile-loading">Loading profile editor... <div className="spinner"></div></div>;
  }

  return (
    <div className="edit-profile-page-container">
      <Notification message={apiError} type="error" onClose={() => setApiError(null)} />
      <Notification message={successMessage} type="success" onClose={() => setSuccessMessage(null)} />

      <header className="edit-profile-main-header">
        <h1>Edit Your Profile</h1>
        <p>Make changes to your public presence and account settings on Fluxi.</p>
      </header>

      <form onSubmit={handleSubmit} className="edit-profile-form-content">
        <section className="edit-form-section">
          <h2 className="section-title"><User size={22}/> Basic Information</h2>
          <div className="form-row">
            <div className="form-group column-half">
              <label htmlFor="username">Username</label>
              <input type="text" id="username" name="username" value={formData.username} onChange={handleTextChange} placeholder="Your display name" required />
            </div>
            <div className="form-group column-half">
              <label htmlFor="country">Country</label>
              <div className="custom-select-input-wrapper">
                <select id="country" name="country" value={formData.country} onChange={handleTextChange}>
                  {COUNTRIES_LIST.map(country => (<option key={country} value={country}>{country}</option>))}
                </select>
                <Globe size={18} className="input-icon suffix"/>
              </div>
            </div>
          </div>
        </section>

        <section className="edit-form-section">
          <h2 className="section-title"><ImageIcon size={22}/> Profile Visuals</h2>
          <div className="form-row visuals-row">
            <div className="form-group file-upload-group column-half">
              <label htmlFor="avatarFile">Avatar Image</label>
              <div className="file-input-wrapper">
                <button type="button" className="file-select-button" onClick={() => avatarInputRef.current?.click()}>
                  <UploadCloud size={18} /> Choose Avatar
                </button>
                <input type="file" id="avatarFile" name="avatarFile" ref={avatarInputRef} onChange={(e) => handleFileChange(e, 'avatar')} accept="image/png, image/jpeg, image/gif" />
                {avatarFile && <span className="file-name-display">{avatarFile.name}</span>}
              </div>
              <small className="field-hint">Recommended: Square, min 256x256px. (PNG, JPG, GIF)</small>
              {avatarPreview && <img src={avatarPreview} alt="Avatar Preview" className="image-preview-display avatar-display"/>}
            </div>

            <div className="form-group file-upload-group column-half">
              <label htmlFor="bannerFile">Banner Image</label>
                <div className="file-input-wrapper">
                <button type="button" className="file-select-button" onClick={() => bannerInputRef.current?.click()}>
                  <UploadCloud size={18} /> Choose Banner
                </button>
                <input type="file" id="bannerFile" name="bannerFile" ref={bannerInputRef} onChange={(e) => handleFileChange(e, 'banner')} accept="image/png, image/jpeg, image/gif" />
                {bannerFile && <span className="file-name-display">{bannerFile.name}</span>}
              </div>
              <small className="field-hint">Recommended: 1200x300px or wider. (PNG, JPG, GIF)</small>
              {bannerPreview && <img src={bannerPreview} alt="Banner Preview" className="image-preview-display banner-display"/>}
            </div>
          </div>
        </section>

        <section className="edit-form-section">
          <h2 className="section-title"><LinkIcon size={22}/> About You</h2>
          <div className="form-group">
            <label htmlFor="bio">Bio / About Me</label>
            <textarea id="bio" name="bio" value={formData.bio} onChange={handleTextChange} placeholder="Tell the Flux community something about yourself..." rows={6}></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="favoriteGameTitle">Favorite Game Title</label>
            <input type="text" id="favoriteGameTitle" name="favoriteGameTitle" value={formData.favoriteGameTitle} onChange={handleTextChange} placeholder="E.g., The Witcher 3, Portal 2" />
          </div>
        </section>

        {/* New Account Security Section */}
        <section className="edit-form-section">
            <h2 className="section-title"><Lock size={22}/> Account Security</h2>
            
            <div className="form-row">
                <div className="form-group column-half">
                    <label htmlFor="currentEmail">Current Email Address</label>
                    <input 
                        type="email" 
                        id="currentEmail" 
                        name="currentEmail" 
                        value={formData.currentEmail} 
                        onChange={handleTextChange} // Or make readOnly if it's just for display
                        placeholder="your.email@example.com" 
                        autoComplete="email"
                        readOnly // Often, current email is not directly editable here but shown as reference
                    />
                     <small className="field-hint">Your registered email address. To change it, use the 'New Email' field.</small>
                </div>
                <div className="form-group column-half">
                    <label htmlFor="newEmail">New Email Address (Optional)</label>
                    <input 
                        type="email" 
                        id="newEmail" 
                        name="newEmail" 
                        value={formData.newEmail} 
                        onChange={handleTextChange} 
                        placeholder="Enter new email" 
                        autoComplete="email"
                    />
                    <small className="field-hint">Leave blank if you don't want to change your email.</small>
                </div>
            </div>

            <div className="form-row">
                <div className="form-group column-full">
                    <label htmlFor="currentPassword">Current Password</label>
                    <input 
                        type="password" 
                        id="currentPassword" 
                        name="currentPassword" 
                        value={formData.currentPassword} 
                        onChange={handleTextChange} 
                        placeholder="Enter current password to update email or password" 
                        autoComplete="current-password"
                    />
                    <small className="field-hint">Required if changing email or setting a new password.</small>
                </div>
            </div>

            <div className="form-row">
                <div className="form-group column-half">
                    <label htmlFor="newPassword">New Password (Optional)</label>
                    <input 
                        type="password" 
                        id="newPassword" 
                        name="newPassword" 
                        value={formData.newPassword} 
                        onChange={handleTextChange} 
                        placeholder="Enter new password" 
                        autoComplete="new-password"
                    />
                     <small className="field-hint">Min. 8 characters. Leave blank to keep current password.</small>
                </div>
                <div className="form-group column-half">
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <input 
                        type="password" 
                        id="confirmPassword" 
                        name="confirmPassword" 
                        value={formData.confirmPassword} 
                        onChange={handleTextChange} 
                        placeholder="Confirm new password" 
                        autoComplete="new-password"
                    />
                    <small className="field-hint">Required if new password is entered.</small>
                </div>
            </div>
        </section>


        <div className="edit-form-actions">
          <button type="button" className="action-button cancel-button" onClick={() => navigate('/profile')} disabled={isSubmitting}>
            <XCircle size={20}/> Cancel
          </button>
          <button type="submit" className="action-button save-button" disabled={isSubmitting}>
            {isSubmitting ? (<><div className="spinner-small-button"></div> Saving...</>) : (<><Save size={20}/> Save Changes</>)}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;