import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './EditProfile.scss';
import Notification from '../../../components/Notification';
import { User, ImageIcon, Globe, Save, XCircle, UploadCloud, Link as LinkIcon } from 'lucide-react';

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
  });
  
  const [avatarFile, setAvatarFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [bannerPreview, setBannerPreview] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [pageLoading, setPageLoading] = useState(true); 
  const [apiError, setApiError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
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
            // Інакше, робимо запит (наприклад, якщо користувач оновив сторінку напряму)
            // const response = await fetch(`${API_BASE_URL}/api/user/profile`); 
            // if (!response.ok) { /* ... */ }
            // const data = await response.json();
            // populateFormWithData(data);

            await new Promise(resolve => setTimeout(resolve, 500));
             const mockData = {
                username: '',
                avatarUrl: '',
                bannerImageUrl: '',
                bio: '',
                country: '',
                favoriteGameTitle: '',
            };
            populateFormWithData(mockData);
        }
      } catch (err) {
        console.error("Failed to fetch initial profile data:", err);
        setApiError(err.message || 'Could not load profile data to edit.');
        populateFormWithData({});
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
    setIsSubmitting(true);
    setApiError(null);
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

    try {
      // console.log("Submitting FormData:");
      // for (let [key, value] of submissionData.entries()) {
      //   console.log(key, value);
      // }
      // const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
      //   method: 'PUT', // або PATCH
      //   // headers: { 'Content-Type': 'multipart/form-data' }, 
      //   body: submissionData,
      // });
      // if (!response.ok) { /* ... */ }
      // const result = await response.json();
      
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      console.log("Profile update submitted (FormData would be sent):", formData, {avatarFile, bannerFile});

      setSuccessMessage('Profile updated successfully!');
      // setFormData(prev => ({...prev, avatarUrl: result.newAvatarUrl, bannerImageUrl: result.newBannerUrl}));
      // setAvatarFile(null); setBannerFile(null);

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
        <p>Make changes to your public presence on Fluxi.</p>
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
              <small className="field-hint">Recommended: 1200x300px or wider (e.g., 1600x400px). (PNG, JPG, GIF)</small>
              {bannerPreview && <img src={bannerPreview} alt="Banner Preview" className="image-preview-display banner-display"/>}
            </div>
          </div>
        </section>

        <section className="edit-form-section">
          <h2 className="section-title"><LinkIcon size={22}/> About You</h2>
          <div className="form-group">
            <label htmlFor="bio">Bio / About Me</label>
            <textarea id="bio" name="bio" value={formData.bio} onChange={handleTextChange} placeholder="Tell the Fluxi community something about yourself..." rows={6}></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="favoriteGameTitle">Favorite Game Title</label>
            <input type="text" id="favoriteGameTitle" name="favoriteGameTitle" value={formData.favoriteGameTitle} onChange={handleTextChange} placeholder="E.g., The Witcher 3, Portal 2" />
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