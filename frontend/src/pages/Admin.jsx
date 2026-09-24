import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services/admin.service';
import { 
  Users, BookOpen, FileText, Award, TrendingUp, 
  Activity, Settings, LogOut, Search, Plus, 
  Edit, Trash2, MoreVertical, Filter, Download, HelpCircle, ChevronUp, ChevronDown,
  Sparkles, CheckCircle2, RefreshCw
} from 'lucide-react';
import { aiService } from '../services/ai.service';
import { useToast } from '../contexts/ToastContext';
import { useConfirm } from '../contexts/ConfirmContext';
import './Admin.css';

const Admin = () => {
  const { user, isAdmin, logout } = useAuth();
  const toast = useToast();
  const { confirm } = useConfirm();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [courses, setCourses] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [appliedUserSearch, setAppliedUserSearch] = useState('');
  const [appliedRoleFilter, setAppliedRoleFilter] = useState('');
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ firstName: '', lastName: '', email: '', password: '', role: 'LEARNER' });
  const [creatingUser, setCreatingUser] = useState(false);
  const [courseSearch, setCourseSearch] = useState('');
  const [appliedCourseSearch, setAppliedCourseSearch] = useState('');
  const [courseFilterMinSessions, setCourseFilterMinSessions] = useState('');
  const [courseFilterMaxSessions, setCourseFilterMaxSessions] = useState('');
  const [courseFilterMinQuizzes, setCourseFilterMinQuizzes] = useState('');
  const [courseFilterMaxQuizzes, setCourseFilterMaxQuizzes] = useState('');
  const [appliedCourseFilterMinSessions, setAppliedCourseFilterMinSessions] = useState('');
  const [appliedCourseFilterMaxSessions, setAppliedCourseFilterMaxSessions] = useState('');
  const [appliedCourseFilterMinQuizzes, setAppliedCourseFilterMinQuizzes] = useState('');
  const [appliedCourseFilterMaxQuizzes, setAppliedCourseFilterMaxQuizzes] = useState('');
  const [showCreateCourseModal, setShowCreateCourseModal] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: '', description: '', thumbnail: '', file: null });
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [sessionSearch, setSessionSearch] = useState('');
  const [appliedSessionSearch, setAppliedSessionSearch] = useState('');
  const [selectedCourseForSessionFilter, setSelectedCourseForSessionFilter] = useState('');
  const [showCreateSessionModal, setShowCreateSessionModal] = useState(false);
  const [newSession, setNewSession] = useState({ title: '', description: '', content: '', courseId: '', orderNumber: '' });
  const [videos, setVideos] = useState([]);
  const [videoSearch, setVideoSearch] = useState('');
  const [appliedVideoSearch, setAppliedVideoSearch] = useState('');
  const [selectedSessionForVideoFilter, setSelectedSessionForVideoFilter] = useState('');
  const [showCreateVideoModal, setShowCreateVideoModal] = useState(false);
  const [newVideo, setNewVideo] = useState({ title: '', url: '', duration: '', sessionId: '', orderNumber: '', file: null });
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [quizSearch, setQuizSearch] = useState('');
  const [appliedQuizSearch, setAppliedQuizSearch] = useState('');
  const [selectedModeForQuizFilter, setSelectedModeForQuizFilter] = useState('');
  const [selectedCourseForQuizFilter, setSelectedCourseForQuizFilter] = useState('');
  const [showCreateQuizModal, setShowCreateQuizModal] = useState(false);
  const [newQuiz, setNewQuiz] = useState({ title: '', description: '', courseId: '', isExamMode: false, timeLimitMinutes: '', passingScore: 70, maxAttempts: 3, randomizeQuestions: true, randomizeAnswers: true, allowReviewAfterSubmission: true, showExplanationAfterAnswer: true });
  const [certificates, setCertificates] = useState([]);
  const [certificateSearch, setCertificateSearch] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showCourseFilterModal, setShowCourseFilterModal] = useState(false);
  const [showSessionFilterModal, setShowSessionFilterModal] = useState(false);
  const [showVideoFilterModal, setShowVideoFilterModal] = useState(false);
  const [showQuizFilterModal, setShowQuizFilterModal] = useState(false);
  const [showCertificateFilterModal, setShowCertificateFilterModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showEditCourseModal, setShowEditCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editCourseFormData, setEditCourseFormData] = useState({ title: '', description: '', level: 'BEGINNER', thumbnail: '' });

  const handleEditCourse = (courseId) => {
    const targetCourse = courses.find(c => c.id === courseId);
    if (targetCourse) {
      setEditingCourse(targetCourse);
      setEditCourseFormData({
        title: targetCourse.title,
        description: targetCourse.description || '',
        level: targetCourse.level || 'BEGINNER',
        thumbnail: targetCourse.thumbnail || '',
      });
      setShowEditCourseModal(true);
    }
  };
  const [showEditSessionModal, setShowEditSessionModal] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [editSessionFormData, setEditSessionFormData] = useState({ title: '', description: '', content: '', courseId: '', orderNumber: '' });
  const [showEditVideoModal, setShowEditVideoModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [editVideoFormData, setEditVideoFormData] = useState({ title: '', url: '', duration: '', sessionId: '', orderNumber: '' });
  const [showEditQuizModal, setShowEditQuizModal] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [editQuizFormData, setEditQuizFormData] = useState({ title: '', description: '', courseId: '', isExamMode: false, timeLimitMinutes: '', passingScore: 70, maxAttempts: 3, randomizeQuestions: true, randomizeAnswers: true, allowReviewAfterSubmission: true, showExplanationAfterAnswer: true });
  const [showEditCertificateModal, setShowEditCertificateModal] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState(null);
  const [editCertificateFormData, setEditCertificateFormData] = useState({ userId: '', courseId: '' });
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({ firstName: '', lastName: '', email: '' });
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [selectedQuizForQuestions, setSelectedQuizForQuestions] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [showAddQuestionForm, setShowAddQuestionForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ text: '', options: [{ text: '', isCorrect: false, explanation: '' }, { text: '', isCorrect: false, explanation: '' }, { text: '', isCorrect: false, explanation: '' }, { text: '', isCorrect: false, explanation: '' }] });
  
  // AI Quiz Studio States (Section 5.3)
  const [aiQuizCourseId, setAiQuizCourseId] = useState('');
  const [aiQuizSessionId, setAiQuizSessionId] = useState('');
  const [aiQuizDifficulty, setAiQuizDifficulty] = useState('INTERMEDIATE');
  const [aiQuizCount, setAiQuizCount] = useState(5);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState(null);
  const [savingAiQuiz, setSavingAiQuiz] = useState(false);
  
  // Unified Course Builder Wizard States
  const [showCourseBuilder, setShowCourseBuilder] = useState(false);
  const [builderStep, setBuilderStep] = useState(1);
  const [builderCourse, setBuilderCourse] = useState({ title: '', description: '', level: 'BEGINNER', domain: 'IT_DATA', isPaid: false, price: 0, recommended: false, thumbnail: '', file: null });
  const [builderSessions, setBuilderSessions] = useState([]);
  const [builderCurrentSession, setBuilderCurrentSession] = useState({ title: '', description: '', content: '', orderNumber: 1 });
  const [builderVideos, setBuilderVideos] = useState([]);
  const [builderCurrentVideo, setBuilderCurrentVideo] = useState({ title: '', url: '', duration: '', orderNumber: 1, file: null });
  const [builderQuiz, setBuilderQuiz] = useState({ title: '', description: '', isExamMode: false, timeLimitMinutes: '', passingScore: 70, maxAttempts: 3, randomizeQuestions: true, randomizeAnswers: true, allowReviewAfterSubmission: true, showExplanationAfterAnswer: true });
  const [builderQuestions, setBuilderQuestions] = useState([]);
  const [builderCurrentQuestion, setBuilderCurrentQuestion] = useState({ text: '', options: [{ text: '', isCorrect: false, explanation: '' }, { text: '', isCorrect: false, explanation: '' }, { text: '', isCorrect: false, explanation: '' }, { text: '', isCorrect: false, explanation: '' }] });
  const [showBuilderAddQuestionForm, setShowBuilderAddQuestionForm] = useState(false);
  const [editingBuilderQuestionId, setEditingBuilderQuestionId] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [customDomain, setCustomDomain] = useState('');
  const [showCustomDomainInput, setShowCustomDomainInput] = useState(false);
  const [customDomains, setCustomDomains] = useState([]);

  // Course Detail View States
  const [showCourseDetail, setShowCourseDetail] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseSessions, setCourseSessions] = useState([]);
  const [courseVideos, setCourseVideos] = useState([]);
  const [courseQuizzes, setCourseQuizzes] = useState([]);
  const [detailTab, setDetailTab] = useState('overview');

  // Auto-save progress to localStorage
  useEffect(() => {
    if (showCourseBuilder) {
      const progressData = {
        builderCourse,
        builderSessions,
        builderVideos,
        builderQuiz,
        builderStep,
      };
      localStorage.setItem('courseBuilderProgress', JSON.stringify(progressData));
    }
  }, [builderCourse, builderSessions, builderVideos, builderQuiz, builderStep, showCourseBuilder]);

  // Load saved progress on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('courseBuilderProgress');
    if (savedProgress) {
      try {
        const progressData = JSON.parse(savedProgress);
        // Auto-restore progress without confirmation to avoid rendering issues
        setBuilderCourse(progressData.builderCourse || { title: '', description: '', thumbnail: '', file: null });
        setBuilderSessions(progressData.builderSessions || []);
        setBuilderVideos(progressData.builderVideos || []);
        setBuilderQuiz(progressData.builderQuiz || { title: '', description: '', isExamMode: false, timeLimitMinutes: '', passingScore: 70, maxAttempts: 3, randomizeQuestions: true, randomizeAnswers: true, allowReviewAfterSubmission: true, showExplanationAfterAnswer: true });
        setBuilderStep(progressData.builderStep || 1);
        setShowCourseBuilder(true);
      } catch (err) {
        console.error('Failed to load saved progress:', err);
        localStorage.removeItem('courseBuilderProgress');
      }
    }
  }, []);

  // Validation Functions
  const validateUrl = (url) => {
    if (!url) return true; // Optional field
    try {
      const urlObj = new URL(url);
      // Check if it's a valid video URL (YouTube, Vimeo, or direct video)
      const validHosts = ['youtube.com', 'youtu.be', 'vimeo.com', 'player.vimeo.com'];
      const validExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
      
      if (validHosts.some(host => urlObj.hostname.includes(host))) {
        return true;
      }
      
      if (validExtensions.some(ext => url.toLowerCase().endsWith(ext))) {
        return true;
      }
      
      return false;
    } catch {
      return false;
    }
  };

  const validateDuration = (duration) => {
    if (!duration) return true; // Optional field
    const durationRegex = /^\d+:[0-5]\d$/; // Format: MM:SS
    return durationRegex.test(duration);
  };

  const validateStep = (step) => {
    const errors = {};
    
    if (step === 1) {
      if (!builderCourse.title.trim()) {
        errors.title = 'Course title is required';
      }
      if (!builderCourse.description.trim()) {
        errors.description = 'Course description is required';
      }
    }
    
    if (step === 2) {
      if (builderSessions.length === 0) {
        errors.sessions = 'At least one session is required';
      }
    }
    
    if (step === 3) {
      if (builderVideos.length === 0) {
        errors.videos = 'At least one video is required';
      }
      builderVideos.forEach((video, index) => {
        if (!validateUrl(video.url)) {
          errors[`video_${index}_url`] = `Invalid URL for video "${video.title}"`;
        }
        if (!validateDuration(video.duration)) {
          errors[`video_${index}_duration`] = `Invalid duration format for video "${video.title}". Use MM:SS`;
        }
      });
    }
    
    if (step === 4) {
      if (!builderQuiz.title.trim()) {
        errors.quizTitle = 'Quiz title is required';
      }
      if (!builderQuiz.description.trim()) {
        errors.quizDescription = 'Quiz description is required';
      }
    }
    
    if (step === 5) {
      // Final validation before submission
      if (!builderCourse.title.trim()) {
        errors.title = 'Course title is required';
      }
      if (!builderCourse.description.trim()) {
        errors.description = 'Course description is required';
      }
      if (builderSessions.length === 0) {
        errors.sessions = 'At least one session is required';
      }
      if (builderVideos.length === 0) {
        errors.videos = 'At least one video is required';
      }
      if (!builderQuiz.title.trim()) {
        errors.quizTitle = 'Quiz title is required';
      }
      if (!builderQuiz.description.trim()) {
        errors.quizDescription = 'Quiz description is required';
      }
      
      // Validate video URLs
      builderVideos.forEach((video, index) => {
        if (!validateUrl(video.url)) {
          errors[`video_${index}_url`] = `Invalid URL for video "${video.title}"`;
        }
      });
    }
    
    return errors;
  };

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        setLoading(true);
        const [statsData, usersData, coursesData, sessionsData, videosData, quizzesData, certificatesData] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getRecentUsers(10),
          adminService.getAllCourses(),
          adminService.getAllSessions(),
          adminService.getAllVideos(),
          adminService.getAllQuizzes(),
          adminService.getAllCertificates(),
        ]);
        console.log('Stats data received:', statsData);
        setStats(statsData);
        setRecentUsers(usersData.users || []);
        setAllUsers(usersData.users || []);
        setCourses(coursesData);
        setSessions(sessionsData);
        setVideos(videosData);
        setQuizzes(quizzesData);
        setCertificates(certificatesData);
        setRecentActivity(statsData.recentActivity || []);
      } catch (err) {
        console.error('Failed to load admin data:', err);
        setError('Failed to load admin data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    loadAdminData();
  }, []);

  const formatDuration = (seconds) => {
    if (!seconds) return 'N/A';
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const parseDuration = (durationStr) => {
    if (!durationStr) return null;
    const parts = durationStr.split(':');
    if (parts.length === 3) {
      const hours = parseInt(parts[0]);
      const mins = parseInt(parts[1]);
      const secs = parseInt(parts[2]);
      return (hours * 3600) + (mins * 60) + secs;
    }
    if (parts.length === 2) {
      const mins = parseInt(parts[0]);
      const secs = parseInt(parts[1]);
      return (mins * 60) + secs;
    }
    return parseInt(durationStr);
  };

  const handleDeleteUser = async (userId) => {
    console.log('Attempting to delete user:', userId);
    try {
      const confirmed = await confirm({
        title: 'Delete User',
        message: 'Are you sure you want to delete this user? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        variant: 'danger'
      });
      console.log('Confirmation result:', confirmed);
      
      if (!confirmed) {
        console.log('User cancelled deletion');
        return;
      }

      console.log('Calling deleteUser API');
      await adminService.deleteUser(userId);
      console.log('User deleted successfully');
      
      setAllUsers(allUsers.filter((u) => u.id !== userId));
      setRecentUsers(recentUsers.filter((u) => u.id !== userId));
      toast.success('User deleted successfully');
    } catch (err) {
      console.error('Failed to delete user:', err);
      toast.error('Failed to delete user. Please try again.');
    }
  };

  const handleUserRoleChange = async (userId, newRole) => {
    // Prevent admin from changing their own role
    if (userId === user.id && isAdmin) {
      toast.warning('You cannot change your own admin role. Please ask another admin to do this.');
      return;
    }

    // Prevent changing the last admin to learner
    const currentAdminCount = allUsers.filter(u => u.role?.name === 'ADMIN').length;
    const targetUser = allUsers.find(u => u.id === userId);
    
    if (targetUser?.role?.name === 'ADMIN' && newRole !== 'ADMIN' && currentAdminCount <= 1) {
      toast.warning('Cannot change the last admin role. At least one admin must remain.');
      return;
    }

    try {
      const roleId = newRole === 'ADMIN' ? 1 : 2;
      await adminService.updateUserRole(userId, roleId);
      setAllUsers(allUsers.map((u) => 
        u.id === userId ? { ...u, role: { name: newRole } } : u
      ));
    } catch (err) {
      console.error('Failed to update user role:', err);
      toast.error('Failed to update user role. Please try again.');
    }
  };

  const handleEditUser = (userId) => {
    const targetUser = allUsers.find(u => u.id === userId);
    if (targetUser) {
      setEditingUser(targetUser);
      setEditFormData({
        firstName: targetUser.firstName,
        lastName: targetUser.lastName,
        email: targetUser.email,
      });
      setShowEditModal(true);
    }
  };

  const handleSaveUserEdit = async () => {
    try {
      await adminService.updateUser(editingUser.id, editFormData);
      setAllUsers(allUsers.map(u => 
        u.id === editingUser.id ? { ...u, ...editFormData } : u
      ));
      setShowEditModal(false);
      setEditingUser(null);
    } catch (err) {
      console.error('Failed to update user:', err);
      toast.error('Failed to update user. Please try again.');
    }
  };

  const handleExportUsers = () => {
    const csvContent = [
      ['ID', 'First Name', 'Last Name', 'Email', 'Role', 'Enrollments', 'Certificates', 'Created At'].join(','),
      ...filteredUsers.map(u => [
        u.id,
        u.firstName,
        u.lastName,
        u.email,
        u.role?.name || 'LEARNER',
        u._count?.enrollments || 0,
        u._count?.certificates || 0,
        new Date(u.createdAt).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredUsers = allUsers.filter((user) => {
    const searchTerm = appliedUserSearch.toLowerCase();
    const matchesSearch = 
      user.firstName?.toLowerCase().includes(searchTerm) ||
      user.lastName?.toLowerCase().includes(searchTerm) ||
      user.email?.toLowerCase().includes(searchTerm);
    
    const matchesRole = appliedRoleFilter ? user.role?.name === appliedRoleFilter : true;
    
    return matchesSearch && matchesRole;
  });

  const handleApplyUserFilter = () => {
    setAppliedUserSearch(userSearch);
    setAppliedRoleFilter(roleFilter);
    setShowFilterModal(false);
  };

  const handleResetUserFilter = () => {
    setUserSearch('');
    setRoleFilter('');
    setAppliedUserSearch('');
    setAppliedRoleFilter('');
    setShowFilterModal(false);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!newUser.firstName.trim() || !newUser.lastName.trim() || !newUser.email.trim() || !newUser.password.trim()) {
      toast.error('Validation failed: All required fields must be filled');
      return;
    }
    
    // Email validation (Learner: trusted providers, Admin: @learnova.com or trusted providers)
    const emailTrimmed = newUser.email.trim();
    const isLearner = newUser.role === 'LEARNER';
    const trustedLearnerRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.(com|fr)|hotmail\.(com|fr)|yahoo\.(com|fr)|icloud\.com)$/i;
    const trustedAdminRegex = /^[a-zA-Z0-9._%+-]+@(learnova\.com|gmail\.com|outlook\.(com|fr)|hotmail\.(com|fr)|yahoo\.(com|fr)|icloud\.com)$/i;
    const emailRegex = isLearner ? trustedLearnerRegex : trustedAdminRegex;

    if (!emailRegex.test(emailTrimmed)) {
      toast.error(
        isLearner
          ? 'Validation failed: Learners must use a trusted email provider (Gmail, Outlook, Hotmail, Yahoo, iCloud)'
          : 'Validation failed: Administrators must use an @learnova.com address or a trusted provider (Gmail, Outlook, Yahoo, iCloud)'
      );
      return;
    }
    
    // Password validation (min 8 characters)
    if (newUser.password.length < 8) {
      toast.error('Validation failed: Password must be at least 8 characters long');
      return;
    }
    
    try {
      setCreatingUser(true);
      const userData = {
        firstName: newUser.firstName.trim(),
        lastName: newUser.lastName.trim(),
        email: newUser.email.trim(),
        password: newUser.password,
        roleId: newUser.role === 'ADMIN' ? 1 : 2
      };
      
      const createdUser = await adminService.createUser(userData);
      setAllUsers([...allUsers, createdUser]);
      setRecentUsers([...recentUsers, createdUser]);
      setShowCreateUserModal(false);
      setNewUser({ firstName: '', lastName: '', email: '', password: '', role: 'LEARNER' });
      toast.success('User created successfully');
    } catch (err) {
      console.error('Failed to create user:', err);
      toast.error('Failed to create user. Please try again.');
    } finally {
      setCreatingUser(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    const confirmed = await confirm({
      title: 'Delete Course',
      message: 'Are you sure you want to delete this course? This will also delete all associated sessions, videos, and quizzes. This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger'
    });
    if (!confirmed) return;

    try {
      await adminService.deleteCourse(courseId);
      setCourses(courses.filter((c) => c.id !== courseId));
    } catch (err) {
      console.error('Failed to delete course:', err);
      toast.error('Failed to delete course. Please try again.');
    }
  };

  const handleSaveCourseEdit = async () => {
    // Validation
    if (!editCourseFormData.title.trim()) {
      toast.error('Validation failed: Course title is required');
      return;
    }
    if (!editCourseFormData.description.trim()) {
      toast.error('Validation failed: Course description is required');
      return;
    }
    
    try {
      await adminService.updateCourse(editingCourse.id, editCourseFormData);
      setCourses(courses.map(c => 
        c.id === editingCourse.id ? { ...c, ...editCourseFormData } : c
      ));
      setShowEditCourseModal(false);
      setEditingCourse(null);
      toast.success('Course updated successfully');
    } catch (err) {
      console.error('Failed to update course:', err);
      toast.error('Failed to update course. Please try again.');
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      if (!newCourse.file && !newCourse.thumbnail) {
        toast.warning('Validation failed: Please provide either a thumbnail file or thumbnail URL');
        return;
      }
      setUploadingThumbnail(true);
      let thumbnailUrl = newCourse.thumbnail;

      // Upload file if provided
      if (newCourse.file) {
        const uploadResult = await adminService.uploadThumbnail(newCourse.file);
        thumbnailUrl = uploadResult.url;
      }

      const courseData = {
        title: newCourse.title,
        description: newCourse.description,
        thumbnail: thumbnailUrl,
        creatorId: user.id,
      };
      const createdCourse = await adminService.createCourse(courseData);
      setCourses([...courses, createdCourse]);
      setShowCreateCourseModal(false);
      setNewCourse({ title: '', description: '', thumbnail: '', file: null });
    } catch (err) {
      console.error('Failed to create course:', err);
      toast.error('Failed to create course. Please try again.');
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const searchTerm = appliedCourseSearch.toLowerCase();
    const matchesSearch = course.title?.toLowerCase().includes(searchTerm);
    
    const sessionCount = course.sessions?.length || 0;
    const quizCount = course.quizzes?.length || 0;
    
    const matchesMinSessions = !appliedCourseFilterMinSessions || sessionCount >= parseInt(appliedCourseFilterMinSessions);
    const matchesMaxSessions = !appliedCourseFilterMaxSessions || sessionCount <= parseInt(appliedCourseFilterMaxSessions);
    const matchesMinQuizzes = !appliedCourseFilterMinQuizzes || quizCount >= parseInt(appliedCourseFilterMinQuizzes);
    const matchesMaxQuizzes = !appliedCourseFilterMaxQuizzes || quizCount <= parseInt(appliedCourseFilterMaxQuizzes);
    
    return matchesSearch && matchesMinSessions && matchesMaxSessions && matchesMinQuizzes && matchesMaxQuizzes;
  });

  const handleApplyCourseFilters = () => {
    setAppliedCourseSearch(courseSearch);
    setAppliedCourseFilterMinSessions(courseFilterMinSessions);
    setAppliedCourseFilterMaxSessions(courseFilterMaxSessions);
    setAppliedCourseFilterMinQuizzes(courseFilterMinQuizzes);
    setAppliedCourseFilterMaxQuizzes(courseFilterMaxQuizzes);
    setShowCourseFilterModal(false);
  };

  const handleResetCourseFilters = () => {
    setCourseSearch('');
    setCourseFilterMinSessions('');
    setCourseFilterMaxSessions('');
    setCourseFilterMinQuizzes('');
    setCourseFilterMaxQuizzes('');
    setAppliedCourseSearch('');
    setAppliedCourseFilterMinSessions('');
    setAppliedCourseFilterMaxSessions('');
    setAppliedCourseFilterMinQuizzes('');
    setAppliedCourseFilterMaxQuizzes('');
    setShowCourseFilterModal(false);
  };

  const handleDeleteSession = async (sessionId) => {
    const confirmed = await confirm({
      title: 'Delete Session',
      message: 'Are you sure you want to delete this session? This will also delete all associated videos. This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger'
    });
    if (!confirmed) return;

    try {
      await adminService.deleteSession(sessionId);
      setSessions(sessions.filter((s) => s.id !== sessionId));
    } catch (err) {
      console.error('Failed to delete session:', err);
      toast.error('Failed to delete session. Please try again.');
    }
  };

  const handleEditSession = (sessionId) => {
    const targetSession = sessions.find(s => s.id === sessionId);
    if (targetSession) {
      setEditingSession(targetSession);
      setEditSessionFormData({
        title: targetSession.title,
        description: targetSession.description || '',
        content: targetSession.content || '',
        courseId: targetSession.courseId || '',
        orderNumber: targetSession.orderNumber || '',
      });
      setShowEditSessionModal(true);
    }
  };

  const handleSaveSessionEdit = async () => {
    try {
      const sessionData = {
        ...editSessionFormData,
        orderNumber: parseInt(editSessionFormData.orderNumber),
        courseId: parseInt(editSessionFormData.courseId),
      };
      await adminService.updateSession(editingSession.id, sessionData);
      setSessions(sessions.map(s => 
        s.id === editingSession.id ? { ...s, ...sessionData } : s
      ));
      setShowEditSessionModal(false);
      setEditingSession(null);
    } catch (err) {
      console.error('Failed to update session:', err);
      toast.error('Failed to update session. Please try again.');
    }
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!newSession.title.trim()) {
      toast.error('Validation failed: Session title is required');
      return;
    }
    if (!newSession.description.trim()) {
      toast.error('Validation failed: Session description is required');
      return;
    }
    if (!newSession.courseId) {
      toast.error('Validation failed: Please select a course');
      return;
    }
    
    try {
      const sessionData = {
        ...newSession,
        orderNumber: parseInt(newSession.orderNumber),
        courseId: parseInt(newSession.courseId),
      };
      const createdSession = await adminService.createSession(sessionData);
      setSessions([...sessions, createdSession]);
      setShowCreateSessionModal(false);
      setNewSession({ title: '', description: '', content: '', courseId: '', orderNumber: '' });
      toast.success('Session created successfully');
    } catch (err) {
      console.error('Failed to create session:', err);
      toast.error('Failed to create session. Please try again.');
    }
  };

  const filteredSessions = sessions.filter((session) => {
    const searchTerm = appliedSessionSearch.toLowerCase();
    
    // Check if filtering by course
    if (searchTerm.startsWith('course:')) {
      const courseId = parseInt(searchTerm.split(':')[1]);
      return session.courseId === courseId;
    }
    
    return session.title?.toLowerCase().includes(searchTerm);
  });

  const handleApplySessionFilters = () => {
    setAppliedSessionSearch(sessionSearch);
    setShowSessionFilterModal(false);
  };

  const handleResetSessionFilters = () => {
    setSessionSearch('');
    setAppliedSessionSearch('');
    setSelectedCourseForSessionFilter('');
    setShowSessionFilterModal(false);
  };

  const handleDeleteVideo = async (videoId) => {
    const confirmed = await confirm({
      title: 'Delete Video',
      message: 'Are you sure you want to delete this video? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger'
    });
    if (!confirmed) return;

    try {
      await adminService.deleteVideo(videoId);
      setVideos(videos.filter((v) => v.id !== videoId));
    } catch (err) {
      console.error('Failed to delete video:', err);
      toast.error('Failed to delete video. Please try again.');
    }
  };

  const handleEditVideo = (videoId) => {
    const targetVideo = videos.find(v => v.id === videoId);
    if (targetVideo) {
      setEditingVideo(targetVideo);
      setEditVideoFormData({
        title: targetVideo.title,
        url: targetVideo.url || '',
        duration: formatDuration(targetVideo.duration),
        sessionId: targetVideo.sessionId || '',
        orderNumber: targetVideo.orderNumber || '',
      });
      setShowEditVideoModal(true);
    }
  };

  const handleSaveVideoEdit = async () => {
    // Validation
    if (!editVideoFormData.title.trim()) {
      toast.error('Validation failed: Video title is required');
      return;
    }
    if (!editVideoFormData.sessionId) {
      toast.error('Validation failed: Please select a session');
      return;
    }
    
    try {
      const videoData = {
        title: editVideoFormData.title,
        url: editVideoFormData.url,
        duration: editVideoFormData.duration ? parseDuration(editVideoFormData.duration) : null,
        orderNumber: parseInt(editVideoFormData.orderNumber),
        sessionId: parseInt(editVideoFormData.sessionId),
      };
      await adminService.updateVideo(editingVideo.id, videoData);
      setVideos(videos.map(v => 
        v.id === editingVideo.id ? { ...v, ...videoData } : v
      ));
      setShowEditVideoModal(false);
      setEditingVideo(null);
      toast.success('Video updated successfully');
    } catch (err) {
      console.error('Failed to update video:', err);
      toast.error('Failed to update video. Please try again.');
    }
  };

  const handleCreateVideo = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!newVideo.title.trim()) {
      toast.error('Validation failed: Video title is required');
      return;
    }
    if (!newVideo.file && !newVideo.url) {
      toast.warning('Validation failed: Please provide either a video file or video URL');
      return;
    }
    if (!newVideo.sessionId) {
      toast.error('Validation failed: Please select a session');
      return;
    }
    
    try {
      setUploadingVideo(true);
      let videoUrl = newVideo.url;

      // Upload file if provided
      if (newVideo.file) {
        const uploadResult = await adminService.uploadVideo(newVideo.file);
        videoUrl = uploadResult.url;
      }

      const videoData = {
        title: newVideo.title,
        url: videoUrl,
        duration: newVideo.duration ? parseDuration(newVideo.duration) : null,
        orderNumber: parseInt(newVideo.orderNumber),
        sessionId: parseInt(newVideo.sessionId),
      };
      const createdVideo = await adminService.createVideo(videoData);
      setVideos([...videos, createdVideo]);
      setShowCreateVideoModal(false);
      setNewVideo({ title: '', url: '', duration: '', sessionId: '', orderNumber: '', file: null });
      toast.success('Video created successfully');
    } catch (err) {
      console.error('Failed to create video:', err);
      toast.error('Failed to create video. Please try again.');
    } finally {
      setUploadingVideo(false);
    }
  };

  const filteredVideos = videos.filter((video) => {
    const searchTerm = appliedVideoSearch.toLowerCase();
    
    // Check if filtering by session
    if (searchTerm.startsWith('session:')) {
      const sessionId = parseInt(searchTerm.split(':')[1]);
      return video.sessionId === sessionId;
    }
    
    // Regular text search
    return video.title?.toLowerCase().includes(searchTerm);
  });

  const handleApplyVideoFilters = () => {
    setAppliedVideoSearch(videoSearch);
    setShowVideoFilterModal(false);
  };

  const handleResetVideoFilters = () => {
    setVideoSearch('');
    setAppliedVideoSearch('');
    setSelectedSessionForVideoFilter('');
    setShowVideoFilterModal(false);
  };

  const handleDeleteQuiz = async (quizId) => {
    const confirmed = await confirm({
      title: 'Delete Quiz',
      message: 'Are you sure you want to delete this quiz? This will also delete all associated questions. This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger'
    });
    if (!confirmed) return;

    try {
      await adminService.deleteQuiz(quizId);
      setQuizzes(quizzes.filter((q) => q.id !== quizId));
    } catch (err) {
      console.error('Failed to delete quiz:', err);
      toast.error('Failed to delete quiz. Please try again.');
    }
  };

  const handleEditQuiz = (quizId) => {
    const targetQuiz = quizzes.find(q => q.id === quizId);
    if (targetQuiz) {
      setEditingQuiz(targetQuiz);
      setEditQuizFormData({
        title: targetQuiz.title,
        description: targetQuiz.description || '',
        courseId: targetQuiz.courseId || '',
        isExamMode: targetQuiz.isExamMode || false,
        timeLimitMinutes: targetQuiz.timeLimitMinutes || '',
        passingScore: targetQuiz.passingScore || 70,
        maxAttempts: targetQuiz.maxAttempts || 3,
        randomizeQuestions: targetQuiz.randomizeQuestions ?? true,
        randomizeAnswers: targetQuiz.randomizeAnswers ?? true,
        allowReviewAfterSubmission: targetQuiz.allowReviewAfterSubmission ?? true,
        showExplanationAfterAnswer: targetQuiz.showExplanationAfterAnswer ?? true,
      });
      setShowEditQuizModal(true);
    }
  };

  const handleSaveQuizEdit = async () => {
    // Validation
    if (!editQuizFormData.title.trim()) {
      toast.error('Validation failed: Quiz title is required');
      return;
    }
    if (!editQuizFormData.courseId) {
      toast.error('Validation failed: Please select a course');
      return;
    }
    
    try {
      const quizData = {
        title: editQuizFormData.title,
        description: editQuizFormData.description,
        courseId: parseInt(editQuizFormData.courseId),
        timeLimitMinutes: editQuizFormData.timeLimitMinutes ? parseInt(editQuizFormData.timeLimitMinutes) : null,
        passingScore: parseFloat(editQuizFormData.passingScore),
        maxAttempts: parseInt(editQuizFormData.maxAttempts),
        isExamMode: editQuizFormData.isExamMode === 'true' || editQuizFormData.isExamMode === true,
        randomizeQuestions: editQuizFormData.randomizeQuestions === 'true' || editQuizFormData.randomizeQuestions === true,
        randomizeAnswers: editQuizFormData.randomizeAnswers === 'true' || editQuizFormData.randomizeAnswers === true,
        allowReviewAfterSubmission: editQuizFormData.allowReviewAfterSubmission === 'true' || editQuizFormData.allowReviewAfterSubmission === true,
        showExplanationAfterAnswer: editQuizFormData.showExplanationAfterAnswer === 'true' || editQuizFormData.showExplanationAfterAnswer === true,
      };
      const updatedQuiz = await adminService.updateQuiz(editingQuiz.id, quizData);
      setQuizzes(quizzes.map(q => 
        q.id === editingQuiz.id ? updatedQuiz : q
      ));
      setShowEditQuizModal(false);
      setEditingQuiz(null);
      toast.success('Quiz updated successfully');
    } catch (err) {
      console.error('Failed to update quiz:', err);
      toast.error('Failed to update quiz. Please try again.');
    }
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!newQuiz.title.trim()) {
      toast.error('Validation failed: Quiz title is required');
      return;
    }
    if (!newQuiz.courseId) {
      toast.error('Validation failed: Please select a course');
      return;
    }
    
    try {
      const quizData = {
        ...newQuiz,
        courseId: parseInt(newQuiz.courseId),
        timeLimitMinutes: newQuiz.timeLimitMinutes ? parseInt(newQuiz.timeLimitMinutes) : null,
        passingScore: parseFloat(newQuiz.passingScore),
        maxAttempts: parseInt(newQuiz.maxAttempts),
        isExamMode: newQuiz.isExamMode === 'true' || newQuiz.isExamMode === true,
        randomizeQuestions: newQuiz.randomizeQuestions === 'true' || newQuiz.randomizeQuestions === true,
        randomizeAnswers: newQuiz.randomizeAnswers === 'true' || newQuiz.randomizeAnswers === true,
        allowReviewAfterSubmission: newQuiz.allowReviewAfterSubmission === 'true' || newQuiz.allowReviewAfterSubmission === true,
        showExplanationAfterAnswer: newQuiz.showExplanationAfterAnswer === 'true' || newQuiz.showExplanationAfterAnswer === true,
        questions: [], // Questions can be added separately
      };
      const createdQuiz = await adminService.createQuiz(quizData);
      setQuizzes([...quizzes, createdQuiz]);
      setShowCreateQuizModal(false);
      setNewQuiz({ title: '', description: '', courseId: '', isExamMode: false, timeLimitMinutes: '', passingScore: 70, maxAttempts: 3, randomizeQuestions: true, randomizeAnswers: true, allowReviewAfterSubmission: true, showExplanationAfterAnswer: true });
      toast.success('Quiz created successfully');
    } catch (err) {
      console.error('Failed to create quiz:', err);
      toast.error('Failed to create quiz. Please try again.');
    }
  };

  const handleOpenQuestionsModal = async (quizId) => {
    console.log('Opening questions modal for quiz:', quizId);
    setSelectedQuizForQuestions(quizId);
    try {
      const questionsData = await adminService.getAllQuestions(quizId);
      console.log('Questions data received:', questionsData);
      // Sort by ID to maintain insertion order (first added = first displayed)
      const sortedQuestions = (questionsData || []).sort((a, b) => a.id - b.id);
      setQuestions(sortedQuestions);
      setShowQuestionsModal(true);
    } catch (err) {
      console.error('Failed to load questions:', err);
      toast.error('Failed to load questions. Please try again.');
    }
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    
    // Check for duplicate options
    const optionTexts = newQuestion.options.map(opt => opt.text.trim().toLowerCase());
    const uniqueOptions = new Set(optionTexts);
    
    if (uniqueOptions.size !== optionTexts.length) {
      toast.error('Validation failed: Each option must be unique. Please remove duplicate options.');
      return;
    }
    
    // Check if at least one option is marked as correct
    const hasCorrectOption = newQuestion.options.some(opt => opt.isCorrect);
    if (!hasCorrectOption) {
      toast.error('Validation failed: Please mark one option as correct.');
      return;
    }
    
    // Check if all options have text
    const emptyOptions = newQuestion.options.filter(opt => !opt.text.trim());
    if (emptyOptions.length > 0) {
      toast.error('Validation failed: All options must have text.');
      return;
    }
    
    try {
      const questionData = {
        text: newQuestion.text,
        quizId: selectedQuizForQuestions,
        options: newQuestion.options,
      };
      const createdQuestion = await adminService.createQuestion(questionData);
      setQuestions([...questions, createdQuestion]);
      setNewQuestion({ text: '', options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }] });
      // Refresh quizzes to update question count
      const updatedQuizzes = await adminService.getAllQuizzes();
      setQuizzes(updatedQuizzes);
    } catch (err) {
      console.error('Failed to create question:', err);
      toast.error('Failed to create question. Please try again.');
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    const confirmed = await confirm({
      title: 'Delete Question',
      message: 'Are you sure you want to delete this question? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger'
    });
    if (!confirmed) return;
    try {
      await adminService.deleteQuestion(questionId);
      setQuestions(questions.filter(q => q.id !== questionId));
      // Refresh quizzes to update question count
      const updatedQuizzes = await adminService.getAllQuizzes();
      setQuizzes(updatedQuizzes);
    } catch (err) {
      console.error('Failed to delete question:', err);
      toast.error('Failed to delete question. Please try again.');
    }
  };

  const handleOptionChange = (index, field, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index][field] = value;
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  // Unified Course Builder Handlers
  const handleStartCourseBuilder = () => {
    setShowCourseBuilder(true);
    setBuilderStep(1);
    setBuilderCourse({ title: '', description: '', thumbnail: '', file: null });
    setBuilderSessions([]);
    setBuilderVideos([]);
    setBuilderQuiz({ title: '', description: '', isExamMode: false, timeLimitMinutes: '', passingScore: 70, maxAttempts: 3, randomizeQuestions: true, randomizeAnswers: true, allowReviewAfterSubmission: true, showExplanationAfterAnswer: true });
    setBuilderQuestions([]);
    setBuilderCurrentQuestion({ text: '', options: [{ text: '', isCorrect: false, explanation: '' }, { text: '', isCorrect: false, explanation: '' }, { text: '', isCorrect: false, explanation: '' }, { text: '', isCorrect: false, explanation: '' }] });
    setShowBuilderAddQuestionForm(false);
  };

  const handleBuilderNext = () => {
    const errors = validateStep(builderStep);
    if (Object.keys(errors).length === 0) {
      setBuilderStep(prev => prev + 1);
      setValidationErrors({});
    } else {
      setValidationErrors(errors);
      const errorMessages = Object.values(errors).join(', ');
      toast.error(`Validation failed: ${errorMessages}`);
    }
  };

  const handleBuilderBack = () => {
    setBuilderStep(prev => prev - 1);
  };

  const handleBuilderCancel = () => {
    confirm({
      title: 'Cancel Course Builder',
      message: 'Are you sure you want to cancel? All progress will be lost.',
      confirmText: 'Cancel & Discard',
      cancelText: 'Continue Building',
      variant: 'warning'
    }).then((confirmed) => {
      if (confirmed) {
        setShowCourseBuilder(false);
        setBuilderStep(1);
        // Clear all builder data
        setBuilderCourse({ title: '', description: '', thumbnail: '', file: null });
        setBuilderSessions([]);
        setBuilderVideos([]);
        setBuilderQuiz({ title: '', description: '', isExamMode: false, timeLimitMinutes: '', passingScore: 70, maxAttempts: 3, randomizeQuestions: true, randomizeAnswers: true, allowReviewAfterSubmission: true, showExplanationAfterAnswer: true });
        setBuilderQuestions([]);
        setBuilderCurrentQuestion({ text: '', options: [{ text: '', isCorrect: false, explanation: '' }, { text: '', isCorrect: false, explanation: '' }, { text: '', isCorrect: false, explanation: '' }, { text: '', isCorrect: false, explanation: '' }] });
        setShowBuilderAddQuestionForm(false);
        setValidationErrors({});
        localStorage.removeItem('courseBuilderProgress');
      }
    });
  };

  const handleAddQuestion = () => {
    if (!builderCurrentQuestion.text.trim()) {
      toast.error('Validation failed: Question text is required');
      return;
    }

    const validOptions = builderCurrentQuestion.options.filter(opt => opt.text.trim());
    if (validOptions.length < 2) {
      toast.error('Validation failed: At least 2 options are required');
      return;
    }

    const hasCorrectOption = validOptions.some(opt => opt.isCorrect);
    if (!hasCorrectOption) {
      toast.error('Validation failed: At least one option must be marked as correct');
      return;
    }

    if (editingBuilderQuestionId) {
      // Update existing question
      setBuilderQuestions(builderQuestions.map(q => 
        q.id === editingBuilderQuestionId 
          ? {
              ...q,
              text: builderCurrentQuestion.text,
              options: builderCurrentQuestion.options.map(opt => ({
                text: opt.text,
                isCorrect: opt.isCorrect,
                explanation: opt.explanation
              }))
            }
          : q
      ));
      toast.success('Question updated successfully');
    } else {
      // Add new question
      const newQuestion = {
        id: Date.now(),
        text: builderCurrentQuestion.text,
        options: builderCurrentQuestion.options.map(opt => ({
          text: opt.text,
          isCorrect: opt.isCorrect,
          explanation: opt.explanation
        }))
      };
      setBuilderQuestions([...builderQuestions, newQuestion]);
      toast.success('Question added successfully');
    }

    setBuilderCurrentQuestion({ text: '', options: [{ text: '', isCorrect: false, explanation: '' }, { text: '', isCorrect: false, explanation: '' }, { text: '', isCorrect: false, explanation: '' }, { text: '', isCorrect: false, explanation: '' }] });
    setShowBuilderAddQuestionForm(false);
    setEditingBuilderQuestionId(null);
  };

  const handleBuilderDeleteQuestion = (questionId) => {
    confirm({
      title: 'Delete Question',
      message: 'Are you sure you want to delete this question?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger'
    }).then((confirmed) => {
      if (confirmed) {
        setBuilderQuestions(builderQuestions.filter(q => q.id !== questionId));
        toast.success('Question deleted');
      }
    });
  };

  const handleBuilderEditQuestion = (questionId) => {
    const question = builderQuestions.find(q => q.id === questionId);
    if (question) {
      setBuilderCurrentQuestion({
        text: question.text,
        options: question.options.map(opt => ({
          text: opt.text,
          isCorrect: opt.isCorrect,
          explanation: opt.explanation || ''
        }))
      });
      setEditingBuilderQuestionId(questionId);
      setShowBuilderAddQuestionForm(true);
    }
  };

  const handleBuilderOptionChange = (optionIndex, field, value) => {
    const newOptions = [...builderCurrentQuestion.options];
    newOptions[optionIndex][field] = value;
    
    // If setting isCorrect to true, set all others to false (single correct answer)
    if (field === 'isCorrect' && value === true) {
      newOptions.forEach((opt, idx) => {
        if (idx !== optionIndex) {
          opt.isCorrect = false;
        }
      });
    }
    
    setBuilderCurrentQuestion({ ...builderCurrentQuestion, options: newOptions });
  };

  const handleBuilderCloseDirect = () => {
    setShowCourseBuilder(false);
    setBuilderStep(1);
    // Clear all builder data
    setBuilderCourse({ title: '', description: '', thumbnail: '', file: null });
    setBuilderSessions([]);
    setBuilderVideos([]);
    setBuilderQuiz({ title: '', description: '', isExamMode: false, timeLimitMinutes: '', passingScore: 70, maxAttempts: 3, randomizeQuestions: true, randomizeAnswers: true, allowReviewAfterSubmission: true, showExplanationAfterAnswer: true });
    setValidationErrors({});
    localStorage.removeItem('courseBuilderProgress');
  };

  const handleAddSession = () => {
    if (builderCurrentSession.title) {
      setBuilderSessions([...builderSessions, { ...builderCurrentSession, id: Date.now() }]);
      setBuilderCurrentSession({ title: '', description: '', content: '', orderNumber: builderSessions.length + 2 });
    }
  };

  const handleAddVideo = () => {
    if (builderCurrentVideo.title) {
      setBuilderVideos([...builderVideos, { ...builderCurrentVideo, id: Date.now() }]);
      setBuilderCurrentVideo({ title: '', url: '', duration: '', orderNumber: builderVideos.length + 1, file: null });
    }
  };

  const handleBuilderEditSession = (sessionId) => {
    const session = builderSessions.find(s => s.id === sessionId);
    if (session) {
      setEditingSessionId(sessionId);
      setBuilderCurrentSession({ ...session });
    }
  };

  const handleBuilderSaveSessionEdit = () => {
    if (editingSessionId && builderCurrentSession.title) {
      setBuilderSessions(builderSessions.map(s => 
        s.id === editingSessionId ? { ...builderCurrentSession } : s
      ));
      setEditingSessionId(null);
      setBuilderCurrentSession({ title: '', description: '', content: '', orderNumber: builderSessions.length + 1 });
    }
  };

  const handleBuilderCancelSessionEdit = () => {
    setEditingSessionId(null);
    setBuilderCurrentSession({ title: '', description: '', content: '', orderNumber: builderSessions.length + 1 });
  };

  const handleBuilderEditVideo = (videoId) => {
    const video = builderVideos.find(v => v.id === videoId);
    if (video) {
      setEditingVideoId(videoId);
      setBuilderCurrentVideo({ ...video });
    }
  };

  const handleBuilderSaveVideoEdit = () => {
    if (editingVideoId && builderCurrentVideo.title) {
      setBuilderVideos(builderVideos.map(v => 
        v.id === editingVideoId ? { ...builderCurrentVideo } : v
      ));
      setEditingVideoId(null);
      setBuilderCurrentVideo({ title: '', url: '', duration: '', orderNumber: builderVideos.length + 1, file: null });
    }
  };

  const handleBuilderCancelVideoEdit = () => {
    setEditingVideoId(null);
    setBuilderCurrentVideo({ title: '', url: '', duration: '', orderNumber: builderVideos.length + 1, file: null });
  };

  const handleMoveSession = (sessionId, direction) => {
    const index = builderSessions.findIndex(s => s.id === sessionId);
    if (index < 0) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= builderSessions.length) return;
    
    const newSessions = [...builderSessions];
    [newSessions[index], newSessions[newIndex]] = [newSessions[newIndex], newSessions[index]];
    
    // Update order numbers
    newSessions.forEach((session, idx) => {
      session.orderNumber = idx + 1;
    });
    
    setBuilderSessions(newSessions);
  };

  const handleMoveVideo = (videoId, direction) => {
    const index = builderVideos.findIndex(v => v.id === videoId);
    if (index < 0) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= builderVideos.length) return;
    
    const newVideos = [...builderVideos];
    [newVideos[index], newVideos[newIndex]] = [newVideos[newIndex], newVideos[index]];
    
    // Update order numbers
    newVideos.forEach((video, idx) => {
      video.orderNumber = idx + 1;
    });
    
    setBuilderVideos(newVideos);
  };

  // Course Detail View Handlers
  const handleViewCourse = async (course) => {
    setSelectedCourse(course);
    setShowCourseDetail(true);
    
    try {
      // Load sessions for this course
      const allSessions = await adminService.getAllSessions();
      const courseSessionsData = allSessions.filter(s => s.courseId === course.id);
      setCourseSessions(courseSessionsData);
      
      // Load videos for these sessions
      const allVideos = await adminService.getAllVideos();
      const sessionIds = courseSessionsData.map(s => s.id);
      const courseVideosData = allVideos.filter(v => sessionIds.includes(v.sessionId));
      setCourseVideos(courseVideosData);
      
      // Load quizzes for this course
      const allQuizzes = await adminService.getAllQuizzes();
      const courseQuizzesData = allQuizzes.filter(q => q.courseId === course.id);
      setCourseQuizzes(courseQuizzesData);
    } catch (err) {
      console.error('Failed to load course details:', err);
      toast.error('Failed to load course details');
    }
  };

  const handleCloseCourseDetail = () => {
    setShowCourseDetail(false);
    setSelectedCourse(null);
    setCourseSessions([]);
    setCourseVideos([]);
    setCourseQuizzes([]);
  };

  const handleBuilderSubmit = async () => {
    // Check if user is authenticated
    if (!user || !user.id) {
      toast.error('You must be logged in to create a course');
      return;
    }
    
    // Clear previous errors
    setValidationErrors({});
    
    // Validate all data
    const errors = {};
    if (!builderCourse.title.trim()) {
      errors.title = 'Course title is required';
    }
    if (!builderCourse.description.trim()) {
      errors.description = 'Course description is required';
    }
    if (builderSessions.length === 0) {
      errors.sessions = 'At least one session is required';
    }
    if (builderVideos.length === 0) {
      errors.videos = 'At least one video is required';
    }
    if (!builderQuiz.title.trim()) {
      errors.quizTitle = 'Quiz title is required';
    }
    
    // Validate questions based on mode
    const minQuestions = builderQuiz.isExamMode ? 10 : 3;
    if (builderQuestions.length < minQuestions) {
      errors.questions = builderQuiz.isExamMode 
        ? `Exam mode requires at least ${minQuestions} questions (recommended: 20-30)`
        : `Practice mode requires at least ${minQuestions} questions`;
    }
    
    // Validate video URLs
    builderVideos.forEach((video, index) => {
      if (!validateUrl(video.url)) {
        errors[`video_${index}_url`] = `Invalid URL for video "${video.title}"`;
      }
    });
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      const errorMessages = Object.values(errors).join(', ');
      toast.error(`Validation failed: ${errorMessages}`);
      return;
    }
    
    try {
      // Create Course
      const courseData = {
        title: builderCourse.title,
        description: builderCourse.description,
        level: builderCourse.level || 'BEGINNER',
        domain: builderCourse.domain || 'IT_DATA',
        isPaid: builderCourse.isPaid || false,
        price: builderCourse.price || 0,
        recommended: builderCourse.recommended || false,
        thumbnail: builderCourse.thumbnail || null,
        creatorId: user.id,
      };
      console.log('Creating course with data:', courseData);
      const createdCourse = await adminService.createCourse(courseData);
      console.log('Course created successfully:', createdCourse);
      
      // Create Sessions
      const sessionMapping = {}; // Map temporary session IDs to real session IDs
      for (const session of builderSessions) {
        const sessionData = {
          title: session.title,
          description: session.description,
          content: session.content,
          courseId: createdCourse.id,
          orderNumber: session.orderNumber,
        };
        console.log('Creating session:', sessionData);
        const createdSession = await adminService.createSession(sessionData);
        console.log('Session created:', createdSession);
        
        // Store the mapping between temporary ID and real ID
        sessionMapping[session.id] = createdSession.id;
      }
      
      // Create Videos for all sessions using the mapping
      for (const video of builderVideos) {
        const realSessionId = sessionMapping[video.sessionId];
        if (!realSessionId) {
          console.error('Session not found for video:', video);
          continue;
        }
        
        const durationSeconds = parseDuration(video.duration);
        const videoData = {
          title: video.title,
          url: video.url,
          duration: durationSeconds || 0,
          sessionId: realSessionId,
          orderNumber: video.orderNumber,
        };
        console.log('Creating video:', videoData);
        await adminService.createVideo(videoData);
        console.log('Video created');
      }
      
      // Create Quiz
      if (builderQuiz.title) {
        const quizData = {
          ...builderQuiz,
          courseId: createdCourse.id,
          timeLimitMinutes: builderQuiz.timeLimitMinutes ? parseInt(builderQuiz.timeLimitMinutes) : null,
          passingScore: parseFloat(builderQuiz.passingScore),
          maxAttempts: parseInt(builderQuiz.maxAttempts),
          isExamMode: builderQuiz.isExamMode === 'true' || builderQuiz.isExamMode === true,
          randomizeQuestions: builderQuiz.randomizeQuestions === 'true' || builderQuiz.randomizeQuestions === true,
          randomizeAnswers: builderQuiz.randomizeAnswers === 'true' || builderQuiz.randomizeAnswers === true,
          allowReviewAfterSubmission: builderQuiz.allowReviewAfterSubmission === 'true' || builderQuiz.allowReviewAfterSubmission === true,
          showExplanationAfterAnswer: builderQuiz.showExplanationAfterAnswer === 'true' || builderQuiz.showExplanationAfterAnswer === true,
          questions: builderQuestions.map(q => ({
            text: q.text,
            options: q.options
          })),
        };
        console.log('Creating quiz:', quizData);
        await adminService.createQuiz(quizData);
        console.log('Quiz created');
      }
      
      // Refresh data
      const updatedCourses = await adminService.getAllCourses();
      setCourses(updatedCourses);
      
      const updatedSessions = await adminService.getAllSessions();
      setSessions(updatedSessions);
      
      const updatedVideos = await adminService.getAllVideos();
      setVideos(updatedVideos);
      
      const updatedQuizzes = await adminService.getAllQuizzes();
      setQuizzes(updatedQuizzes);
      
      // Clear saved progress
      localStorage.removeItem('courseBuilderProgress');
      
      // Reset builder state
      setShowCourseBuilder(false);
      setBuilderStep(1);
      setBuilderCourse({ title: '', description: '', thumbnail: '', file: null });
      setBuilderSessions([]);
      setBuilderVideos([]);
      setBuilderQuiz({ title: '', description: '', isExamMode: false, timeLimitMinutes: '', passingScore: 70, maxAttempts: 3, randomizeQuestions: true, randomizeAnswers: true, allowReviewAfterSubmission: true, showExplanationAfterAnswer: true });
      setValidationErrors({});
      
      toast.success('Course created successfully!');
    } catch (err) {
      console.error('Failed to create course:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create course. Please try again.';
      toast.error(`Error: ${errorMessage}`);
    }
  };

  const filteredQuizzes = quizzes.filter((quiz) => {
    const searchTerm = appliedQuizSearch.toLowerCase();
    
    let filterMode = null;
    let filterCourseId = null;
    
    // Parse combined filters (e.g., "mode:exam,course:1")
    const filters = searchTerm.split(',');
    
    filters.forEach(filter => {
      if (filter.startsWith('mode:')) {
        filterMode = filter.split(':')[1];
      }
      if (filter.startsWith('course:')) {
        filterCourseId = parseInt(filter.split(':')[1]);
      }
    });
    
    // Apply mode filter
    if (filterMode === 'exam' && !quiz.isExamMode) return false;
    if (filterMode === 'practice' && quiz.isExamMode) return false;
    
    // Apply course filter
    if (filterCourseId && quiz.courseId !== filterCourseId) return false;
    
    // Regular text search (only if no specific filters)
    if (!filterMode && !filterCourseId) {
      return quiz.title?.toLowerCase().includes(searchTerm);
    }
    
    return true;
  });

  const handleApplyQuizFilters = () => {
    setAppliedQuizSearch(quizSearch);
    setShowQuizFilterModal(false);
  };

  const handleResetQuizFilters = () => {
    setQuizSearch('');
    setAppliedQuizSearch('');
    setSelectedModeForQuizFilter('');
    setSelectedCourseForQuizFilter('');
    setShowQuizFilterModal(false);
  };

  const handleDeleteCertificate = async (certificateId) => {
    const confirmed = await confirm({
      title: 'Delete Certificate',
      message: 'Are you sure you want to delete this certificate? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger'
    });
    if (!confirmed) return;

    try {
      await adminService.deleteCertificate(certificateId);
      setCertificates(certificates.filter((c) => c.id !== certificateId));
    } catch (err) {
      console.error('Failed to delete certificate:', err);
      toast.error('Failed to delete certificate');
    }
  };

  const handleEditCertificate = (certificateId) => {
    const targetCertificate = certificates.find(c => c.id === certificateId);
    if (targetCertificate) {
      setEditingCertificate(targetCertificate);
      setEditCertificateFormData({
        userId: targetCertificate.userId || '',
        courseId: targetCertificate.courseId || '',
      });
      setShowEditCertificateModal(true);
    }
  };

  const handleSaveCertificateEdit = async () => {
    try {
      const certificateData = {
        userId: parseInt(editCertificateFormData.userId),
        courseId: parseInt(editCertificateFormData.courseId),
      };
      await adminService.updateCertificate(editingCertificate.id, certificateData);
      setCertificates(certificates.map(c => 
        c.id === editingCertificate.id ? { ...c, ...certificateData } : c
      ));
      setShowEditCertificateModal(false);
      setEditingCertificate(null);
    } catch (err) {
      console.error('Failed to update certificate:', err);
      toast.error('Failed to update certificate');
    }
  };

  const filteredCertificates = certificates.filter((certificate) => {
    const searchTerm = certificateSearch.toLowerCase();
    
    // Check if filtering by course
    if (searchTerm.startsWith('course:')) {
      const courseId = parseInt(searchTerm.split(':')[1]);
      return certificate.courseId === courseId;
    }
    
    // Regular text search
    return (
      certificate.certificateNumber?.toLowerCase().includes(searchTerm) ||
      certificate.course?.title?.toLowerCase().includes(searchTerm)
    );
  });

  if (!isAdmin) {
    return (
      <div className="admin-error">
        <h2>Access Denied</h2>
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <span>Loading admin dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error">
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="admin-overview">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon users">
            <Users size={32} />
          </div>
          <div className="stat-info">
            <h3>{stats.totalUsers > 0 ? stats.totalUsers : '—'}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon courses">
            <BookOpen size={32} />
          </div>
          <div className="stat-info">
            <h3>{stats.totalCourses > 0 ? stats.totalCourses : '—'}</h3>
            <p>Total Courses</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon quizzes">
            <FileText size={32} />
          </div>
          <div className="stat-info">
            <h3>{stats.totalQuizzes > 0 ? stats.totalQuizzes : '—'}</h3>
            <p>Total Quizzes</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon certificates">
            <Award size={32} />
          </div>
          <div className="stat-info">
            <h3>{stats.totalCertificates > 0 ? stats.totalCertificates : '—'}</h3>
            <p>Certificates Issued</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon active">
            <Activity size={32} />
          </div>
          <div className="stat-info">
            <h3>{stats.activeUsers > 0 ? stats.activeUsers : '—'}</h3>
            <p>Active Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon revenue">
            <TrendingUp size={32} />
          </div>
          <div className="stat-info">
            <h3>{stats.revenue > 0 ? `$${stats.revenue.toLocaleString()}` : '—'}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          {recentActivity.length === 0 ? (
            <div className="activity-empty">
              <p>No recent activity</p>
            </div>
          ) : (
            recentActivity.map((activity) => (
              <div key={`${activity.type}-${activity.id}`} className="activity-item">
                <div className="activity-icon">
                  {activity.type === 'user' && <Users size={20} />}
                  {activity.type === 'course' && <BookOpen size={20} />}
                  {activity.type === 'certificate' && <Award size={20} />}
                  {activity.type === 'enrollment' && <FileText size={20} />}
                </div>
                <div className="activity-content">
                  <p>{activity.message}</p>
                  <span className="activity-time">
                    {formatTimeAgo(activity.timestamp)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return time.toLocaleDateString();
  };

  const renderUsers = () => (
    <div className="admin-users">
      <div className="section-header">
        <h2>User Management</h2>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={() => setShowFilterModal(true)}>
            <Filter size={18} />
            Filter
          </button>
          <button className="btn btn-secondary" onClick={handleExportUsers}>
            <Download size={18} />
            Export
          </button>
          <button className="btn btn-primary" onClick={() => {
            setNewUser({ firstName: '', lastName: '', email: '', password: '', role: 'LEARNER' });
            setShowCreateUserModal(true);
          }}>
            <Plus size={18} />
            Create User
          </button>
        </div>
      </div>

      <div className="search-bar">
        <Search size={20} className="search-icon" />
        <input 
          type="text" 
          placeholder="Search users..." 
          className="search-input"
          value={appliedUserSearch}
          onChange={(e) => setAppliedUserSearch(e.target.value)}
        />
      </div>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Courses</th>
              <th>Certificates</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{`${user.firstName} ${user.lastName}`}</td>
                <td>{user.email}</td>
                <td>
                  <select
                    className={`badge ${user.role?.name?.toLowerCase() || 'learner'}`}
                    value={user.role?.name || 'LEARNER'}
                    onChange={(e) => handleUserRoleChange(user.id, e.target.value)}
                  >
                    <option value="LEARNER">LEARNER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td>{user._count?.enrollments ? user._count.enrollments : '—'}</td>
                <td>{user._count?.certificates ? user._count.certificates : '—'}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" title="Edit" onClick={() => handleEditUser(user.id)}>
                      <Edit size={18} />
                    </button>
                    <button 
                      className="btn-icon danger" 
                      title="Delete"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Delete button clicked for user:', user.id);
                        handleDeleteUser(user.id);
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCertificates = () => (
    <div className="admin-certificates">
      <div className="section-header">
        <h2>Certificate Management</h2>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={() => setShowCertificateFilterModal(true)}>
            <Filter size={18} />
            Filter
          </button>
          <button className="btn btn-secondary">
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      <div className="search-bar">
        <Search size={20} className="search-icon" />
        <input 
          type="text" 
          placeholder="Search certificates..." 
          className="search-input"
          value={certificateSearch}
          onChange={(e) => setCertificateSearch(e.target.value)}
        />
      </div>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Certificate Number</th>
              <th>Student</th>
              <th>Course</th>
              <th>Issued Date</th>
              <th>QR Code</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCertificates.map((certificate) => (
              <tr key={certificate.id}>
                <td>{certificate.certificateNumber}</td>
                <td>{certificate.user ? `${certificate.user.firstName} ${certificate.user.lastName}` : 'Unknown'}</td>
                <td>{certificate.course?.title || 'Unknown'}</td>
                <td>{new Date(certificate.issuedAt).toLocaleDateString()}</td>
                <td>
                  <span className="badge success">Valid</span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" title="Edit" onClick={() => handleEditCertificate(certificate.id)}>
                      <Edit size={18} />
                    </button>
                    <button 
                      className="btn-icon danger" 
                      title="Delete"
                      onClick={() => handleDeleteCertificate(certificate.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderQuizzes = () => (
    <div className="admin-quizzes">
      <div className="section-header">
        <h2>Quiz Management</h2>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={() => setShowQuizFilterModal(true)}>
            <Filter size={18} />
            Filter
          </button>
          <button className="btn btn-secondary" onClick={() => setShowCreateQuizModal(true)}>
            <Plus size={18} />
            Create Quiz
          </button>
          <button className="btn btn-primary" onClick={() => setActiveTab('ai-quiz-studio')}>
            <Sparkles size={18} />
            Generate with AI
          </button>
        </div>
      </div>

      <div className="search-bar">
        <Search size={20} className="search-icon" />
        <input 
          type="text" 
          placeholder="Search quizzes..." 
          className="search-input"
          value={quizSearch}
          onChange={(e) => setQuizSearch(e.target.value)}
        />
      </div>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Course</th>
              <th>Mode</th>
              <th>Time Limit</th>
              <th>Passing Score</th>
              <th>Questions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuizzes.map((quiz) => (
              <tr key={quiz.id}>
                <td>{quiz.title}</td>
                <td>{quiz.course?.title || 'Unknown'}</td>
                <td>
                  <span className={`badge ${quiz.isExamMode ? 'exam' : 'practice'}`}>
                    {quiz.isExamMode ? 'Exam' : 'Practice'}
                  </span>
                </td>
                <td>{quiz.timeLimitMinutes ? `${quiz.timeLimitMinutes} min` : 'No limit'}</td>
                <td>{quiz.passingScore}%</td>
                <td>{quiz.questions?.length || 0}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" title="Questions" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleOpenQuestionsModal(quiz.id); }}>
                      <HelpCircle size={18} />
                    </button>
                    <button className="btn-icon" title="Edit" onClick={() => handleEditQuiz(quiz.id)}>
                      <Edit size={18} />
                    </button>
                    <button 
                      className="btn-icon danger" 
                      title="Delete"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteQuiz(quiz.id);
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCreateQuizModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create New Quiz</h3>
              <button 
                className="btn-icon"
                onClick={() => setShowCreateQuizModal(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateQuiz}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={newQuiz.title}
                  onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newQuiz.description}
                  onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Course *</label>
                <select
                  value={newQuiz.courseId}
                  onChange={(e) => setNewQuiz({ ...newQuiz, courseId: e.target.value })}
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Exam Mode</label>
                <div 
                  className="toggle-switch"
                  onClick={() => setNewQuiz({ ...newQuiz, isExamMode: !newQuiz.isExamMode })}
                >
                  <input
                    type="checkbox"
                    checked={newQuiz.isExamMode}
                    onChange={(e) => setNewQuiz({ ...newQuiz, isExamMode: e.target.checked })}
                    className="toggle-input"
                  />
                  <span className="toggle-slider"></span>
                </div>
              </div>
              <div className="form-group">
                <label>Time Limit (minutes, optional)</label>
                <input
                  type="number"
                  value={newQuiz.timeLimitMinutes}
                  onChange={(e) => setNewQuiz({ ...newQuiz, timeLimitMinutes: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Passing Score (%)</label>
                <input
                  type="number"
                  value={newQuiz.passingScore}
                  onChange={(e) => setNewQuiz({ ...newQuiz, passingScore: e.target.value })}
                  min="0"
                  max="100"
                />
              </div>
              <div className="form-group">
                <label>Max Attempts</label>
                <input
                  type="number"
                  value={newQuiz.maxAttempts}
                  onChange={(e) => setNewQuiz({ ...newQuiz, maxAttempts: e.target.value })}
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>Randomize Questions</label>
                <select
                  value={newQuiz.randomizeQuestions ? 'true' : 'false'}
                  onChange={(e) => setNewQuiz({ ...newQuiz, randomizeQuestions: e.target.value === 'true' })}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div className="form-group">
                <label>Randomize Answers</label>
                <select
                  value={newQuiz.randomizeAnswers ? 'true' : 'false'}
                  onChange={(e) => setNewQuiz({ ...newQuiz, randomizeAnswers: e.target.value === 'true' })}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div className="form-group">
                <label>Allow Review After Submission</label>
                <select
                  value={newQuiz.allowReviewAfterSubmission ? 'true' : 'false'}
                  onChange={(e) => setNewQuiz({ ...newQuiz, allowReviewAfterSubmission: e.target.value === 'true' })}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div className="form-group">
                <label>Show Explanation After Answer</label>
                <select
                  value={newQuiz.showExplanationAfterAnswer ? 'true' : 'false'}
                  onChange={(e) => setNewQuiz({ ...newQuiz, showExplanationAfterAnswer: e.target.value === 'true' })}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowCreateQuizModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Quiz
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Quiz Modal */}
      {showEditQuizModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Quiz</h3>
            <form>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={editQuizFormData.title}
                  onChange={(e) => setEditQuizFormData({ ...editQuizFormData, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={editQuizFormData.description}
                  onChange={(e) => setEditQuizFormData({ ...editQuizFormData, description: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Course *</label>
                <select
                  value={editQuizFormData.courseId}
                  onChange={(e) => setEditQuizFormData({ ...editQuizFormData, courseId: e.target.value })}
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Mode</label>
                <select
                  value={editQuizFormData.isExamMode ? 'true' : 'false'}
                  onChange={(e) => setEditQuizFormData({ ...editQuizFormData, isExamMode: e.target.value === 'true' })}
                >
                  <option value="false">Practice</option>
                  <option value="true">Exam</option>
                </select>
              </div>
              <div className="form-group">
                <label>Time Limit (minutes)</label>
                <input
                  type="number"
                  value={editQuizFormData.timeLimitMinutes}
                  onChange={(e) => setEditQuizFormData({ ...editQuizFormData, timeLimitMinutes: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Passing Score (%)</label>
                <input
                  type="number"
                  value={editQuizFormData.passingScore}
                  onChange={(e) => setEditQuizFormData({ ...editQuizFormData, passingScore: e.target.value })}
                  min="0"
                  max="100"
                />
              </div>
              <div className="form-group">
                <label>Max Attempts</label>
                <input
                  type="number"
                  value={editQuizFormData.maxAttempts}
                  onChange={(e) => setEditQuizFormData({ ...editQuizFormData, maxAttempts: e.target.value })}
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>Randomize Questions</label>
                <select
                  value={editQuizFormData.randomizeQuestions ? 'true' : 'false'}
                  onChange={(e) => setEditQuizFormData({ ...editQuizFormData, randomizeQuestions: e.target.value === 'true' })}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div className="form-group">
                <label>Randomize Answers</label>
                <select
                  value={editQuizFormData.randomizeAnswers ? 'true' : 'false'}
                  onChange={(e) => setEditQuizFormData({ ...editQuizFormData, randomizeAnswers: e.target.value === 'true' })}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div className="form-group">
                <label>Allow Review After Submission</label>
                <select
                  value={editQuizFormData.allowReviewAfterSubmission ? 'true' : 'false'}
                  onChange={(e) => setEditQuizFormData({ ...editQuizFormData, allowReviewAfterSubmission: e.target.value === 'true' })}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div className="form-group">
                <label>Show Explanation After Answer</label>
                <select
                  value={editQuizFormData.showExplanationAfterAnswer ? 'true' : 'false'}
                  onChange={(e) => setEditQuizFormData({ ...editQuizFormData, showExplanationAfterAnswer: e.target.value === 'true' })}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditQuizModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSaveQuizEdit}>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderVideos = () => (
    <div className="admin-videos">
      <div className="section-header">
        <h2>Video Management</h2>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={() => setShowVideoFilterModal(true)}>
            <Filter size={18} />
            Filter
          </button>
          <button className="btn btn-primary" onClick={() => setShowCreateVideoModal(true)}>
            <Plus size={18} />
            Add Video
          </button>
        </div>
      </div>

      <div className="search-bar">
        <Search size={20} className="search-icon" />
        <input 
          type="text" 
          placeholder="Search videos..." 
          className="search-input"
          value={videoSearch}
          onChange={(e) => setVideoSearch(e.target.value)}
        />
      </div>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Session</th>
              <th>Duration</th>
              <th>Order</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVideos.map((video) => (
              <tr key={video.id}>
                <td>{video.title}</td>
                <td>{video.session?.title || 'Unknown'}</td>
                <td>{formatDuration(video.duration)}</td>
                <td>{video.orderNumber}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" title="Edit" onClick={() => handleEditVideo(video.id)}>
                      <Edit size={18} />
                    </button>
                    <button 
                      className="btn-icon danger" 
                      title="Delete"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteVideo(video.id);
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCreateVideoModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create New Video</h3>
              <button 
                className="btn-icon"
                onClick={() => setShowCreateVideoModal(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateVideo}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={newVideo.title}
                  onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Upload Video File</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setNewVideo({ ...newVideo, file: e.target.files[0] })}
                />
              </div>
              <div className="form-group">
                <label>Or Video URL</label>
                <input
                  type="text"
                  value={newVideo.url}
                  onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
                  disabled={!!newVideo.file}
                />
              </div>
              <div className="form-group">
                <label>Duration (hh:mm:ss)</label>
                <input
                  type="text"
                  placeholder="e.g., 1:30:00 or 5:30"
                  value={newVideo.duration}
                  onChange={(e) => setNewVideo({ ...newVideo, duration: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Session *</label>
                <select
                  value={newVideo.sessionId}
                  onChange={(e) => {
                    const sessionId = e.target.value;
                    setNewVideo({ 
                      ...newVideo, 
                      sessionId,
                      orderNumber: sessionId ? (videos.filter(v => v.sessionId === parseInt(sessionId)).length + 1) : ''
                    });
                  }}
                >
                  <option value="">Select a session</option>
                  {sessions.map((session) => (
                    <option key={session.id} value={session.id}>
                      {session.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Order Number</label>
                <input
                  type="number"
                  value={newVideo.orderNumber}
                  onChange={(e) => setNewVideo({ ...newVideo, orderNumber: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowCreateVideoModal(false)}
                  disabled={uploadingVideo}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={uploadingVideo}>
                  {uploadingVideo ? 'Uploading...' : 'Create Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Video Modal */}
      {showEditVideoModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Video</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveVideoEdit(); }}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={editVideoFormData.title}
                  onChange={(e) => setEditVideoFormData({ ...editVideoFormData, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Video URL</label>
                <input
                  type="text"
                  value={editVideoFormData.url}
                  onChange={(e) => setEditVideoFormData({ ...editVideoFormData, url: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Duration (hh:mm:ss)</label>
                <input
                  type="text"
                  placeholder="e.g., 1:30:00 or 5:30"
                  value={editVideoFormData.duration}
                  onChange={(e) => setEditVideoFormData({ ...editVideoFormData, duration: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Session</label>
                <select
                  value={editVideoFormData.sessionId}
                  onChange={(e) => setEditVideoFormData({ ...editVideoFormData, sessionId: e.target.value })}
                >
                  <option value="">Select a session</option>
                  {sessions.map((session) => (
                    <option key={session.id} value={session.id}>
                      {session.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Order Number</label>
                <input
                  type="number"
                  value={editVideoFormData.orderNumber}
                  onChange={(e) => setEditVideoFormData({ ...editVideoFormData, orderNumber: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditVideoModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderSessions = () => (
    <div className="admin-sessions">
      <div className="section-header">
        <h2>Session Management</h2>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={() => setShowSessionFilterModal(true)}>
            <Filter size={18} />
            Filter
          </button>
          <button className="btn btn-primary" onClick={() => setShowCreateSessionModal(true)}>
            <Plus size={18} />
            Create Session
          </button>
        </div>
      </div>

      <div className="search-bar">
        <Search size={20} className="search-icon" />
        <input 
          type="text" 
          placeholder="Search sessions..." 
          className="search-input"
          value={sessionSearch}
          onChange={(e) => setSessionSearch(e.target.value)}
        />
      </div>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Course</th>
              <th>Order</th>
              <th>Videos</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSessions.map((session) => (
              <tr key={session.id}>
                <td>{session.title}</td>
                <td>{session.course?.title || 'Unknown'}</td>
                <td>{session.orderNumber}</td>
                <td>{session.videos?.length || 0}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" title="Edit" onClick={() => handleEditSession(session.id)}>
                      <Edit size={18} />
                    </button>
                    <button 
                      className="btn-icon danger" 
                      title="Delete"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteSession(session.id);
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCreateSessionModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create New Session</h3>
              <button 
                className="btn-icon"
                onClick={() => setShowCreateSessionModal(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateSession}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={newSession.title}
                  onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={newSession.description}
                  onChange={(e) => setNewSession({ ...newSession, description: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Content (Markdown supported)</label>
                <textarea
                  value={newSession.content || ''}
                  onChange={(e) => setNewSession({ ...newSession, content: e.target.value })}
                  rows="6"
                  placeholder="Add detailed session content with Markdown formatting..."
                />
              </div>
              <div className="form-group">
                <label>Course *</label>
                <select
                  value={newSession.courseId}
                  onChange={(e) => {
                    const courseId = e.target.value;
                    setNewSession({ 
                      ...newSession, 
                      courseId,
                      orderNumber: courseId ? (sessions.filter(s => s.courseId === parseInt(courseId)).length + 1) : ''
                    });
                  }}
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Order Number</label>
                <input
                  type="number"
                  value={newSession.orderNumber}
                  onChange={(e) => setNewSession({ ...newSession, orderNumber: e.target.value })}
                  required
                />
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowCreateSessionModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderCourses = () => (
    <div className="admin-courses">
      <div className="section-header">
        <h2>Course Management</h2>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={() => setShowCourseFilterModal(true)}>
            <Filter size={18} />
            Filter
          </button>
          <button className="btn btn-primary" onClick={() => handleStartCourseBuilder()}>
            <Plus size={18} />
            Create Course
          </button>
        </div>
      </div>

      <div className="search-bar">
        <Search size={20} className="search-icon" />
        <input 
          type="text" 
          placeholder="Search courses..." 
          className="search-input"
          value={courseSearch}
          onChange={(e) => setCourseSearch(e.target.value)}
        />
      </div>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Course Title</th>
              <th>Description</th>
              <th>Creator</th>
              <th>Sessions</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.map((course) => (
              <tr key={course.id}>
                <td>{course.title}</td>
                <td>{course.description?.substring(0, 50) || 'No description'}...</td>
                <td>{course.creator?.firstName || 'Unknown'}</td>
                <td>{course.sessions?.length || 0}</td>
                <td>{new Date(course.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn-icon" 
                      title="View/Manage" 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleViewCourse(course);
                      }}
                    >
                      <BookOpen size={18} />
                    </button>
                    <button className="btn-icon" title="Edit" onClick={() => handleEditCourse(course.id)}>
                      <Edit size={18} />
                    </button>
                    <button 
                      className="btn-icon danger" 
                      title="Delete"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteCourse(course.id);
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const handleGenerateAiQuiz = async (e) => {
    if (e) e.preventDefault();
    if (!aiQuizCourseId) {
      toast.error('Please select a course to generate questions from');
      return;
    }
    try {
      setGeneratingQuiz(true);
      const res = await aiService.generateQuiz({
        courseId: parseInt(aiQuizCourseId, 10),
        sessionId: aiQuizSessionId ? parseInt(aiQuizSessionId, 10) : null,
        difficulty: aiQuizDifficulty,
        questionCount: parseInt(aiQuizCount, 10),
        saveToDatabase: false,
      });
      setGeneratedQuiz(res);
      toast.success('AI Quiz generated successfully from lecture notes!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate quiz: ' + (err.response?.data?.message || err.message));
    } finally {
      setGeneratingQuiz(false);
    }
  };

  const handleSaveAiQuizToCourse = async (isExamMode = false) => {
    if (!generatedQuiz || !aiQuizCourseId) return;
    try {
      setSavingAiQuiz(true);
      const res = await aiService.generateQuiz({
        courseId: parseInt(aiQuizCourseId, 10),
        sessionId: aiQuizSessionId ? parseInt(aiQuizSessionId, 10) : null,
        difficulty: aiQuizDifficulty,
        questionCount: generatedQuiz.questions?.length || 5,
        saveToDatabase: true,
        title: generatedQuiz.title,
        questions: generatedQuiz.questions,
      });
      const quizRef = res.savedQuizId || res.quizId || '';
      toast.success(`AI Quiz saved successfully! Passing score set to 70%.${quizRef ? ` (Quiz #${quizRef})` : ''}`);
      const quizzesData = await adminService.getAllQuizzes();
      setQuizzes(quizzesData);
      setGeneratedQuiz(null);
      setActiveTab('quizzes');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save quiz: ' + (err.response?.data?.message || err.message));
    } finally {
      setSavingAiQuiz(false);
    }
  };

  const renderAiQuizStudio = () => {
    const selectedCourseSessions = sessions.filter(
      (s) => String(s.courseId) === String(aiQuizCourseId)
    );

    return (
      <div className="admin-ai-quiz-studio">
        <div className="section-header">
          <div>
            <div className="ai-studio-badge">
              <Sparkles size={16} />
              <span>Learnova AI Studio</span>
            </div>
            <h2>AI Quiz Generator Studio</h2>
            <p className="section-desc">
              Automatically extract conceptual multiple-choice questions (QCM) from video lecture study notes and transcripts using natural language processing.
            </p>
          </div>
        </div>

        {/* Generator Controls Card */}
        <div className="ai-studio-card generator-panel">
          <form onSubmit={handleGenerateAiQuiz} className="ai-studio-form">
            <div className="ai-form-grid">
              <div className="form-group">
                <label>Target Course *</label>
                <select
                  value={aiQuizCourseId}
                  onChange={(e) => {
                    setAiQuizCourseId(e.target.value);
                    setAiQuizSessionId('');
                    setGeneratedQuiz(null);
                  }}
                  className="form-control"
                  required
                >
                  <option value="">-- Choose a course --</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title} ({course.level || 'BEGINNER'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Target Session (Optional)</label>
                <select
                  value={aiQuizSessionId}
                  onChange={(e) => setAiQuizSessionId(e.target.value)}
                  className="form-control"
                  disabled={!aiQuizCourseId || selectedCourseSessions.length === 0}
                >
                  <option value="">All Course Sessions (Comprehensive Assessment)</option>
                  {selectedCourseSessions.map((session) => (
                    <option key={session.id} value={session.id}>
                      Session #{session.orderNumber}: {session.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Question Difficulty</label>
                <select
                  value={aiQuizDifficulty}
                  onChange={(e) => setAiQuizDifficulty(e.target.value)}
                  className="form-control"
                >
                  <option value="BEGINNER">Beginner (Foundational Concepts)</option>
                  <option value="INTERMEDIATE">Intermediate (Application & Analysis)</option>
                  <option value="ADVANCED">Advanced (Synthesis & Edge Cases)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Question Count</label>
                <select
                  value={aiQuizCount}
                  onChange={(e) => setAiQuizCount(Number(e.target.value))}
                  className="form-control"
                >
                  <option value={3}>3 Questions (Quick Knowledge Check)</option>
                  <option value={5}>5 Questions (Standard Practice Quiz)</option>
                  <option value={8}>8 Questions (In-depth Evaluation)</option>
                  <option value={10}>10 Questions (Mastery Exam)</option>
                </select>
              </div>
            </div>

            <div className="generator-actions">
              <button
                type="submit"
                className="btn btn-primary btn-generate-quiz"
                disabled={generatingQuiz || !aiQuizCourseId}
              >
                {generatingQuiz ? (
                  <>
                    <span className="spinner-sm" />
                    <span>Analyzing lecture notes & generating QCM...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>Generate AI Quiz</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Generated Quiz Review Section */}
        {generatedQuiz && (
          <div className="generated-quiz-preview">
            <div className="quiz-preview-header">
              <div className="preview-meta">
                <span className="badge badge-difficulty">{generatedQuiz.difficulty}</span>
                <span className="badge badge-count">{generatedQuiz.questionCount} Questions</span>
                <span className="badge badge-score">70% Pass Mark</span>
              </div>
              <h3 className="preview-title">{generatedQuiz.title}</h3>
              <p className="preview-desc">{generatedQuiz.description}</p>
              
              <div className="preview-actions">
                <button
                  type="button"
                  className="btn btn-success"
                  disabled={savingAiQuiz}
                  onClick={() => handleSaveAiQuizToCourse(false)}
                >
                  {savingAiQuiz ? (
                    'Saving to database...'
                  ) : (
                    <>
                      <CheckCircle2 size={18} />
                      Save as Practice Quiz (70% Pass)
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={savingAiQuiz || generatingQuiz}
                  onClick={handleGenerateAiQuiz}
                >
                  <RefreshCw size={18} className={generatingQuiz ? 'spin' : ''} />
                  {generatingQuiz ? 'Regenerating...' : 'Discard & Regenerate'}
                </button>
              </div>
            </div>

            <div className="preview-questions-list">
              {generatedQuiz.questions?.map((q, qIndex) => (
                <div key={qIndex} className="preview-question-card">
                  <div className="question-card-top">
                    <span className="question-number-icon">{qIndex + 1}</span>
                    <h4 className="question-prompt">{q.text}</h4>
                  </div>
                  <div className="preview-options-grid">
                    {q.options?.map((opt, optIndex) => {
                      const isCorrect = typeof opt === 'object' ? Boolean(opt.isCorrect || opt.text === q.correctAnswer) : opt === q.correctAnswer;
                      const optText = typeof opt === 'object' ? (opt.text || '') : String(opt || '');
                      return (
                        <div
                          key={optIndex}
                          className={`preview-option-item ${isCorrect ? 'is-correct' : ''}`}
                        >
                          <span className="opt-letter">
                            {String.fromCharCode(65 + optIndex)}
                          </span>
                          <span className="opt-text">{optText}</span>
                          {isCorrect && (
                            <span className="correct-tag">
                              <CheckCircle2 size={14} /> Correct
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {q.explanation && (
                    <div className="preview-explanation">
                      <p className="explanation-label">Pedagogical Explanation:</p>
                      <p className="explanation-text">{q.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!isAdmin) {
    return (
      <div className="admin-container">
        <div className="error-message">
          <h2>Access Denied</h2>
          <p>You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-container">
        <div className="admin-loading">
          <div className="spinner"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div className="header-content">
          <h1 className="admin-title">Admin Dashboard</h1>
          <p className="admin-subtitle">Manage your platform efficiently</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={() => setShowStatsModal(true)}>
            <Settings size={18} />
            Statistics
          </button>
          <button onClick={logout} className="btn btn-danger">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-sidebar">
          <nav className="admin-nav">
            <button 
              className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <Activity size={20} />
              Overview
            </button>
            <button 
              className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <Users size={20} />
              Users
            </button>
            <button 
              className={`nav-item ${activeTab === 'course-builder' ? 'active' : ''}`}
              onClick={() => handleStartCourseBuilder()}
            >
              <Plus size={20} />
              Course Builder
            </button>
            
            {/* Content Management Section */}
            <div className="nav-section-divider">
              <span className="nav-section-label">Content Management</span>
            </div>
            
            <button 
              className={`nav-item ${activeTab === 'courses' ? 'active' : ''}`}
              onClick={() => setActiveTab('courses')}
            >
              <BookOpen size={20} />
              Courses
            </button>
            <button 
              className={`nav-item ${activeTab === 'sessions' ? 'active' : ''}`}
              onClick={() => setActiveTab('sessions')}
            >
              <Activity size={20} />
              Sessions
            </button>
            <button 
              className={`nav-item ${activeTab === 'videos' ? 'active' : ''}`}
              onClick={() => setActiveTab('videos')}
            >
              <Users size={20} />
              Videos
            </button>
            <button 
              className={`nav-item ${activeTab === 'quizzes' ? 'active' : ''}`}
              onClick={() => setActiveTab('quizzes')}
            >
              <FileText size={20} />
              Quizzes
            </button>
            
            {/* Certificates Section */}
            <div className="nav-section-divider">
              <span className="nav-section-label">Certificates</span>
            </div>
            
            <button 
              className={`nav-item ${activeTab === 'certificates' ? 'active' : ''}`}
              onClick={() => setActiveTab('certificates')}
            >
              <Award size={20} />
              Certificates
            </button>

            {/* AI Intelligence Section */}
            <div className="nav-section-divider">
              <span className="nav-section-label">AI Studio</span>
            </div>

            <button 
              className={`nav-item ${activeTab === 'ai-quiz-studio' ? 'active' : ''}`}
              onClick={() => setActiveTab('ai-quiz-studio')}
            >
              <Sparkles size={20} />
              AI Quiz Generator
            </button>
          </nav>
        </div>

        <div className="admin-main">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'courses' && renderCourses()}
          {activeTab === 'sessions' && renderSessions()}
          {activeTab === 'videos' && renderVideos()}
          {activeTab === 'quizzes' && renderQuizzes()}
          {activeTab === 'certificates' && renderCertificates()}
          {activeTab === 'ai-quiz-studio' && renderAiQuizStudio()}
        </div>
      </div>

      {/* Unified Course Builder Modal */}
      {showCourseBuilder && (
        <div className="modal-overlay professional-overlay">
          <div className="modal-content professional-content course-builder-modal">
            <div className="modal-header professional-header">
              <h3>Course Builder - Step {builderStep} of 5</h3>
              <button className="btn-close-modal" onClick={handleBuilderCloseDirect}>✕</button>
            </div>
            
            {/* Progress Steps */}
            <div className="builder-progress">
              <div className={`progress-step ${builderStep >= 1 ? 'active' : ''} ${builderStep > 1 ? 'completed' : ''}`}>
                <div className="step-number">1</div>
                <div className="step-label">Course Details</div>
              </div>
              <div className={`progress-step ${builderStep >= 2 ? 'active' : ''} ${builderStep > 2 ? 'completed' : ''}`}>
                <div className="step-number">2</div>
                <div className="step-label">Sessions</div>
              </div>
              <div className={`progress-step ${builderStep >= 3 ? 'active' : ''} ${builderStep > 3 ? 'completed' : ''}`}>
                <div className="step-number">3</div>
                <div className="step-label">Videos</div>
              </div>
              <div className={`progress-step ${builderStep >= 4 ? 'active' : ''} ${builderStep > 4 ? 'completed' : ''}`}>
                <div className="step-number">4</div>
                <div className="step-label">Quiz</div>
              </div>
              <div className={`progress-step ${builderStep >= 5 ? 'active' : ''} ${builderStep > 5 ? 'completed' : ''}`}>
                <div className="step-number">5</div>
                <div className="step-label">Review</div>
              </div>
            </div>

            {/* Step 1: Course Details */}
            {builderStep === 1 && (
              <div className="builder-step">
                <h4>Step 1: Course Information</h4>
                <div className="form-group">
                  <label>Course Title *</label>
                  <input
                    type="text"
                    value={builderCourse.title}
                    onChange={(e) => setBuilderCourse({ ...builderCourse, title: e.target.value })}
                    placeholder="Enter course title"
                    className={validationErrors.title ? 'error' : ''}
                    required
                  />
                  {validationErrors.title && <span className="error-message">{validationErrors.title}</span>}
                </div>
                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    value={builderCourse.description}
                    onChange={(e) => setBuilderCourse({ ...builderCourse, description: e.target.value })}
                    placeholder="Enter course description"
                    rows={4}
                    className={validationErrors.description ? 'error' : ''}
                    required
                  />
                  {validationErrors.description && <span className="error-message">{validationErrors.description}</span>}
                </div>
                <div className="form-group">
                  <label>Difficulty Level (Gamification Point Rate) *</label>
                  <select
                    value={builderCourse.level || 'BEGINNER'}
                    onChange={(e) => setBuilderCourse({ ...builderCourse, level: e.target.value })}
                    className="form-control"
                  >
                    <option value="BEGINNER">Beginner (1.0x Points - 10 pts/session, 50 pts/quiz)</option>
                    <option value="ALL_LEVELS">All Levels (1.25x Points - 13 pts/session, 63 pts/quiz)</option>
                    <option value="INTERMEDIATE">Intermediate (1.5x Points - 15 pts/session, 75 pts/quiz)</option>
                    <option value="ADVANCED">Advanced / Pro (2.0x Points - 20 pts/session, 100 pts/quiz)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Domain / Category *</label>
                  {!showCustomDomainInput ? (
                    <>
                      <select
                        value={builderCourse.domain || 'IT_DATA'}
                        onChange={(e) => setBuilderCourse({ ...builderCourse, domain: e.target.value })}
                        className="form-control"
                      >
                        <option value="IT_DATA">IT & Data Analytics</option>
                        <option value="MARKETING">Marketing & Growth</option>
                        <option value="FINANCE_BUSINESS">Finance & Business</option>
                        <option value="MANAGEMENT">Management & Agile</option>
                        <option value="DESIGN_CREATIVE">Design & UX/UI</option>
                        <option value="LANGUAGE_COMMUNICATION">Languages & Communication</option>
                        <option value="HEALTH_WELLNESS">Health & Wellness</option>
                        <option value="PERSONAL_DEVELOPMENT">Personal Development</option>
                        <option value="ACADEMIC_SCIENCES">Academic Sciences</option>
                        <option value="MUSIC_ARTS">Music & Arts</option>
                        <option value="LIFESTYLE_HOBBIES">Lifestyle & Hobbies</option>
                        <option value="SALES_E_COMMERCE">Sales & E-Commerce</option>
                        <option value="HUMANITIES_SOCIAL">Humanities & Social</option>
                        <option value="LAW_LEGAL">Law & Legal Studies</option>
                        {customDomains.map((domain) => (
                          <option key={domain} value={domain}>
                            {domain.replace(/_/g, ' ')}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        className="btn btn-link btn-sm"
                        onClick={() => setShowCustomDomainInput(true)}
                      >
                        + Create new domain
                      </button>
                    </>
                  ) : (
                    <>
                      <input
                        type="text"
                        value={customDomain}
                        onChange={(e) => setCustomDomain(e.target.value)}
                        placeholder="Enter new domain name (e.g., Artificial Intelligence)"
                        className="form-control"
                      />
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          if (customDomain.trim()) {
                            const newDomain = customDomain.trim().replace(/\s+/g, '_');
                            setBuilderCourse({ ...builderCourse, domain: newDomain });
                            if (!customDomains.includes(newDomain)) {
                              setCustomDomains([...customDomains, newDomain]);
                            }
                            setShowCustomDomainInput(false);
                            setCustomDomain('');
                          }
                        }}
                      >
                        Add Domain
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setShowCustomDomainInput(false);
                          setCustomDomain('');
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
                <div className="form-group">
                  <label>Pricing Tier *</label>
                  <select
                    value={builderCourse.isPaid ? 'paid' : 'free'}
                    onChange={(e) => setBuilderCourse({ 
                      ...builderCourse, 
                      isPaid: e.target.value === 'paid',
                      price: e.target.value === 'free' ? 0 : builderCourse.price || 29.99
                    })}
                  >
                    <option value="free">Free Course</option>
                    <option value="paid">Paid / Premium Course</option>
                  </select>
                </div>
                {builderCourse.isPaid && (
                  <div className="form-group">
                    <label>Course Price ($ USD) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.99"
                      value={builderCourse.price}
                      onChange={(e) => setBuilderCourse({ ...builderCourse, price: parseFloat(e.target.value) || 0 })}
                      placeholder="e.g. 49.99"
                    />
                  </div>
                )}
                <div className="form-group">
                  <label>Featured / Recommended Course</label>
                  <div className="toggle-switch">
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={builderCourse.recommended}
                        onChange={(e) => setBuilderCourse({ ...builderCourse, recommended: e.target.checked })}
                      />
                      <span className="slider round"></span>
                    </label>
                    <span className="toggle-label">
                      {builderCourse.recommended ? 'Featured Course' : 'Regular Course'}
                    </span>
                  </div>
                </div>
                <div className="form-group">
                  <label>Thumbnail URL</label>
                  <input
                    type="text"
                    value={builderCourse.thumbnail}
                    onChange={(e) => setBuilderCourse({ ...builderCourse, thumbnail: e.target.value })}
                    placeholder="Enter thumbnail URL"
                  />
                </div>
                <div className="builder-actions">
                  <button type="button" className="btn btn-secondary" onClick={handleBuilderCancel}>Cancel</button>
                  <button type="button" className="btn btn-primary" onClick={handleBuilderNext}>Next</button>
                </div>
              </div>
            )}

            {/* Step 2: Sessions */}
            {builderStep === 2 && (
              <div className="builder-step">
                <h4>Step 2: Add Sessions</h4>
                <div className="form-group">
                  <label>Session Title *</label>
                  <input
                    type="text"
                    value={builderCurrentSession.title}
                    onChange={(e) => setBuilderCurrentSession({ ...builderCurrentSession, title: e.target.value })}
                    placeholder="Enter session title"
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={builderCurrentSession.description}
                    onChange={(e) => setBuilderCurrentSession({ ...builderCurrentSession, description: e.target.value })}
                    placeholder="Enter session description"
                    rows={3}
                  />
                </div>
                <div className="form-group">
                  <label>Content/Notes</label>
                  <textarea
                    value={builderCurrentSession.content}
                    onChange={(e) => setBuilderCurrentSession({ ...builderCurrentSession, content: e.target.value })}
                    placeholder="Enter session content or notes"
                    rows={3}
                  />
                </div>
                <div className="builder-actions-inline">
                  {editingSessionId ? (
                    <>
                      <button type="button" className="btn btn-secondary" onClick={handleBuilderCancelSessionEdit}>Cancel</button>
                      <button type="button" className="btn btn-primary" onClick={handleBuilderSaveSessionEdit}>Save</button>
                    </>
                  ) : (
                    <button type="button" className="btn btn-secondary" onClick={handleAddSession} disabled={!builderCurrentSession.title}>
                      Add Session
                    </button>
                  )}
                </div>
                
                {builderSessions.length > 0 && (
                  <div className="builder-list">
                    <h5>Sessions Added ({builderSessions.length})</h5>
                    {builderSessions.map((session, index) => (
                      <div key={session.id} className="builder-list-item">
                        <span>{index + 1}. {session.title}</span>
                        <div className="builder-item-actions">
                          <button 
                            className="btn-icon" 
                            title="Move Up" 
                            onClick={() => handleMoveSession(session.id, 'up')}
                            disabled={index === 0}
                          >
                            ↑
                          </button>
                          <button 
                            className="btn-icon" 
                            title="Move Down" 
                            onClick={() => handleMoveSession(session.id, 'down')}
                            disabled={index === builderSessions.length - 1}
                          >
                            ↓
                          </button>
                          <button className="btn-icon" title="Edit" onClick={() => handleBuilderEditSession(session.id)}>
                            Edit
                          </button>
                          <button 
                            className="btn-icon danger" 
                            title="Delete"
                            onClick={() => handleDeleteSession(session.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="builder-actions">
                  <button type="button" className="btn btn-secondary" onClick={handleBuilderBack}>Back</button>
                  <button type="button" className="btn btn-primary" onClick={handleBuilderNext} disabled={builderSessions.length === 0}>Next</button>
                </div>
              </div>
            )}

            {/* Step 3: Videos */}
            {builderStep === 3 && (
              <div className="builder-step">
                <h4>Step 3: Add Videos</h4>
                <div className="form-group">
                  <label>Select Session *</label>
                  <select
                    value={builderCurrentVideo.sessionId}
                    onChange={(e) => setBuilderCurrentVideo({ ...builderCurrentVideo, sessionId: e.target.value })}
                    required
                  >
                    <option value="">Select a session</option>
                    {builderSessions.map((session) => (
                      <option key={session.id} value={session.id}>
                        {session.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Video Title *</label>
                  <input
                    type="text"
                    value={builderCurrentVideo.title}
                    onChange={(e) => setBuilderCurrentVideo({ ...builderCurrentVideo, title: e.target.value })}
                    placeholder="Enter video title"
                  />
                </div>
                <div className="form-group">
                  <label>Video URL *</label>
                  <input
                    type="text"
                    value={builderCurrentVideo.url}
                    onChange={(e) => setBuilderCurrentVideo({ ...builderCurrentVideo, url: e.target.value })}
                    placeholder="Enter YouTube, Vimeo, or direct video URL"
                  />
                  <small>Supports YouTube, Vimeo, or direct video URLs (.mp4, .webm, .ogg, .mov)</small>
                </div>
                <div className="form-group">
                  <label>Duration (MM:SS)</label>
                  <input
                    type="text"
                    value={builderCurrentVideo.duration}
                    onChange={(e) => setBuilderCurrentVideo({ ...builderCurrentVideo, duration: e.target.value })}
                    placeholder="e.g., 05:30"
                  />
                  <small>Format: MM:SS (e.g., 05:30 for 5 minutes 30 seconds)</small>
                </div>
                <div className="builder-actions-inline">
                  {editingVideoId ? (
                    <>
                      <button type="button" className="btn btn-secondary" onClick={handleBuilderCancelVideoEdit}>Cancel</button>
                      <button type="button" className="btn btn-primary" onClick={handleBuilderSaveVideoEdit}>Save</button>
                    </>
                  ) : (
                    <button type="button" className="btn btn-secondary" onClick={handleAddVideo} disabled={!builderCurrentVideo.title || !builderCurrentVideo.url || !builderCurrentVideo.sessionId}>
                      Add Video
                    </button>
                  )}
                </div>
                
                {builderVideos.length > 0 && (
                  <div className="builder-list">
                    <h5>Videos Added ({builderVideos.length})</h5>
                    {builderVideos.map((video, index) => (
                      <div key={video.id} className="builder-list-item">
                        <span>{index + 1}. {video.title} ({video.duration || 'N/A'})</span>
                        <div className="builder-item-actions">
                          <button 
                            className="btn-icon" 
                            title="Move Up" 
                            onClick={() => handleMoveVideo(video.id, 'up')}
                            disabled={index === 0}
                          >
                            ↑
                          </button>
                          <button 
                            className="btn-icon" 
                            title="Move Down" 
                            onClick={() => handleMoveVideo(video.id, 'down')}
                            disabled={index === builderVideos.length - 1}
                          >
                            ↓
                          </button>
                          <button className="btn-icon" title="Edit" onClick={() => handleBuilderEditVideo(video.id)}>
                            Edit
                          </button>
                          <button 
                            className="btn-icon danger" 
                            title="Delete"
                            onClick={() => handleDeleteVideo(video.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="builder-actions">
                  <button type="button" className="btn btn-secondary" onClick={handleBuilderBack}>Back</button>
                  <button type="button" className="btn btn-primary" onClick={handleBuilderNext} disabled={builderVideos.length === 0}>Next</button>
                </div>
              </div>
            )}

            {/* Step 4: Quiz */}
            {builderStep === 4 && (
              <div className="builder-step">
                <h4>Step 4: Quiz Configuration</h4>
                <div className="form-group">
                  <label>Quiz Type</label>
                  <div 
                    className="toggle-switch"
                    onClick={() => setBuilderQuiz({ ...builderQuiz, isExamMode: !builderQuiz.isExamMode })}
                  >
                    <input
                      type="checkbox"
                      checked={builderQuiz.isExamMode}
                      onChange={(e) => setBuilderQuiz({ ...builderQuiz, isExamMode: e.target.checked })}
                      className="toggle-input"
                    />
                    <span className="toggle-slider"></span>
                    <span className="toggle-label">
                      {builderQuiz.isExamMode ? 'Final Exam' : 'Practice Quiz'}
                    </span>
                  </div>
                </div>
                <div className="form-group">
                  <label>Quiz Title *</label>
                  <input
                    type="text"
                    value={builderQuiz.title}
                    onChange={(e) => setBuilderQuiz({ ...builderQuiz, title: e.target.value })}
                    placeholder="Enter quiz title"
                    className={validationErrors.quizTitle ? 'error' : ''}
                  />
                  {validationErrors.quizTitle && <span className="error-message">{validationErrors.quizTitle}</span>}
                </div>
                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    value={builderQuiz.description}
                    onChange={(e) => setBuilderQuiz({ ...builderQuiz, description: e.target.value })}
                    placeholder="Enter quiz description"
                    rows={3}
                    className={validationErrors.quizDescription ? 'error' : ''}
                  />
                  {validationErrors.quizDescription && <span className="error-message">{validationErrors.quizDescription}</span>}
                </div>
                <div className="form-group">
                  <label>Time Limit (minutes)</label>
                  <input
                    type="number"
                    value={builderQuiz.timeLimitMinutes}
                    onChange={(e) => setBuilderQuiz({ ...builderQuiz, timeLimitMinutes: e.target.value })}
                    placeholder="e.g., 30"
                  />
                </div>
                <div className="form-group">
                  <label>Passing Score (%)</label>
                  <input
                    type="number"
                    value={builderQuiz.passingScore}
                    onChange={(e) => setBuilderQuiz({ ...builderQuiz, passingScore: parseInt(e.target.value) })}
                    min="0"
                    max="100"
                  />
                </div>
                <div className="form-group">
                  <label>Max Attempts</label>
                  <input
                    type="number"
                    value={builderQuiz.maxAttempts}
                    onChange={(e) => setBuilderQuiz({ ...builderQuiz, maxAttempts: parseInt(e.target.value) })}
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label>Randomize Questions</label>
                  <div 
                    className="toggle-switch"
                    onClick={() => setBuilderQuiz({ ...builderQuiz, randomizeQuestions: !builderQuiz.randomizeQuestions })}
                  >
                    <input
                      type="checkbox"
                      checked={builderQuiz.randomizeQuestions}
                      onChange={(e) => setBuilderQuiz({ ...builderQuiz, randomizeQuestions: e.target.checked })}
                      className="toggle-input"
                    />
                    <span className="toggle-slider"></span>
                  </div>
                </div>
                <div className="form-group">
                  <label>Randomize Answers</label>
                  <div 
                    className="toggle-switch"
                    onClick={() => setBuilderQuiz({ ...builderQuiz, randomizeAnswers: !builderQuiz.randomizeAnswers })}
                  >
                    <input
                      type="checkbox"
                      checked={builderQuiz.randomizeAnswers}
                      onChange={(e) => setBuilderQuiz({ ...builderQuiz, randomizeAnswers: e.target.checked })}
                      className="toggle-input"
                    />
                    <span className="toggle-slider"></span>
                  </div>
                </div>
                <div className="form-group">
                  <label>Allow Review After Submission</label>
                  <div 
                    className="toggle-switch"
                    onClick={() => setBuilderQuiz({ ...builderQuiz, allowReviewAfterSubmission: !builderQuiz.allowReviewAfterSubmission })}
                  >
                    <input
                      type="checkbox"
                      checked={builderQuiz.allowReviewAfterSubmission}
                      onChange={(e) => setBuilderQuiz({ ...builderQuiz, allowReviewAfterSubmission: e.target.checked })}
                      className="toggle-input"
                    />
                    <span className="toggle-slider"></span>
                  </div>
                </div>
                <div className="form-group">
                  <label>Show Explanation After Answer</label>
                  <div 
                    className="toggle-switch"
                    onClick={() => setBuilderQuiz({ ...builderQuiz, showExplanationAfterAnswer: !builderQuiz.showExplanationAfterAnswer })}
                  >
                    <input
                      type="checkbox"
                      checked={builderQuiz.showExplanationAfterAnswer}
                      onChange={(e) => setBuilderQuiz({ ...builderQuiz, showExplanationAfterAnswer: e.target.checked })}
                      className="toggle-input"
                    />
                    <span className="toggle-slider"></span>
                  </div>
                </div>
                
                {/* Questions Section */}
                <div className="builder-questions-section">
                  <div className="builder-questions-header">
                    <div>
                      <h5>Questions ({builderQuestions.length})</h5>
                      <span className="questions-recommendation">
                        {builderQuiz.isExamMode 
                          ? `Recommended: 20-30 questions (minimum: 10)`
                          : `Recommended: 5-10 questions (minimum: 3)`
                        }
                      </span>
                    </div>
                    <button 
                      type="button" 
                      className="btn btn-secondary btn-sm"
                      onClick={() => setShowBuilderAddQuestionForm(!showBuilderAddQuestionForm)}
                    >
                      {showBuilderAddQuestionForm ? 'Cancel' : 'Add Question'}
                    </button>
                  </div>
                  
                  {showBuilderAddQuestionForm && (
                    <div className="add-question-form">
                      <div className="form-group">
                        <label>Question Text *</label>
                        <textarea
                          value={builderCurrentQuestion.text}
                          onChange={(e) => setBuilderCurrentQuestion({ ...builderCurrentQuestion, text: e.target.value })}
                          placeholder="Enter your question"
                          rows={3}
                        />
                      </div>
                      
                      <label>Options *</label>
                      {builderCurrentQuestion.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="question-option">
                          <div className="option-header">
                            <input
                              type="radio"
                              name={`correct-option-${Date.now()}`}
                              checked={option.isCorrect}
                              onChange={(e) => handleBuilderOptionChange(optionIndex, 'isCorrect', e.target.checked)}
                              className="option-correct-radio"
                            />
                            <span className="option-label">Option {optionIndex + 1}</span>
                          </div>
                          <input
                            type="text"
                            value={option.text}
                            onChange={(e) => handleBuilderOptionChange(optionIndex, 'text', e.target.value)}
                            placeholder={`Option ${optionIndex + 1} text`}
                            className="option-text-input"
                          />
                          <textarea
                            value={option.explanation}
                            onChange={(e) => handleBuilderOptionChange(optionIndex, 'explanation', e.target.value)}
                            placeholder="Explanation (optional)"
                            rows={2}
                            className="option-explanation-input"
                          />
                        </div>
                      ))}
                      
                      <div className="builder-actions-inline">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowBuilderAddQuestionForm(false)}>Cancel</button>
                        <button type="button" className="btn btn-primary" onClick={handleAddQuestion}>Add Question</button>
                      </div>
                    </div>
                  )}
                  
                  {builderQuestions.length > 0 && (
                    <div className="builder-questions-list">
                      {builderQuestions.map((question, index) => (
                        <div key={question.id} className="builder-question-item">
                          <div className="question-header">
                            <span className="question-number-icon">{index + 1}</span>
                            <div className="question-actions">
                              <button 
                                className="btn-icon edit" 
                                title="Edit Question"
                                onClick={() => handleBuilderEditQuestion(question.id)}
                              >
                                Edit
                              </button>
                              <button 
                                className="btn-icon danger" 
                                title="Delete Question"
                                onClick={() => handleBuilderDeleteQuestion(question.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                          <p className="question-text">{question.text}</p>
                          <div className="question-options-preview">
                            {question.options.map((opt, idx) => (
                              <div key={idx} className={`option-preview ${opt.isCorrect ? 'correct' : ''}`}>
                                <span className="option-marker">{opt.isCorrect ? '✓' : '○'}</span>
                                <span className="option-text">{opt.text || '(empty)'}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="builder-actions">
                  <button type="button" className="btn btn-secondary" onClick={handleBuilderBack}>Back</button>
                  <button type="button" className="btn btn-primary" onClick={handleBuilderNext}>Next</button>
                </div>
              </div>
            )}

            {/* Step 5: Review */}
            {builderStep === 5 && (
              <div className="builder-step">
                <h4>Step 5: Review & Create Course</h4>
                <div className="builder-review">
                  <div className="review-section">
                    <h5>Course Details</h5>
                    <p><strong>Title:</strong> {builderCourse.title}</p>
                    <p><strong>Description:</strong> {builderCourse.description}</p>
                    {builderCourse.thumbnail && <p><strong>Thumbnail:</strong> <img src={builderCourse.thumbnail} alt="Thumbnail" style={{ maxWidth: '200px' }} /></p>}
                  </div>
                  
                  <div className="review-section">
                    <h5>Sessions ({builderSessions.length})</h5>
                    {builderSessions.map((session, index) => (
                      <p key={session.id}>{index + 1}. {session.title}</p>
                    ))}
                  </div>
                  
                  <div className="review-section">
                    <h5>Videos ({builderVideos.length})</h5>
                    {builderVideos.map((video, index) => (
                      <p key={video.id}>{index + 1}. {video.title} ({video.duration || 'N/A'})</p>
                    ))}
                  </div>
                  
                  <div className="review-section">
                    <h5>Quiz Settings</h5>
                    <p><strong>Title:</strong> {builderQuiz.title || 'N/A'}</p>
                    <p><strong>Time Limit:</strong> {builderQuiz.timeLimitMinutes ? `${builderQuiz.timeLimitMinutes} minutes` : 'N/A'}</p>
                    <p><strong>Passing Score:</strong> {builderQuiz.passingScore}%</p>
                    <p><strong>Max Attempts:</strong> {builderQuiz.maxAttempts}</p>
                  </div>
                </div>
                
                <div className="builder-actions">
                  <button type="button" className="btn btn-secondary" onClick={handleBuilderBack}>Back</button>
                  <button type="button" className="btn btn-secondary" onClick={handleBuilderCancel}>Cancel</button>
                  <button type="button" className="btn btn-primary" onClick={handleBuilderSubmit}>Create Course</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {showEditCourseModal && (
        <div className="modal-overlay professional-overlay">
          <div className="modal-content professional-content">
            <div className="modal-header professional-header">
              <h3>Edit Course</h3>
              <button className="btn-close-modal" onClick={() => setShowEditCourseModal(false)}>
                ✕
              </button>
            </div>
            <div className="modal-body professional-body">
              <form onSubmit={(e) => { e.preventDefault(); handleSaveCourseEdit(); }}>
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    value={editCourseFormData.title}
                    onChange={(e) => setEditCourseFormData({ ...editCourseFormData, title: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    value={editCourseFormData.description}
                    onChange={(e) => setEditCourseFormData({ ...editCourseFormData, description: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Difficulty Level *</label>
                  <select
                    value={editCourseFormData.level || 'BEGINNER'}
                    onChange={(e) => setEditCourseFormData({ ...editCourseFormData, level: e.target.value })}
                    className="form-control"
                  >
                    <option value="BEGINNER">Beginner (1.0x Points - 10 pts/session, 50 pts/quiz)</option>
                    <option value="ALL_LEVELS">All Levels (1.25x Points - 13 pts/session, 63 pts/quiz)</option>
                    <option value="INTERMEDIATE">Intermediate (1.5x Points - 15 pts/session, 75 pts/quiz)</option>
                    <option value="ADVANCED">Advanced / Pro (2.0x Points - 20 pts/session, 100 pts/quiz)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Pricing Tier *</label>
                  <select
                    value={editCourseFormData.isPaid ? 'paid' : 'free'}
                    onChange={(e) => setEditCourseFormData({ 
                      ...editCourseFormData, 
                      isPaid: e.target.value === 'paid',
                      price: e.target.value === 'free' ? 0 : editCourseFormData.price || 29.99
                    })}
                  >
                    <option value="free">🌱 Free Course</option>
                    <option value="paid">💎 Paid / Premium Course</option>
                  </select>
                </div>
                {editCourseFormData.isPaid && (
                  <div className="form-group">
                    <label>Course Price ($ USD) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.99"
                      value={editCourseFormData.price || 0}
                      onChange={(e) => setEditCourseFormData({ ...editCourseFormData, price: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                )}
                <div className="form-group">
                  <label>Thumbnail URL</label>
                  <input
                    type="url"
                    value={editCourseFormData.thumbnail}
                    onChange={(e) => setEditCourseFormData({ ...editCourseFormData, thumbnail: e.target.value })}
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowEditCourseModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Session Modal */}
      {showEditSessionModal && (
        <div className="modal-overlay professional-overlay">
          <div className="modal-content professional-content">
            <div className="modal-header professional-header">
              <h3>Edit Session</h3>
              <button className="btn-close-modal" onClick={() => setShowEditSessionModal(false)}>
                ✕
              </button>
            </div>
            <div className="modal-body professional-body">
              <form onSubmit={(e) => { e.preventDefault(); handleSaveSessionEdit(); }}>
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    value={editSessionFormData.title}
                    onChange={(e) => setEditSessionFormData({ ...editSessionFormData, title: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    value={editSessionFormData.description}
                    onChange={(e) => setEditSessionFormData({ ...editSessionFormData, description: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Content (Markdown supported)</label>
                  <textarea
                    value={editSessionFormData.content || ''}
                    onChange={(e) => setEditSessionFormData({ ...editSessionFormData, content: e.target.value })}
                    rows="6"
                    placeholder="Add detailed session content with Markdown formatting..."
                  />
                </div>
                <div className="form-group">
                  <label>Course</label>
                  <select
                    value={editSessionFormData.courseId}
                    onChange={(e) => setEditSessionFormData({ ...editSessionFormData, courseId: e.target.value })}
                    required
                  >
                    <option value="">Select a course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Order Number</label>
                  <input
                    type="number"
                    value={editSessionFormData.orderNumber}
                    onChange={(e) => setEditSessionFormData({ ...editSessionFormData, orderNumber: e.target.value })}
                    required
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowEditSessionModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Video Modal */}
      {showEditVideoModal && (
        <div className="modal-overlay professional-overlay">
          <div className="modal-content professional-content">
            <div className="modal-header professional-header">
              <h3>Edit Video</h3>
              <button className="btn-close-modal" onClick={() => setShowEditVideoModal(false)}>
                ✕
              </button>
            </div>
            <div className="modal-body professional-body">
              <form onSubmit={(e) => { e.preventDefault(); handleSaveVideoEdit(); }}>
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={editVideoFormData.title}
                    onChange={(e) => setEditVideoFormData({ ...editVideoFormData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>URL</label>
                  <input
                    type="url"
                    value={editVideoFormData.url}
                    onChange={(e) => setEditVideoFormData({ ...editVideoFormData, url: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Duration (MM:SS)</label>
                  <input
                    type="text"
                    value={editVideoFormData.duration}
                    onChange={(e) => setEditVideoFormData({ ...editVideoFormData, duration: e.target.value })}
                    placeholder="e.g., 05:30"
                  />
                </div>
                <div className="form-group">
                  <label>Session</label>
                  <select
                    value={editVideoFormData.sessionId}
                    onChange={(e) => setEditVideoFormData({ ...editVideoFormData, sessionId: e.target.value })}
                    required
                  >
                    <option value="">Select a session</option>
                    {sessions.map((session) => (
                      <option key={session.id} value={session.id}>
                        {session.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Order Number</label>
                  <input
                    type="number"
                    value={editVideoFormData.orderNumber}
                    onChange={(e) => setEditVideoFormData({ ...editVideoFormData, orderNumber: e.target.value })}
                    required
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowEditVideoModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Quiz Modal */}
      {showEditQuizModal && (
        <div className="modal-overlay professional-overlay">
          <div className="modal-content professional-content">
            <div className="modal-header professional-header">
              <h3>Edit Quiz</h3>
              <button className="btn-close-modal" onClick={() => setShowEditQuizModal(false)}>
                ✕
              </button>
            </div>
            <div className="modal-body professional-body">
              <form onSubmit={(e) => { e.preventDefault(); handleSaveQuizEdit(); }}>
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={editQuizFormData.title}
                    onChange={(e) => setEditQuizFormData({ ...editQuizFormData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={editQuizFormData.description}
                    onChange={(e) => setEditQuizFormData({ ...editQuizFormData, description: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Course</label>
                  <select
                    value={editQuizFormData.courseId}
                    onChange={(e) => setEditQuizFormData({ ...editQuizFormData, courseId: e.target.value })}
                    required
                  >
                    <option value="">Select a course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Time Limit (minutes)</label>
                  <input
                    type="number"
                    value={editQuizFormData.timeLimitMinutes}
                    onChange={(e) => setEditQuizFormData({ ...editQuizFormData, timeLimitMinutes: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Passing Score (%)</label>
                  <input
                    type="number"
                    value={editQuizFormData.passingScore}
                    onChange={(e) => setEditQuizFormData({ ...editQuizFormData, passingScore: parseInt(e.target.value) })}
                    min="0"
                    max="100"
                  />
                </div>
                <div className="form-group">
                  <label>Max Attempts</label>
                  <input
                    type="number"
                    value={editQuizFormData.maxAttempts}
                    onChange={(e) => setEditQuizFormData({ ...editQuizFormData, maxAttempts: parseInt(e.target.value) })}
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label>Exam Mode</label>
                  <div 
                    className="toggle-switch"
                    onClick={() => setEditQuizFormData({ ...editQuizFormData, isExamMode: !editQuizFormData.isExamMode })}
                  >
                    <input
                      type="checkbox"
                      checked={editQuizFormData.isExamMode}
                      onChange={(e) => setEditQuizFormData({ ...editQuizFormData, isExamMode: e.target.checked })}
                      className="toggle-input"
                    />
                    <span className="toggle-slider"></span>
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowEditQuizModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Course Filter Modal */}
      {showCourseFilterModal && (
        <div className="modal-overlay professional-overlay">
          <div className="modal-content professional-content">
            <div className="modal-header professional-header">
              <h3>Filter Courses</h3>
              <button className="btn-close-modal" onClick={() => setShowCourseFilterModal(false)}>
                ✕
              </button>
            </div>
            <div className="modal-body professional-body">
              <div className="form-group">
                <label>Min Sessions</label>
                <input
                  type="number"
                  value={courseFilterMinSessions}
                  onChange={(e) => setCourseFilterMinSessions(e.target.value)}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Max Sessions</label>
                <input
                  type="number"
                  value={courseFilterMaxSessions}
                  onChange={(e) => setCourseFilterMaxSessions(e.target.value)}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Min Quizzes</label>
                <input
                  type="number"
                  value={courseFilterMinQuizzes}
                  onChange={(e) => setCourseFilterMinQuizzes(e.target.value)}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Max Quizzes</label>
                <input
                  type="number"
                  value={courseFilterMaxQuizzes}
                  onChange={(e) => setCourseFilterMaxQuizzes(e.target.value)}
                  min="0"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={handleResetCourseFilters}>
                  Reset
                </button>
                <button type="button" className="btn btn-primary" onClick={handleApplyCourseFilters}>
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Session Filter Modal */}
      {showSessionFilterModal && (
        <div className="modal-overlay professional-overlay">
          <div className="modal-content professional-content">
            <div className="modal-header professional-header">
              <h3>Filter Sessions</h3>
              <button className="btn-close-modal" onClick={() => setShowSessionFilterModal(false)}>
                ✕
              </button>
            </div>
            <div className="modal-body professional-body">
              <div className="form-group">
                <label>Course</label>
                <select
                  value={selectedCourseForSessionFilter}
                  onChange={(e) => {
                    const courseId = e.target.value;
                    setSelectedCourseForSessionFilter(courseId);
                    setSessionSearch(courseId ? `course:${courseId}` : '');
                  }}
                >
                  <option value="">All Courses</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={handleResetSessionFilters}>
                  Reset
                </button>
                <button type="button" className="btn btn-primary" onClick={handleApplySessionFilters}>
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Filter Modal */}
      {showVideoFilterModal && (
        <div className="modal-overlay professional-overlay">
          <div className="modal-content professional-content">
            <div className="modal-header professional-header">
              <h3>Filter Videos</h3>
              <button className="btn-close-modal" onClick={() => setShowVideoFilterModal(false)}>
                ✕
              </button>
            </div>
            <div className="modal-body professional-body">
              <div className="form-group">
                <label>Session</label>
                <select
                  value={selectedSessionForVideoFilter}
                  onChange={(e) => {
                    const sessionId = e.target.value;
                    setSelectedSessionForVideoFilter(sessionId);
                    setVideoSearch(sessionId ? `session:${sessionId}` : '');
                  }}
                >
                  <option value="">All Sessions</option>
                  {sessions.map((session) => (
                    <option key={session.id} value={session.id}>
                      {session.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={handleResetVideoFilters}>
                  Reset
                </button>
                <button type="button" className="btn btn-primary" onClick={handleApplyVideoFilters}>
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Filter Modal */}
      {showQuizFilterModal && (
        <div className="modal-overlay professional-overlay">
          <div className="modal-content professional-content">
            <div className="modal-header professional-header">
              <h3>Filter Quizzes</h3>
              <button className="btn-close-modal" onClick={() => setShowQuizFilterModal(false)}>
                ✕
              </button>
            </div>
            <div className="modal-body professional-body">
              <div className="form-group">
                <label>Mode</label>
                <select
                  value={selectedModeForQuizFilter}
                  onChange={(e) => {
                    const mode = e.target.value;
                    setSelectedModeForQuizFilter(mode);
                    const courseId = selectedCourseForQuizFilter;
                    let searchValue = '';
                    if (mode) searchValue += `mode:${mode}`;
                    if (courseId) searchValue += (searchValue ? ',' : '') + `course:${courseId}`;
                    setQuizSearch(searchValue);
                  }}
                >
                  <option value="">All Modes</option>
                  <option value="exam">Exam</option>
                  <option value="practice">Practice</option>
                </select>
              </div>
              <div className="form-group">
                <label>Course</label>
                <select
                  value={selectedCourseForQuizFilter}
                  onChange={(e) => {
                    const courseId = e.target.value;
                    setSelectedCourseForQuizFilter(courseId);
                    const mode = selectedModeForQuizFilter;
                    let searchValue = '';
                    if (mode) searchValue += `mode:${mode}`;
                    if (courseId) searchValue += (searchValue ? ',' : '') + `course:${courseId}`;
                    setQuizSearch(searchValue);
                  }}
                >
                  <option value="">All Courses</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={handleResetQuizFilters}>
                  Reset
                </button>
                <button type="button" className="btn btn-primary" onClick={handleApplyQuizFilters}>
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Filter Modal */}
      {showCertificateFilterModal && (
        <div className="modal-overlay professional-overlay">
          <div className="modal-content professional-content">
            <div className="modal-header professional-header">
              <h3>Filter Certificates</h3>
              <button className="btn-close-modal" onClick={() => setShowCertificateFilterModal(false)}>
                ✕
              </button>
            </div>
            <div className="modal-body professional-body">
              <div className="form-group">
                <label>Course</label>
                <select
                  value=""
                  onChange={(e) => {
                    const courseId = e.target.value;
                    setCertificateSearch(courseId ? `course:${courseId}` : '');
                  }}
                >
                  <option value="">All Courses</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCertificateFilterModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={() => setShowCertificateFilterModal(false)}>
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Modal */}
      {showStatsModal && (
        <div className="modal-overlay professional-overlay">
          <div className="modal-content professional-content">
            <div className="modal-header professional-header">
              <h3>Platform Statistics</h3>
              <button className="btn-close-modal" onClick={() => setShowStatsModal(false)}>
                ✕
              </button>
            </div>
            <div className="modal-body professional-body">
              <div className="stats-summary">
                <div className="stat-summary-item">
                  <span className="stat-label">Total Users:</span>
                  <span className="stat-value">{stats?.totalUsers || 0}</span>
                </div>
                <div className="stat-summary-item">
                  <span className="stat-label">Total Courses:</span>
                  <span className="stat-value">{stats?.totalCourses || 0}</span>
                </div>
                <div className="stat-summary-item">
                  <span className="stat-label">Total Enrollments:</span>
                  <span className="stat-value">{stats?.totalEnrollments || 0}</span>
                </div>
                <div className="stat-summary-item">
                  <span className="stat-label">Quiz Attempts:</span>
                  <span className="stat-value">{stats?.totalQuizAttempts || 0}</span>
                </div>
                <div className="stat-summary-item">
                  <span className="stat-label">Certificates Issued:</span>
                  <span className="stat-value">{stats?.totalCertificates || 0}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer professional-footer">
              <button type="button" className="btn btn-primary" onClick={() => setShowStatsModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Questions Modal - Professional Coursera-style */}
      {showQuestionsModal && (
        <div className="modal-overlay questions-modal-overlay">
          <div className="modal-content questions-modal-content">
            <div className="questions-modal-header">
              <div className="questions-modal-title">
                <h3>Quiz Questions</h3>
                <span className="questions-count">{questions.length} questions</span>
              </div>
              <button className="btn-close-modal" onClick={() => setShowQuestionsModal(false)}>
                ✕
              </button>
            </div>

            <div className="questions-modal-body">
              {questions.length === 0 ? (
                <div className="questions-empty-state">
                  <HelpCircle size={48} className="empty-icon" />
                  <h4>No Questions Yet</h4>
                  <p>Start by adding your first question to this quiz</p>
                </div>
              ) : (
                <div className="questions-list">
                  {questions.map((question, index) => (
                    <div key={question.id} className="question-card">
                      <div className="question-header">
                        <span className="question-number-icon">{index + 1}</span>
                        <div className="question-actions">
                          <button 
                            className="btn-icon danger" 
                            title="Delete Question"
                            onClick={() => handleDeleteQuestion(question.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="question-text">
                        {question.text}
                      </div>
                      <div className="question-options">
                        {question.options?.map((option, idx) => (
                          <div key={idx} className={`option-badge ${option.isCorrect ? 'correct' : ''}`}>
                            <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                            <span className="option-text">{option.text}</span>
                            {option.isCorrect && <span className="correct-indicator">✓</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="add-question-section">
                <div className="add-question-header">
                  <h4>Add New Question</h4>
                  <button className="btn btn-primary" onClick={() => setShowAddQuestionForm(!showAddQuestionForm)}>
                    {showAddQuestionForm ? 'Cancel' : '+ Add Question'}
                  </button>
                </div>
                
                {showAddQuestionForm && (
                  <div className="add-question-form">
                    <div className="form-group">
                      <label>Question Text *</label>
                      <textarea
                        placeholder="Enter your question here..."
                        value={newQuestion.text}
                        onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                        rows={3}
                      />
                    </div>
                    
                    <div className="options-container">
                      <label>Answer Options *</label>
                      {newQuestion.options.map((option, idx) => (
                        <div key={idx} className="option-input-row">
                          <div className="option-letter-badge">
                            {String.fromCharCode(65 + idx)}
                          </div>
                          <input
                            type="text"
                            placeholder={`Option ${idx + 1}`}
                            value={option.text}
                            onChange={(e) => {
                              const updatedOptions = [...newQuestion.options];
                              updatedOptions[idx].text = e.target.value;
                              setNewQuestion({ ...newQuestion, options: updatedOptions });
                            }}
                            className="option-input"
                          />
                          <label className="correct-checkbox">
                            <input
                              type="radio"
                              name="correctOption"
                              checked={option.isCorrect}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  const updatedOptions = [...newQuestion.options];
                                  updatedOptions.forEach((opt, i) => {
                                    updatedOptions[i].isCorrect = (i === idx);
                                  });
                                  setNewQuestion({ ...newQuestion, options: updatedOptions });
                                }
                              }}
                            />
                            <span>Correct</span>
                          </label>
                        </div>
                      ))}
                    </div>

                    <div className="form-actions">
                      <button 
                        className="btn btn-secondary" 
                        onClick={() => setShowAddQuestionForm(false)}
                      >
                        Cancel
                      </button>
                      <button 
                        className="btn btn-primary" 
                        onClick={handleCreateQuestion}
                        disabled={!newQuestion.text.trim()}
                      >
                        Add Question
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="questions-modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setShowQuestionsModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="modal-overlay professional-overlay">
          <div className="modal-content professional-content">
            <div className="modal-header professional-header">
              <h3>Edit User</h3>
              <button className="btn-close-modal" onClick={() => setShowEditModal(false)}>
                ✕
              </button>
            </div>
            <div className="modal-body professional-body">
              <form onSubmit={(e) => { e.preventDefault(); handleSaveUserEdit(); }}>
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    value={editFormData.firstName}
                    onChange={(e) => setEditFormData({ ...editFormData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    value={editFormData.lastName}
                    onChange={(e) => setEditFormData({ ...editFormData, lastName: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* User Filter Modal */}
      {showFilterModal && (
        <div className="modal-overlay professional-overlay">
          <div className="modal-content professional-content">
            <div className="modal-header professional-header">
              <h3>Filter Users</h3>
              <button className="btn-close-modal" onClick={() => setShowFilterModal(false)}>
                ✕
              </button>
            </div>
            <div className="modal-body professional-body">
              <div className="form-group">
                <label>Search</label>
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search by name or email..."
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="">All Roles</option>
                  <option value="ADMIN">Admin</option>
                  <option value="LEARNER">Learner</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={handleResetUserFilter}>
                  Reset
                </button>
                <button type="button" className="btn btn-primary" onClick={handleApplyUserFilter}>
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateUserModal && (
        <div className="modal-overlay professional-overlay">
          <div className="modal-content professional-content">
            <div className="modal-header professional-header">
              <h3>Create New User</h3>
              <button className="btn-close-modal" onClick={() => setShowCreateUserModal(false)}>
                ✕
              </button>
            </div>
            <div className="modal-body professional-body">
              <form onSubmit={handleCreateUser}>
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                    placeholder="Enter first name"
                    required
                    autoComplete="off"
                  />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                    placeholder="Enter last name"
                    required
                    autoComplete="off"
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder={newUser.role === 'ADMIN' ? 'admin@learnova.com' : 'learner@gmail.com'}
                    required
                    autoComplete="off"
                  />
                </div>
                <div className="form-group">
                  <label>Password *</label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="Enter password (min 8 characters)"
                    required
                    autoComplete="new-password"
                  />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  >
                    <option value="LEARNER">Learner</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowCreateUserModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={creatingUser}>
                    {creatingUser ? 'Creating...' : 'Create User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Course Detail Modal */}
      {showCourseDetail && selectedCourse && (
        <div className="modal-overlay professional-overlay">
          <div className="modal-content professional-content">
            <div className="modal-header professional-header">
              <h3>Course Details</h3>
              <button className="btn-close-modal" onClick={handleCloseCourseDetail}>
                ✕
              </button>
            </div>
            <div className="modal-body professional-body">
              <div className="course-detail-section">
                <h4>Basic Information</h4>
                <div className="detail-row">
                  <span className="detail-label">Title:</span>
                  <span className="detail-value">{selectedCourse.title}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Description:</span>
                  <span className="detail-value">{selectedCourse.description || 'No description'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Created by:</span>
                  <span className="detail-value">{selectedCourse.creator?.firstName} {selectedCourse.creator?.lastName}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Created at:</span>
                  <span className="detail-value">{new Date(selectedCourse.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="course-detail-section">
                <h4>Course Content</h4>
                <div className="detail-row">
                  <span className="detail-label">Sessions:</span>
                  <span className="detail-value">{courseSessions.length}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Videos:</span>
                  <span className="detail-value">{courseVideos.length}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Quizzes:</span>
                  <span className="detail-value">{courseQuizzes.length}</span>
                </div>
              </div>

              {courseSessions.length > 0 && (
                <div className="course-detail-section">
                  <h4>Sessions List</h4>
                  <div className="detail-list">
                    {courseSessions.map((session) => (
                      <div key={session.id} className="detail-item">
                        <span className="item-title">{session.title}</span>
                        <span className="item-meta">{session.videos?.length || 0} videos</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer professional-footer">
              <button type="button" className="btn btn-secondary" onClick={handleCloseCourseDetail}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
