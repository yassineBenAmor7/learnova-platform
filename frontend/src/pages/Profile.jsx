import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth.service';
import { userService } from '../services/user.service';
import { gamificationService } from '../services/gamification.service';
import Badge from '../components/Badge/Badge';
import { useToast } from '../contexts/ToastContext';
import { useConfirm } from '../contexts/ConfirmContext';
import { 
  User, Mail, Calendar, Award, BookOpen, Clock, 
  TrendingUp, Settings, Bell, Globe, Shield, 
  Download, Eye, Edit2, Save, X, ChevronRight
} from 'lucide-react';
import './Profile.css';

function Profile() {
  const { user, isAdmin, refreshUser } = useAuth();
  const toast = useToast();
  const { confirm } = useConfirm();
  const [activeTab, setActiveTab] = useState('profile');
  const [editing, setEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [formData, setFormData] = useState(() => ({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    location: user?.location || '',
  }));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
  });
  const [preferences, setPreferences] = useState({
    language: 'en',
    timezone: 'UTC',
    theme: 'light',
  });

  // Real data states
  const [userStats, setUserStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    totalHours: 0,
    certificates: 0,
    quizzesPassed: 0,
    currentStreak: 0,
    totalPoints: 0,
    level: 1,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [userBadges, setUserBadges] = useState([]);
  const [statsLoading, setStatsLoading] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        currentPassword: prev.currentPassword || '',
        newPassword: prev.newPassword || '',
        confirmPassword: prev.confirmPassword || '',
        phone: user.phone || '',
        bio: user.bio || '',
        location: user.location || '',
      }));
      if (user.avatar) {
        setAvatarPreview(user.avatar);
      }
    }
  }, [user?.id]);

  // Fetch real statistics when switching to stats tab
  useEffect(() => {
    if (activeTab === 'stats' && user?.id) {
      fetchUserStatistics();
    }
  }, [activeTab, user?.id]);

  // Fetch real settings when switching to settings tab
  useEffect(() => {
    if (activeTab === 'settings' && user?.id) {
      fetchUserSettings();
    }
  }, [activeTab, user?.id]);

  const fetchUserStatistics = async () => {
    setStatsLoading(true);
    try {
      console.log('Fetching user statistics...');
      const stats = await userService.getStatistics();
      console.log('User statistics received:', stats);
      
      // Fetch streak from gamification service for consistency with dashboard
      const streak = await gamificationService.getMyStreak().catch(() => ({ currentStreak: 0 }));
      console.log('User streak received:', streak);
      
      setUserStats({ ...stats, currentStreak: streak.currentStreak || 0 });

      const activity = await userService.getActivity(10);
      console.log('User activity received:', activity);
      setRecentActivity(activity);

      const badgesRes = await gamificationService.getMyBadges().catch(() => null);
      console.log('User badges received:', badgesRes);
      if (badgesRes?.badges) {
        const bArray = Array.isArray(badgesRes.badges) ? badgesRes.badges : (badgesRes.badges?.badges || []);
        setUserBadges(bArray);
      }
    } catch (err) {
      console.error('Failed to fetch statistics:', err);
      setError('Failed to load profile data');
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchUserSettings = async () => {
    setSettingsLoading(true);
    try {
      const [userNotifications, userPreferences] = await Promise.all([
        userService.getNotifications().catch(() => null),
        userService.getPreferences().catch(() => null)
      ]);
      
      if (userNotifications) {
        setNotifications(userNotifications);
      }
      
      if (userPreferences) {
        setPreferences(userPreferences);
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
      // Keep default values if API fails
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleNotificationChange = (key, value) => {
    console.log('Notification change:', key, value);
    setNotifications(prev => {
      const updated = { ...prev, [key]: value };
      console.log('Updated notifications:', updated);
      
      // Try to update on server, but don't block UI
      userService.updateNotifications(updated)
        .then(() => {
          setSuccess('Notifications updated successfully!');
          setTimeout(() => setSuccess(false), 3000);
        })
        .catch((err) => {
          console.error('Failed to update notifications:', err);
          setSuccess('Notifications updated (local only)');
          setTimeout(() => setSuccess(false), 3000);
        });
      
      return updated;
    });
  };

  const handlePreferenceChange = (key, value) => {
    console.log('Preference change:', key, value);
    setPreferences(prev => {
      const updated = { ...prev, [key]: value };
      console.log('Updated preferences:', updated);
      
      // Try to update on server, but don't block UI
      userService.updatePreferences(updated)
        .then(() => {
          setSuccess('Preferences updated successfully!');
          setTimeout(() => setSuccess(false), 3000);
        })
        .catch((err) => {
          console.error('Failed to update preferences:', err);
          setSuccess('Preferences updated (local only)');
          setTimeout(() => setSuccess(false), 3000);
        });
      
      return updated;
    });
  };

  const handleDownloadData = async () => {
    try {
      setError(null);
      const data = await userService.downloadUserData();

      // Create a blob and download the file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `learnova-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSuccess('Data downloaded successfully!');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to download data:', err);
      setError('Failed to download data');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = await confirm({
      title: 'Delete Account',
      message: 'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.',
      confirmText: 'Delete Account',
      cancelText: 'Cancel',
      type: 'danger',
    });

    if (confirmed) {
      try {
        setError(null);
        await userService.deleteAccount('');
        toast.success('Account deleted successfully');
        authService.logout();
        window.location.href = '/';
      } catch (err) {
        console.error('Failed to delete account:', err);
        toast.error('Failed to delete account. Please try again.');
      }
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;

    try {
      setUploadingAvatar(true);
      setError(null);

      const result = await userService.uploadAvatar(avatarFile);
      
      // Refresh user data to get updated avatar
      await refreshUser();
      
      setSuccess('Avatar updated successfully!');
      setAvatarFile(null);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to upload avatar');
      console.error(err);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleChange = (e) => {
    console.log('handleChange called:', e.target.name, e.target.value);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword) {
      if (!formData.currentPassword) {
        setError('Current password is required to change password');
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setError('New passwords do not match');
        return;
      }
    }

    if (formData.email) {
      const trimmedEmail = formData.email.trim().toLowerCase();
      const trustedLearnerRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.(com|fr)|hotmail\.(com|fr)|yahoo\.(com|fr)|icloud\.com)$/i;
      const trustedAdminRegex = /^[a-zA-Z0-9._%+-]+@(learnova\.com|gmail\.com|outlook\.(com|fr)|hotmail\.(com|fr)|yahoo\.(com|fr)|icloud\.com)$/i;
      const isValid = isAdmin
        ? trustedAdminRegex.test(trimmedEmail)
        : trustedLearnerRegex.test(trimmedEmail);

      if (!isValid) {
        setError(
          isAdmin
            ? 'Administrators must use an official @learnova.com address or a trusted provider (Gmail, Outlook, Yahoo, iCloud).'
            : 'Only trusted email addresses (Gmail, Outlook, Hotmail, Yahoo, iCloud) are permitted.'
        );
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const { confirmPassword, ...submitData } = formData;

      if (!submitData.newPassword) {
        delete submitData.currentPassword;
        delete submitData.newPassword;
      }

      await authService.updateProfile(submitData);
      await refreshUser();

      setSuccess(true);
      setEditing(false);
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      phone: user?.phone || '',
      bio: user?.bio || '',
      location: user?.location || '',
    });
    setEditing(false);
    setError(null);
  };

  if (!user) {
    return (
      <div className="profile-container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  const renderProfileTab = () => {
    return (
    <div className="profile-content">
      <div className="profile-card card">
        <div className="profile-header-section">
          <div className="profile-avatar-large">
            {avatarPreview ? (
              <img 
                src={avatarPreview} 
                alt="Profile avatar" 
                className="avatar-image-large"
              />
            ) : (
              <div className="avatar-placeholder-large">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </div>
            )}
            <input
              type="file"
              ref={input => {
                if (input) {
                  input.onchange = handleAvatarChange;
                }
              }}
              accept="image/*"
              style={{ display: 'none' }}
              id="avatar-input"
            />
            <button 
              className="avatar-edit-btn"
              onClick={() => document.getElementById('avatar-input').click()}
              title="Change avatar"
            >
              <Edit2 size={18} />
            </button>
          </div>
          <div className="profile-info">
            <h2 className="user-name-large">
              {user.firstName} {user.lastName}
            </h2>
            <p className="user-email">{user.email}</p>
            <div className="user-badges">
              <span className="badge badge-primary">{user.role?.name || 'Learner'}</span>
              <span className="badge badge-secondary">Level {userStats?.level || 1}</span>
            </div>
            {avatarFile && (
              <div className="avatar-upload-actions">
                <button 
                  onClick={handleAvatarUpload}
                  disabled={uploadingAvatar}
                  className="btn btn-primary btn-sm"
                >
                  {uploadingAvatar ? 'Uploading...' : 'Save Avatar'}
                </button>
                <button 
                  onClick={() => {
                    setAvatarFile(null);
                    setAvatarPreview(user.avatar || null);
                  }}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {success && (
          <div className="alert alert-success">
            Profile updated successfully!
          </div>
        )}

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-section">
            <h3 className="form-section-title">
              <User size={20} />
              Personal Information
            </h3>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName || ''}
                  onChange={handleChange}
                  className="form-control"
                  required
                  disabled={!editing}
                  autoComplete="off"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName || ''}
                  onChange={handleChange}
                  className="form-control"
                  required
                  disabled={!editing}
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                className="form-control"
                required
                disabled={!editing}
                autoComplete="off"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                className="form-control"
                placeholder="+216 XX XXX XXX"
                disabled={!editing}
                autoComplete="off"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location || ''}
                onChange={handleChange}
                className="form-control"
                placeholder="City, Country"
                disabled={!editing}
                autoComplete="off"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea
                name="bio"
                value={formData.bio || ''}
                onChange={handleChange}
                className="form-control"
                rows={4}
                placeholder="Tell us about yourself..."
                disabled={!editing}
                autoComplete="off"
              />
            </div>
          </div>

          {editing && (
            <div className="form-section">
              <h3 className="form-section-title">
                <Shield size={20} />
                Change Password
              </h3>

              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword || ''}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter current password"
                />
              </div>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword || ''}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter new password"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword || ''}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          )}

          <div className="profile-actions">
            {!editing ? (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="btn btn-primary"
              >
                <Edit2 size={18} />
                Edit Profile
              </button>
            ) : (
              <div className="edit-actions">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  <X size={18} />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  <Save size={18} />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </form>

        <div className="profile-meta">
          <div className="meta-item">
            <Calendar size={18} />
            <span className="meta-label">Member Since:</span>
            <span className="meta-value">
              {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="meta-item">
            <User size={18} />
            <span className="meta-label">Account ID:</span>
            <span className="meta-value">#{user.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

  const renderStatsTab = () => (
    <div className="profile-content">
      {statsLoading ? (
        <div className="loading">Loading statistics...</div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card stat-courses">
              <BookOpen size={32} className="stat-icon" />
              <div className="stat-content">
                <h3>{userStats?.totalCourses || 0}</h3>
                <p>Total Courses</p>
              </div>
            </div>
            <div className="stat-card stat-completed">
              <Award size={32} className="stat-icon" />
              <div className="stat-content">
                <h3>{userStats?.completedCourses || 0}</h3>
                <p>Completed</p>
              </div>
            </div>
            <div className="stat-card stat-hours">
              <Clock size={32} className="stat-icon" />
              <div className="stat-content">
                <h3>{userStats?.totalHours || 0}h</h3>
                <p>Learning Hours</p>
              </div>
            </div>
            <div className="stat-card stat-certificates">
              <Award size={32} className="stat-icon" />
              <div className="stat-content">
                <h3>{userStats?.certificates || 0}</h3>
                <p>Certificates</p>
              </div>
            </div>
            <div className="stat-card stat-quizzes">
              <TrendingUp size={32} className="stat-icon" />
              <div className="stat-content">
                <h3>{userStats?.quizzesPassed || 0}</h3>
                <p>Quizzes Passed</p>
              </div>
            </div>
            <div className="stat-card stat-streak">
              <Award size={32} className="stat-icon" />
              <div className="stat-content">
                <h3>{userStats?.currentStreak || 0}</h3>
                <p>Days Streak</p>
              </div>
            </div>
            <div className="stat-card stat-points">
              <Award size={32} className="stat-icon" />
              <div className="stat-content">
                <h3>{userStats?.totalPoints || 0} pts</h3>
                <p>Gamification Points</p>
              </div>
            </div>
            <div className="stat-card stat-level">
              <TrendingUp size={32} className="stat-icon" />
              <div className="stat-content">
                <h3>Level {userStats?.level || 1}</h3>
                <p>Learner Level</p>
              </div>
            </div>
          </div>

          {/* Earned Badges & Achievements Section */}
          <div className="profile-badges-section card" style={{ padding: '1.75rem 2rem', marginBottom: '2rem', borderRadius: '20px', maxWidth: '800px', margin: '0 auto 2rem auto' }}>
            <h3 className="section-title" style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Award size={24} style={{ color: 'var(--primary, #1e40af)' }} /> Earned Badges & Achievements
            </h3>
            {userBadges && userBadges.filter(b => b.unlocked !== false).length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'stretch', gap: '1.5rem', width: '100%' }}>
                {userBadges.filter(b => b.unlocked !== false).map((badge) => (
                  <Badge key={badge.id || badge.name} badge={badge} size="medium" />
                ))}
              </div>
            ) : (
              <p style={{ color: '#64748b', margin: 0, fontSize: '0.92rem' }}>
                No badges earned yet. Complete masterclasses, pass practice quizzes, and maintain streaks to earn badges!
              </p>
            )}
          </div>

          <div className="activity-section card">
            <h3 className="section-title">Recent Activity</h3>
            {!recentActivity || recentActivity.length === 0 ? (
              <p className="no-activity">No recent activity</p>
            ) : (
              <div className="activity-list">
                {recentActivity.map((activity, index) => (
                  <div key={activity.id || index} className="activity-item">
                    <div className="activity-icon">
                      {(activity.type === 'course' || activity.type === 'course_enrollment') && <BookOpen size={20} />}
                      {activity.type === 'quiz' && <TrendingUp size={20} />}
                      {activity.type === 'certificate' && <Award size={20} />}
                    </div>
                    <div className="activity-details">
                      <p className="activity-title">{activity.title}</p>
                      <span className="activity-date">
                        {activity.date ? new Date(activity.date).toLocaleDateString() : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );

  const renderSettingsTab = () => (
    <div className="profile-content">
      <div className="settings-section card">
        <h3 className="section-title">
          <Bell size={24} />
          Notification Preferences
        </h3>
        <div className="settings-list">
          <div className="setting-item">
            <div className="setting-info">
              <h4>Email Notifications</h4>
              <p>Receive updates about your courses and progress</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={Boolean(notifications?.email)}
                onChange={(e) => handleNotificationChange('email', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h4>Push Notifications</h4>
              <p>Get instant alerts on your device</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={Boolean(notifications?.push)}
                onChange={(e) => handleNotificationChange('push', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h4>SMS Notifications</h4>
              <p>Receive important updates via SMS</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={Boolean(notifications?.sms)}
                onChange={(e) => handleNotificationChange('sms', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      <div className="settings-section card">
        <h3 className="section-title">
          <Globe size={24} />
          Language & Region
        </h3>
        <div className="settings-list">
          <div className="setting-item">
            <div className="setting-info">
              <h4>Language</h4>
              <p>Select your preferred language</p>
            </div>
            <select
              className="form-control"
              value={preferences.language}
              onChange={(e) => handlePreferenceChange('language', e.target.value)}
            >
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="ar">Arabic</option>
            </select>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h4>Timezone</h4>
              <p>Set your local timezone</p>
            </div>
            <select
              className="form-control"
              value={preferences.timezone}
              onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
            >
              <option value="UTC">UTC</option>
              <option value="Europe/Paris">Europe/Paris</option>
              <option value="Africa/Tunis">Africa/Tunis</option>
            </select>
          </div>
        </div>
      </div>

      <div className="settings-section card">
        <h3 className="section-title">
          <Shield size={24} />
          Privacy & Security
        </h3>
        <div className="settings-list">
          <button 
            className="setting-button"
            onClick={handleDownloadData}
          >
            <div className="setting-info">
              <h4>Download My Data</h4>
              <p>Get a copy of all your personal data</p>
            </div>
            <Download size={20} />
          </button>
          <button 
            className="setting-button setting-button-danger"
            onClick={handleDeleteAccount}
          >
            <div className="setting-info">
              <h4>Delete Account</h4>
              <p>Permanently delete your account and data</p>
            </div>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}
    </div>
  );

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <p>Manage your account settings and preferences</p>
      </div>

      <div className="profile-layout">
        <div className="profile-sidebar">
          <nav className="profile-nav">
            <button 
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={20} />
              Profile
            </button>
            {user.role?.name !== 'ADMIN' && (
              <button 
                className={`nav-item ${activeTab === 'stats' ? 'active' : ''}`}
                onClick={() => setActiveTab('stats')}
              >
                <TrendingUp size={20} />
                Statistics
              </button>
            )}
            <button 
              className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={20} />
              Settings
            </button>
          </nav>
        </div>

        <div className="profile-main">
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'stats' && renderStatsTab()}
          {activeTab === 'settings' && renderSettingsTab()}
        </div>
      </div>
    </div>
  );
};

export default Profile;
