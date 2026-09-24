import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { learningPathService } from '../services/learningPath.service';
import { courseService } from '../services/course.service';
import { videoService } from '../services/video.service';
import { quizService } from '../services/quiz.service';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../contexts/ToastContext';
import VideoPlayer from '../components/VideoPlayer/VideoPlayer';
import YouTubePlayer from '../components/YouTubePlayer/YouTubePlayer';
import Sidebar from '../components/Sidebar/Sidebar';
import { Award, CheckCircle, HelpCircle, Clock, Lock, PlayCircle, Info, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import './LearningPath.css';

// Helper to extract clean embeddable URLs for YouTube and Vimeo
const getEmbedUrl = (url) => {
  if (!url) return '';
  
  // YouTube matches: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID, youtube.com/shorts/ID
  const ytRegex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]+)/i;
  const ytMatch = url.match(ytRegex);
  
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&rel=0`;
  }
  
  // Vimeo matches: vimeo.com/ID or player.vimeo.com/video/ID
  const vimeoRegex = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/i;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }
  
  return url;
};

// Helper to check if a URL is an embeddable external link (YouTube or Vimeo)
const isEmbeddableVideo = (url) => {
  if (!url) return false;
  return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com');
};

// Helper to format session title (for single session courses, "Session:" instead of "Session 1:")
const formatSessionTitle = (title, totalSessions = 1) => {
  if (!title) return '';
  if (totalSessions <= 1) {
    return title.replace(/^Session\s*1\s*[:\-]\s*/i, 'Session: ');
  }
  return title;
};

// Helper to calculate session duration (videos + reading time)
const getSessionDuration = (session) => {
  if (!session) return null;
  
  // Calculate video duration
  const videoSeconds = (session.videos || []).reduce((sum, video) => {
    return sum + (video.duration || 0);
  }, 0);
  
  // Estimate reading time for session content (500 chars per minute)
  const sessionContentLength = (session.content || '').length;
  const sessionReadingMinutes = Math.ceil(sessionContentLength / 500);
  
  // Estimate reading time for video content (500 chars per minute)
  const videoContentMinutes = (session.videos || []).reduce((sum, video) => {
    const contentLength = (video.content || '').length;
    return sum + Math.ceil(contentLength / 500);
  }, 0);
  
  // Total time in minutes
  const totalMinutes = Math.round(videoSeconds / 60) + sessionReadingMinutes + videoContentMinutes;
  
  if (totalMinutes < 60) {
    return `${totalMinutes} min`;
  } else {
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
};

// Custom lightweight markdown-to-HTML parser for session reading materials
const renderMarkdown = (markdown) => {
  if (!markdown) return '';

  // Remove emojis and pictographs to keep textual content strictly academic and icon-free
  let html = markdown.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{FE00}-\u{FE0F}]/gu, '');

  // 1. Code blocks: ```lang ... ```
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre class="markdown-code-block"><code class="language-${lang}">${code.trim()}</code></pre>`;
  });

  // 2. Inline code: `code`
  html = html.replace(/`([^`\n]+)`/g, '<code class="markdown-inline-code">$1</code>');

  // 3. Headings
  html = html.replace(/^### (.*?)$/gm, '<h4 class="markdown-h4">$1</h4>');
  html = html.replace(/^## (.*?)$/gm, '<h3 class="markdown-h3">$1</h3>');
  html = html.replace(/^# (.*?)$/gm, '<h2 class="markdown-h2">$1</h2>');

  // 4. Bold text: **text**
  html = html.replace(/\*\*([\s\S]*?)\*\*/g, '<strong class="markdown-strong">$1</strong>');

  // 5. Lists (bullet points)
  html = html.replace(/^[-*]\s+(.*?)$/gm, '<li class="markdown-li">$1</li>');
  html = html.replace(/(<li class="markdown-li">[\s\S]*?<\/li>)+/g, '<ul class="markdown-ul">$1</ul>');

  // 6. Blockquotes
  html = html.replace(/^>\s+(.*?)$/gm, '<blockquote class="markdown-blockquote">$1</blockquote>');

  // 7. Paragraphs & Linebreaks
  const lines = html.split(/\n\n+/);
  const processedLines = lines.map(line => {
    const trimmed = line.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('<h') || trimmed.startsWith('<ul') || trimmed.startsWith('<pre') || trimmed.startsWith('<blockquote')) {
      return trimmed;
    }
    return `<p class="markdown-p">${trimmed.replace(/\n/g, '<br />')}</p>`;
  });

  return processedLines.join('');
};

// Active Video Details Section Component (Video Description & Detailed Markdown Notes)
const ActiveVideoDetails = ({ video }) => {
  if (!video) return null;
  return (
    <div className="active-video-details-card">
      {video.description && (
        <div className="active-video-description-container">
          <p className="active-video-description-text">{video.description}</p>
        </div>
      )}
      {video.content && (
        <div className="video-notes-section">
          <div className="video-notes-header">
            <h4 className="video-notes-title">Lecture Study Guide & Notes</h4>
          </div>
          <div
            className="markdown-body video-markdown-content"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(video.content) }}
          />
        </div>
      )}
    </div>
  );
};

function LearningPath() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const [pathData, setPathData] = useState(null);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [finalExamPassed, setFinalExamPassed] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [userAttempts, setUserAttempts] = useState([]);
  const [readingMarked, setReadingMarked] = useState(false);
  const [completedVideoIds, setCompletedVideoIds] = useState(new Set());
  const { user } = useAuth();

  // Tabbed Workspace states
  const [activeTab, setActiveTab] = useState('video'); // 'video' | 'text' | 'quiz' | 'overview'
  const [activeVideoId, setActiveVideoId] = useState(null);
  const previousSessionIdRef = useRef(null);

  const selectSession = useCallback((sessions, sessionParam) => {
    if (!sessions?.length) {
      setCurrentSessionId(null);
      return;
    }

    if (sessionParam) {
      const sessionId = parseInt(sessionParam, 10);
      const matchedSession = sessions.find((session) => session.id === sessionId);
      if (matchedSession) {
        setCurrentSessionId(matchedSession.id);
        return;
      }
    }

    const firstAccessible = sessions.find((session) => session.canAccess || !session.isLocked) || sessions[0];
    setCurrentSessionId(firstAccessible.id);
  }, []);

  const loadPreviewPath = useCallback(async (sessionParam) => {
    const course = await courseService.getById(id);
    const sessions = [...(course.sessions || [])]
      .sort((a, b) => a.orderNumber - b.orderNumber)
      .map((session) => ({
        ...session,
        isCompleted: false,
        isLocked: false,
        canAccess: true,
      }));

    setPathData({
      enrollment: {
        course,
        progress: { percentage: 0 },
      },
      sessions,
      quizUnlocked: false,
      quizzes: course.quizzes || [],
    });
    setPreviewMode(true);
    selectSession(sessions, sessionParam);
  }, [id, selectSession]);

  const loadLearningPath = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const sessionParam = searchParams.get('session');

      try {
        const data = await learningPathService.getCoursePath(id);
        setPathData(data);
        setPreviewMode(false);
        
        // Initialize completedVideoIds from backend data
        const completedIds = new Set();
        data.sessions?.forEach(session => {
          session.videos?.forEach(video => {
            if (video.isCompleted) {
              completedIds.add(video.id);
            }
          });
        });
        setCompletedVideoIds(completedIds);

        // Check if final exam has been passed
        const finalExam = data.quizzes?.find(q => q.isExamMode);
        if (finalExam && userAttempts.length > 0) {
          const finalExamAttempt = userAttempts.find(attempt => attempt.quizId === finalExam.id);
          setFinalExamPassed(finalExamAttempt?.passed || false);
        }

        // Set initial session from URL params or first session
        const sessionParam = searchParams.get('session');
        const nextParam = searchParams.get('next');
        const finalExamParam = searchParams.get('finalExam');
        
        if (finalExamParam === 'true') {
          // Navigate to final exam
          const finalExam = data.quizzes?.find(q => q.isExamMode);
          if (finalExam) {
            window.location.href = `/exam/${finalExam.id}`;
            return;
          } else {
            // No final exam, go to first session
            setCurrentSessionId(data.sessions?.[0]?.id || null);
          }
        } else if (nextParam === 'true') {
          // Navigate to next session in order or first incomplete session
          if (sessionParam) {
            const currentIndex = data.sessions?.findIndex(s => s.id === Number(sessionParam));
            if (currentIndex !== -1 && currentIndex + 1 < data.sessions.length) {
              window.location.href = `/learning-path/${id}?session=${data.sessions[currentIndex + 1].id}`;
              return;
            } else {
              // No next session, stay on current
              setCurrentSessionId(Number(sessionParam));
            }
          } else {
            // Find first incomplete session
            const incompleteSession = data.sessions?.find(session => {
              return !session.videos?.every(video => video.isCompleted);
            });
            
            if (incompleteSession) {
              window.location.href = `/learning-path/${id}?session=${incompleteSession.id}`;
              return;
            } else {
              // All sessions completed, go to first session
              setCurrentSessionId(data.sessions?.[0]?.id || null);
            }
          }
        } else if (sessionParam) {
          setCurrentSessionId(Number(sessionParam));
        } else {
          setCurrentSessionId(data.sessions?.[0]?.id || null);
        }
      } catch (err) {
        const message = err.message?.toLowerCase() || '';
        if (message.includes('enroll')) {
          await loadPreviewPath(sessionParam);
        } else {
          throw err;
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load learning path');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id, loadPreviewPath, searchParams, navigate, selectSession]);

  useEffect(() => {
    loadLearningPath();
  }, [loadLearningPath]);

  const isVideoDone = (video) => {
    if (!video) return false;
    return video.isCompleted || completedVideoIds.has(video.id);
  };

  const isVideoLockedInSession = (video, session = currentSession) => {
    if (!session || !video) return false;
    if (session.isLocked || !session.canAccess) return true;
    const vIdx = session.videos?.findIndex((v) => v.id === video.id);
    if (vIdx <= 0) return false;
    return session.videos.slice(0, vIdx).some((v) => !isVideoDone(v));
  };

  const handleSessionSelect = (sessionId) => {
    const targetSession = pathData?.sessions?.find((s) => s.id === sessionId);
    if (targetSession && (targetSession.isLocked || !targetSession.canAccess)) {
      toast.warning('This session is locked: complete the videos and pass the previous session\'s quiz to access it.');
      return;
    }
    setCurrentSessionId(sessionId);
    navigate(`/learning-path/${id}?session=${sessionId}`, { replace: true });
  };

  const handleQuizTabClick = () => {
    if (!canOpenPracticeQuiz()) {
      toast.warning('You must finish watching all videos before taking the practice quiz.');
      return;
    }
    setActiveTab('quiz');
  };

  const handleEnroll = async () => {
    try {
      setEnrolling(true);
      await courseService.enroll(id);
      setPreviewMode(false);
      await loadLearningPath();
    } catch (err) {
      toast.error(err.message || 'Failed to enroll in course. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  const areAllVideosCompleted = () => {
    if (!currentSession?.videos || currentSession.videos.length === 0) return true;
    return currentSession.videos.every((video) => isVideoDone(video));
  };

  const hasWatchedEnoughVideo = () => {
    return areAllVideosCompleted();
  };

  const handleCompleteSession = async (sessionId) => {
    if (previewMode) {
      handleEnroll();
      return;
    }

    try {
      await learningPathService.completeSession(sessionId);
      await loadLearningPath();
    } catch (err) {
      toast.error(err.message || 'Error completing session');
    }
  };

  const handleVideoProgress = async () => {
    if (!activeVideoId || previewMode) return;
    try {
      await videoService.updateWatchProgress(activeVideoId, 0, false);
    } catch (err) {
      console.error('Failed to update watch progress:', err);
    }
  };

  const handleVideoEnded = async () => {
    const currentVid = activeVideo;
    if (!currentVid || previewMode) return;

    try {
      // 1. Immediately unlock locally so UI transitions and locks open instantaneously
      setCompletedVideoIds((prev) => new Set([...prev, currentVid.id]));

      // 2. Persist watch progress in backend
      await videoService.updateWatchProgress(
        currentVid.id,
        Math.max(Math.round(currentVid.duration || 0), 1),
        true,
      );

      const currentVideoIndex = currentSession?.videos?.findIndex((v) => v.id === currentVid.id);
      const nextVideo = currentSession?.videos?.[currentVideoIndex + 1];

      // 3. Immediately switch to next video if available
      if (nextVideo) {
        toast.success(`Video completed! Moving to next chapter: ${nextVideo.title}`);
        setActiveVideoId(nextVideo.id);
      } else {
        // Last video in the session completed
        toast.success('All videos in this session are completed!');
        if (hasQuiz && !sessionQuizPassed) {
          toast.info('Pass the practice quiz (≥ 70%) to validate this session.');
          setActiveTab('quiz');
        } else if (hasContent && !currentSession?.readingCompleted && !readingMarked) {
          toast.info('Read the course notes to complete your learning.');
          setActiveTab('text');
        } else {
          toast.success('All requirements for this session are completed!');
        }
      }

      // 4. Sync session completion in background
      await learningPathService.tryAutoComplete(currentSessionId);
      await loadLearningPath();
    } catch (err) {
      console.error('Failed to mark video as completed:', err);
    }
  };

  const handleReadingScroll = async (e) => {
    if (previewMode || !currentSessionId || readingMarked || currentSession?.readingCompleted) {
      return;
    }
    const el = e.target;
    const scrolledRatio = (el.scrollTop + el.clientHeight) / el.scrollHeight;
    if (scrolledRatio >= 0.75) {
      setReadingMarked(true);
      try {
        await learningPathService.trackReadingComplete(currentSessionId);
        await loadLearningPath();
        
        if (hasQuiz && !sessionQuizPassed) {
          toast.success('Reading notes completed! You can now take the practice quiz to unlock the next session.');
          setActiveTab('quiz');
        } else {
          toast.success('Reading notes completed!');
        }
      } catch (err) {
        console.error('Failed to track reading completion:', err);
        setReadingMarked(false);
      }
    }
  };

  const currentSession = pathData?.sessions?.find((session) => session.id === currentSessionId);
  const currentSessionIndex = pathData?.sessions?.findIndex((s) => s.id === currentSessionId);
  const nextSession = pathData?.sessions?.[currentSessionIndex + 1];
  const prevSession = currentSessionIndex > 0 ? pathData?.sessions?.[currentSessionIndex - 1] : null;
  const progressPercentage = Math.round(pathData?.enrollment?.progress?.percentage || 0);
  const courseTitle = pathData?.enrollment?.course?.title || 'Course';
  const quizzes = pathData?.quizzes || pathData?.enrollment?.course?.quizzes || [];
  const orderedCourseQuizzes = [...quizzes].sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
  const passedQuizIds = new Set((userAttempts || []).filter((attempt) => attempt.passed).map((attempt) => attempt.quizId));

  const sessionQuiz = currentSession?.sessionQuiz || quizzes.find((quiz) => {
    if (quiz.isExamMode || !currentSession) return false;
    if (quiz.sessionId) return quiz.sessionId === currentSession.id;
    const quizTitle = quiz.title.toLowerCase();
    const sessionTitle = currentSession.title.toLowerCase();
    return quizTitle.includes(sessionTitle) ||
           sessionTitle.includes(quizTitle.replace('quiz', '').trim());
  });

  const sessionQuizPassed = !sessionQuiz || passedQuizIds.has(sessionQuiz.id);

  const canOpenPracticeQuiz = () => {
    // Practice quiz is unlocked ONLY when ALL videos in current session are completed
    return areAllVideosCompleted();
  };

  const canOpenAssessment = (quiz) => {
    const index = orderedCourseQuizzes.findIndex((item) => item.id === quiz.id);
    if (index <= 0) return true;

    const previousQuizzes = orderedCourseQuizzes.slice(0, index);
    return previousQuizzes.every((previousQuiz) => passedQuizIds.has(previousQuiz.id));
  };

  const fetchAttempts = useCallback(async () => {
    if (!user?.id) {
      setUserAttempts([]);
      return;
    }

    try {
      const attempts = await quizService.getMyAttempts(user.id);
      setUserAttempts(attempts || []);
    } catch (err) {
      console.error('Failed to load quiz attempts:', err);
      setUserAttempts([]);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchAttempts();
  }, [fetchAttempts]);

  // Reload learning path data when user returns from quiz
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !loading) {
        fetchAttempts();
        loadLearningPath();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [fetchAttempts, loadLearningPath, loading]);

  const hasVideos = currentSession?.videos && currentSession.videos.length > 0;
  const hasContent = !!currentSession?.content;
  const hasQuiz = !!sessionQuiz;
  const activeVideo = currentSession?.videos?.find(v => v.id === activeVideoId) || currentSession?.videos?.[0];
  const activeVideoIndex = currentSession?.videos?.findIndex((v) => v.id === activeVideo?.id);
  const prevVideoInSession = activeVideoIndex > 0 ? currentSession?.videos?.[activeVideoIndex - 1] : null;
  const nextVideoInSession = activeVideoIndex >= 0 && activeVideoIndex < ((currentSession?.videos?.length || 0) - 1)
    ? currentSession?.videos?.[activeVideoIndex + 1]
    : null;
  const canAccessCurrentSession = !!currentSession && (currentSession.canAccess || currentSession.isCompleted || !currentSession.isLocked);
  const allVideosWatched = (currentSession?.videos || []).length === 0 || (currentSession?.videos || []).every((video) => video.isCompleted);
  const canOpenSessionQuiz = hasQuiz && allVideosWatched;

  useEffect(() => {
    setReadingMarked(!!currentSession?.readingCompleted);
  }, [currentSessionId, currentSession?.readingCompleted]);

  // Update completedVideoIds when changing sessions to include current session's completed videos
  useEffect(() => {
    if (currentSession && currentSession.videos) {
      setCompletedVideoIds(prev => {
        const updated = new Set(prev);
        // Only add completed videos from current session, don't remove others
        currentSession.videos.forEach(video => {
          if (video.isCompleted) {
            updated.add(video.id);
          }
        });
        return updated;
      });
    }
  }, [currentSessionId, currentSession]);

  useEffect(() => {
    if (!currentSession) return;

    const sessionChanged = previousSessionIdRef.current !== currentSessionId;
    if (sessionChanged) {
      previousSessionIdRef.current = currentSessionId;
      if (currentSession.videos && currentSession.videos.length > 0) {
        setActiveTab('video');
        // Find first incomplete video, or default to video 0
        const firstIncomplete = currentSession.videos.find(v => !isVideoDone(v) && !isVideoLockedInSession(v, currentSession)) || currentSession.videos[0];
        setActiveVideoId(firstIncomplete.id);
      } else if (currentSession.content) {
        setActiveTab('text');
        setActiveVideoId(null);
      } else {
        setActiveTab('overview');
        setActiveVideoId(null);
      }
    } else {
      // Same session: ensure activeVideoId exists in currentSession.videos
      if (currentSession.videos && currentSession.videos.length > 0) {
        const videoExists = currentSession.videos.some(v => v.id === activeVideoId);
        if (!videoExists && activeVideoId !== null) {
          setActiveVideoId(currentSession.videos[0].id);
        }
      }
    }
  }, [currentSessionId, currentSession]);

  // Auto-mark reading as complete if content is short when opening text tab
  useEffect(() => {
    if (activeTab === 'text' && hasContent && !readingMarked && !currentSession?.readingCompleted) {
      const contentLength = (currentSession?.content || '').length;
      // If content is short (less than 500 characters), mark as complete automatically
      if (contentLength < 500) {
        setReadingMarked(true);
        learningPathService.trackReadingComplete(currentSessionId)
          .then(() => loadLearningPath())
          .catch(err => {
            console.error('Failed to mark reading complete:', err);
            setReadingMarked(false);
          });
      }
    }
  }, [activeTab, hasContent, currentSession, readingMarked, currentSessionId, loadLearningPath]);

  if (loading) {
    return (
      <div className="learning-path-container">
        <div className="loading">
          <div className="spinner"></div>
          <span>Loading learning path...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="learning-path-container learning-path-error">
        <div className="alert alert-danger">{error}</div>
        <Link to={`/courses/${id}`} className="btn btn-secondary">Back to course</Link>
      </div>
    );
  }

  return (
    <div className="learning-path-container">
      <Sidebar
        sessions={pathData?.sessions || []}
        activeSessionId={currentSessionId}
        activeVideoId={activeVideoId}
        onSessionSelect={handleSessionSelect}
        onVideoSelect={(vidId) => {
          const targetVid = currentSession?.videos?.find((v) => v.id === vidId);
          if (targetVid && isVideoLockedInSession(targetVid, currentSession)) {
            toast.warning('You must complete the previous video before accessing this chapter.');
            return;
          }
          setActiveVideoId(vidId);
        }}
        onSessionLockedClick={() => {
          toast.warning('This session is locked: complete all videos and pass the previous session quiz.');
        }}
        onVideoLockedClick={() => {
          toast.warning('This chapter is locked: complete the previous video to access it.');
        }}
        quizzes={quizzes}
      />

      <div className="learning-path-content">
        <div className="learning-path-header">
          <Link to={`/courses/${id}`} className="back-link">
            ← Back to course
          </Link>
          <h1 className="course-title">{courseTitle}</h1>
          {!previewMode && (
            <div className="progress-bar-container">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <span className="progress-text">{progressPercentage}% Complete</span>
            </div>
          )}
        </div>

        {previewMode && (
          <div className="enroll-banner">
            <div className="enroll-banner-content">
              <div className="enroll-banner-icon" aria-hidden="true">
                <Lock size={20} />
              </div>
              <div>
                <p className="enroll-banner-title">You are previewing this course</p>
                <p className="enroll-banner-text">
                  Enroll for free to save your progress, complete sessions, and unlock the certificate.
                </p>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-primary enroll-banner-btn"
              onClick={handleEnroll}
              disabled={enrolling}
            >
              {enrolling ? 'Enrolling...' : 'Enroll Now — Free'}
            </button>
          </div>
        )}

        {currentSession ? (
          <div className="session-content">
            <h2 className="session-title">
              {formatSessionTitle(currentSession.title, pathData?.sessions?.length)}
            </h2>
            
            {/* Navigation Tabs (Udemy/Coursera style) */}
            <div className="session-tabs">
              {hasVideos && (
                <button
                  type="button"
                  className={`session-tab-btn ${activeTab === 'video' ? 'active' : ''}`}
                  onClick={() => setActiveTab('video')}
                >
                  <PlayCircle size={18} /> Video Lectures
                </button>
              )}
              {hasContent && (
                <button
                  type="button"
                  className={`session-tab-btn ${activeTab === 'text' ? 'active' : ''}`}
                  onClick={() => setActiveTab('text')}
                >
                  <BookOpen size={18} /> Reading Notes
                </button>
              )}
              <button
                type="button"
                className={`session-tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
                onClick={handleQuizTabClick}
              >
                <HelpCircle size={18} /> Practice Quiz
              </button>
              <button
                type="button"
                className={`session-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <Info size={18} /> Overview
              </button>
            </div>

            {/* Tab Panes */}
            <div className="tab-viewport">
              
              {/* VIDEO TAB */}
              {activeTab === 'video' && hasVideos && (
                <div className="tab-pane-content video-tab-pane">
                  {currentSession.videos.length > 1 ? (
                    <div className="multi-video-layout">
                      <div className="main-video-viewport">
                        <div className="active-video-header">
                          <h4 className="active-video-title">{activeVideo?.title}</h4>
                        </div>
                        {activeVideo?.url && (
                          !isEmbeddableVideo(activeVideo.url) ? (
                            <VideoPlayer video={activeVideo} onProgressUpdate={handleVideoProgress} onVideoEnded={handleVideoEnded} />
                          ) : (
                            <YouTubePlayer video={activeVideo} onVideoEnded={handleVideoEnded} />
                          )
                        )}
                        {activeVideo?.isCompleted && (
                          <div className="video-status-badge completed">
                            <CheckCircle size={16} /> Video completed
                          </div>
                        )}
                        <ActiveVideoDetails video={activeVideo} />

                        {/* Video Controls & Next Step Button */}
                        <div className="video-bottom-controls">
                          {prevVideoInSession ? (
                            <button
                              type="button"
                              className="btn btn-secondary btn-video-step"
                              onClick={() => setActiveVideoId(prevVideoInSession.id)}
                            >
                              <ChevronLeft size={16} /> Previous chapter
                            </button>
                          ) : prevSession ? (
                            <button
                              type="button"
                              className="btn btn-secondary btn-video-step"
                              onClick={() => handleSessionSelect(prevSession.id)}
                            >
                              <ChevronLeft size={16} /> Previous session
                            </button>
                          ) : null}
                          
                          {nextVideoInSession ? (
                            <button
                              type="button"
                              className={`btn ${isVideoDone(activeVideo) ? 'btn-primary' : 'btn-secondary'} btn-video-step`}
                              disabled={!isVideoDone(activeVideo)}
                              onClick={() => {
                                if (isVideoDone(activeVideo)) {
                                  setActiveVideoId(nextVideoInSession.id);
                                }
                              }}
                              title={!isVideoDone(activeVideo) ? 'Complete the video to unlock the next chapter' : 'Next chapter'}
                              style={{ marginLeft: 'auto' }}
                            >
                              <span>Next chapter</span>
                              <ChevronRight size={16} />
                            </button>
                          ) : nextSession ? (
                            <button
                              type="button"
                              className={`btn ${isVideoDone(activeVideo) ? 'btn-primary' : 'btn-secondary'} btn-video-step`}
                              disabled={!isVideoDone(activeVideo)}
                              onClick={() => {
                                if (!isVideoDone(activeVideo)) return;
                                if (hasQuiz && !sessionQuizPassed) {
                                  toast.info('Pass the practice quiz (≥ 70%) to validate and unlock the next session.');
                                  setActiveTab('quiz');
                                  return;
                                }
                                if (hasContent && !currentSession?.readingCompleted && !readingMarked) {
                                  toast.info('Read the course notes to complete your learning.');
                                  setActiveTab('text');
                                  return;
                                }
                                handleSessionSelect(nextSession.id);
                              }}
                              title={!isVideoDone(activeVideo) ? 'Complete the video to unlock the next session' : 'Next session'}
                              style={{ marginLeft: 'auto' }}
                            >
                              <span>Next session</span>
                              <ChevronRight size={16} />
                            </button>
                          ) : isVideoDone(activeVideo) ? (
                            hasQuiz && !sessionQuizPassed ? (
                              <button
                                type="button"
                                className="btn btn-primary btn-video-step"
                                onClick={handleQuizTabClick}
                                style={{ marginLeft: 'auto' }}
                              >
                                <span>Proceed to Practice Quiz →</span>
                              </button>
                            ) : hasContent && !currentSession?.readingCompleted ? (
                              <button
                                type="button"
                                className="btn btn-primary btn-video-step"
                                onClick={() => setActiveTab('text')}
                                style={{ marginLeft: 'auto' }}
                              >
                                <span>Read Course Notes →</span>
                              </button>
                            ) : (pathData?.finalExamUnlocked || finalExamPassed) ? (
                              <button
                                type="button"
                                className="btn btn-primary btn-video-step"
                                onClick={() => {
                                  const exam = quizzes.find(q => q.isExamMode);
                                  if (exam) navigate(`/exam/${exam.id}`);
                                  else navigate(`/certificates`);
                                }}
                                style={{ marginLeft: 'auto' }}
                              >
                                <span>Final Exam & Certification →</span>
                              </button>
                            ) : null
                          ) : null}
                        </div>
                      </div>
                      
                      <div className="video-playlist-sidebar">
                        <div className="session-duration-header">
                          <Clock size={14} />
                          <span>Session Duration: {getSessionDuration(currentSession)}</span>
                        </div>
                        <h4 className="playlist-title">Session Chapters</h4>
                        <div className="playlist-items">
                          {currentSession.videos.map((vid, idx) => {
                            const isDone = isVideoDone(vid);
                            const isLockedVideo = isVideoLockedInSession(vid, currentSession);

                            return (
                              <div
                                key={vid.id}
                                className={`playlist-chapter ${vid.id === activeVideoId ? 'active' : ''} ${isLockedVideo ? 'locked' : ''} ${isDone ? 'completed' : ''}`}
                                onClick={() => {
                                  if (isLockedVideo) {
                                    toast.warning('You must complete the previous video before accessing this chapter.');
                                    return;
                                  }
                                  setActiveVideoId(vid.id);
                                }}
                                style={{ opacity: isLockedVideo ? 0.6 : 1, cursor: isLockedVideo ? 'not-allowed' : 'pointer' }}
                              >
                                <span className="chapter-title">{vid.title}</span>
                                {isDone ? (
                                  <CheckCircle size={14} style={{ color: '#10b981', marginLeft: 'auto', flexShrink: 0 }} />
                                ) : isLockedVideo ? (
                                  <Lock size={14} style={{ color: '#94a3b8', marginLeft: 'auto', flexShrink: 0 }} />
                                ) : null}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Single Video Layout
                    <div className="single-video-layout">
                      <div className="main-video-viewport">
                        <div className="active-video-header">
                          <h4 className="active-video-title">{currentSession.videos[0]?.title}</h4>
                        </div>
                        {currentSession.videos[0]?.url && (
                          !isEmbeddableVideo(currentSession.videos[0].url) ? (
                            <VideoPlayer video={currentSession.videos[0]} onProgressUpdate={handleVideoProgress} onVideoEnded={handleVideoEnded} />
                          ) : (
                            <YouTubePlayer video={currentSession.videos[0]} onVideoEnded={handleVideoEnded} />
                          )
                        )}
                        {currentSession.videos[0]?.isCompleted && (
                          <div className="video-status-badge completed">
                            <CheckCircle size={16} /> Video completed
                          </div>
                        )}
                        <ActiveVideoDetails video={activeVideo} />

                        {/* Video Controls for single video */}
                        <div className="video-bottom-controls">
                          {prevSession && (
                            <button
                              type="button"
                              className="btn btn-secondary btn-video-step"
                              onClick={() => handleSessionSelect(prevSession.id)}
                            >
                              <ChevronLeft size={16} /> Previous session
                            </button>
                          )}

                          {nextSession ? (
                            <button
                              type="button"
                              className={`btn ${isVideoDone(currentSession.videos[0]) ? 'btn-primary' : 'btn-secondary'} btn-video-step`}
                              disabled={!isVideoDone(currentSession.videos[0])}
                              onClick={() => {
                                if (!isVideoDone(currentSession.videos[0])) return;
                                if (hasQuiz && !sessionQuizPassed) {
                                  toast.info('Pass the practice quiz (≥ 70%) to validate and unlock the next session.');
                                  setActiveTab('quiz');
                                  return;
                                }
                                if (hasContent && !currentSession?.readingCompleted && !readingMarked) {
                                  toast.info('Read the course notes to complete your learning.');
                                  setActiveTab('text');
                                  return;
                                }
                                handleSessionSelect(nextSession.id);
                              }}
                              title={!isVideoDone(currentSession.videos[0]) ? 'Complete the video to unlock the next session' : 'Next session'}
                              style={{ marginLeft: 'auto' }}
                            >
                              <span>Next session</span>
                              <ChevronRight size={16} />
                            </button>
                          ) : isVideoDone(currentSession.videos[0]) ? (
                            hasQuiz && !sessionQuizPassed ? (
                              <button
                                type="button"
                                className="btn btn-primary btn-video-step"
                                onClick={handleQuizTabClick}
                                style={{ marginLeft: 'auto' }}
                              >
                                <span>Proceed to Practice Quiz →</span>
                              </button>
                            ) : hasContent && !currentSession?.readingCompleted ? (
                              <button
                                type="button"
                                className="btn btn-primary btn-video-step"
                                onClick={() => setActiveTab('text')}
                                style={{ marginLeft: 'auto' }}
                              >
                                <span>Read Course Notes →</span>
                              </button>
                            ) : (pathData?.finalExamUnlocked || finalExamPassed) ? (
                              <button
                                type="button"
                                className="btn btn-primary btn-video-step"
                                onClick={() => {
                                  const exam = quizzes.find(q => q.isExamMode);
                                  if (exam) navigate(`/exam/${exam.id}`);
                                  else navigate(`/certificates`);
                                }}
                                style={{ marginLeft: 'auto' }}
                              >
                                <span>Final Exam & Certification →</span>
                              </button>
                            ) : null
                          ) : null}
                        </div>
                      </div>
                      
                      <div className="video-playlist-sidebar">
                        <div className="session-duration-header">
                          <Clock size={14} />
                          <span>Session Duration: {getSessionDuration(currentSession)}</span>
                        </div>
                        <h4 className="playlist-title">Session Chapters</h4>
                        <div className="playlist-items">
                          {currentSession.videos.map((vid, idx) => {
                            const isDone = isVideoDone(vid);
                            const isLockedVideo = isVideoLockedInSession(vid, currentSession);

                            return (
                              <div
                                key={vid.id}
                                className={`playlist-chapter ${vid.id === activeVideoId ? 'active' : ''} ${isLockedVideo ? 'locked' : ''} ${isDone ? 'completed' : ''}`}
                                onClick={() => {
                                  if (isLockedVideo) {
                                    toast.warning('You must complete the previous video before accessing this chapter.');
                                    return;
                                  }
                                  setActiveVideoId(vid.id);
                                }}
                                style={{ opacity: isLockedVideo ? 0.6 : 1, cursor: isLockedVideo ? 'not-allowed' : 'pointer' }}
                              >
                                <span className="chapter-title">{vid.title}</span>
                                {isDone ? (
                                  <CheckCircle size={14} style={{ color: '#10b981', marginLeft: 'auto', flexShrink: 0 }} />
                                ) : isLockedVideo ? (
                                  <Lock size={14} style={{ color: '#94a3b8', marginLeft: 'auto', flexShrink: 0 }} />
                                ) : null}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TEXT/READING TAB */}
              {activeTab === 'text' && hasContent && (
                <div 
                  className="tab-pane-content reading-tab-pane" 
                  onScroll={handleReadingScroll}
                  ref={(el) => {
                    if (el) {
                      const canScroll = el.scrollHeight > el.clientHeight;
                      
                      // If content is too short to scroll, mark as complete automatically
                      if (!canScroll && !readingMarked && !currentSession?.readingCompleted) {
                        setReadingMarked(true);
                        learningPathService.trackReadingComplete(currentSessionId);
                      }
                    }
                  }}
                >
                  {!currentSession.readingCompleted && !readingMarked && (
                    <div className="reading-progress-hint">
                      Scroll through all reading notes to mark this section complete.
                    </div>
                  )}
                  {(currentSession.readingCompleted || readingMarked) && (
                    <div className="reading-status-badge completed">
                      <CheckCircle size={16} /> Reading notes completed
                    </div>
                  )}
                  <div 
                    className="markdown-body" 
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(currentSession.content) }} 
                  />
                </div>
              )}

              {/* QUIZ TAB */}
              {activeTab === 'quiz' && (
                <div className="tab-pane-content quiz-tab-pane">
                  <div className="session-quiz-card card">
                    <div className="quiz-card-header">
                      <div className="quiz-badge">Session Evaluation</div>
                      <h3 className="quiz-title-main">
                        {sessionQuiz ? sessionQuiz.title : `Knowledge Check: ${formatSessionTitle(currentSession.title, pathData?.sessions?.length)}`}
                      </h3>
                    </div>
                    
                    <div className="quiz-details-grid">
                      <div className="quiz-detail-item">
                        <Clock size={18} />
                        <div>
                          <span className="detail-label">Duration</span>
                          <span className="detail-value">{sessionQuiz?.timeLimitMinutes || 10} Mins</span>
                        </div>
                      </div>
                      <div className="quiz-detail-item">
                        <HelpCircle size={18} />
                        <div>
                          <span className="detail-label">Evaluation</span>
                          <span className="detail-value">Practice Mode</span>
                        </div>
                      </div>
                      <div className="quiz-detail-item">
                        <Award size={18} />
                        <div>
                          <span className="detail-label">Passing Score</span>
                          <span className="detail-value">{sessionQuiz?.passingScore || 70}%</span>
                        </div>
                      </div>
                    </div>

                    <p className="quiz-card-description">
                      {sessionQuiz?.description || `Test your understanding of "${formatSessionTitle(currentSession.title, pathData?.sessions?.length)}". 3 questions • Unlimited attempts • Pass to unlock next steps.`}
                    </p>

                    <div className="quiz-card-actions">
                      <button
                        type="button"
                        disabled={previewMode || !canAccessCurrentSession || !canOpenPracticeQuiz()}
                        onClick={() => {
                          if (sessionQuiz?.id) {
                            navigate(`/quiz/${sessionQuiz.id}`);
                          } else {
                            toast.error('No practice quiz available for this session yet.');
                          }
                        }}
                        className="btn btn-primary start-quiz-btn"
                      >
                        {canOpenPracticeQuiz() ? 'Take Practice Quiz (+25 XP)' : 'Complete session first'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <div className="tab-pane-content overview-tab-pane">
                  <div className="overview-section">
                    <h3 className="pane-section-title">Session Description</h3>
                    <p className="session-description-text">
                      {currentSession.description || 'No description available for this session.'}
                    </p>
                  </div>
                  
                  <div className="overview-section">
                    <h3 className="pane-section-title">Learning Rewards & Info</h3>
                    <div className="metrics-grid">
                      <div className="metric-box">
                        <Award size={20} className="metric-icon primary" />
                        <div>
                          <span className="metric-value">10 XP</span>
                          <span className="metric-label">Reward Points</span>
                        </div>
                      </div>
                      <div className="metric-box">
                        <PlayCircle size={20} className="metric-icon secondary" />
                        <div>
                          <span className="metric-value">{currentSession.videos?.length || 0}</span>
                          <span className="metric-label">Lectures</span>
                        </div>
                      </div>
                      <div className="metric-box">
                        <BookOpen size={20} className="metric-icon accent" />
                        <div>
                          <span className="metric-value">{currentSession.content ? '1 Article' : 'None'}</span>
                          <span className="metric-label">Reading Notes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions Bar */}
            <div className="session-actions">
              {previewMode ? (
                <button
                  type="button"
                  onClick={handleEnroll}
                  className="btn btn-primary enroll-btn-large"
                  disabled={enrolling}
                >
                  {enrolling ? 'Enrolling...' : 'Enroll in course to track your progress'}
                </button>
              ) : (currentSession.isCompleted || (areAllVideosCompleted() && sessionQuizPassed)) ? (
                <div className="completion-controls">
                  <div className="tag tag-success session-complete-tag">
                    <CheckCircle size={18} /> Chapter completed successfully (+10 XP)
                  </div>
                  {nextSession && (!nextSession.isLocked && nextSession.canAccess) ? (
                    <button
                      type="button"
                      onClick={() => handleSessionSelect(nextSession.id)}
                      className="btn btn-secondary next-session-btn"
                    >
                      Next session ({nextSession.title}) →
                    </button>
                  ) : pathData?.finalExamUnlocked && pathData?.quizzes?.some(q => q.isExamMode) ? (
                    <button
                      type="button"
                      onClick={() => {
                        const finalExam = pathData.quizzes.find(q => q.isExamMode);
                        if (finalExam) navigate(`/exam/${finalExam.id}`);
                      }}
                      className="btn btn-primary final-quiz-btn"
                    >
                      Take Final Certification Exam →
                    </button>
                  ) : null}
                </div>
              ) : (
                <div className="session-progress-hint">
                  <p>Requirements to unlock the next session:</p>
                  <div className="chapter-checklist">
                    <span className={areAllVideosCompleted() ? 'done' : 'pending'}>
                      {areAllVideosCompleted() ? '✓' : '○'} All videos watched ({currentSession.videos?.filter(v => isVideoDone(v)).length || 0}/{currentSession.videos?.length || 0})
                    </span>
                    {hasContent && (
                      <span className={(currentSession.readingCompleted || readingMarked) ? 'done' : 'pending'}>
                        {(currentSession.readingCompleted || readingMarked) ? '✓' : '○'} Reading notes
                      </span>
                    )}
                    {hasQuiz && (
                      <span className={sessionQuizPassed ? 'done' : 'pending'}>
                        {sessionQuizPassed ? '✓' : '○'} Practice quiz passed successfully (≥ 70%)
                      </span>
                    )}
                  </div>
                  {areAllVideosCompleted() && hasQuiz && !sessionQuizPassed && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('quiz')}
                      className="btn btn-primary start-quiz-cta-btn"
                      style={{ marginTop: '0.85rem' }}
                    >
                      Take Practice Quiz to unlock next session →
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="no-session">
            <Info size={48} className="no-session-icon" />
            <p>Select a session from the curriculum sidebar to begin learning.</p>
          </div>
        )}

        {/* Global Evaluations and Exams section (Coursera / Udemy Style) */}
        <div className="quiz-section card final-assessment-card">
          <h3 className="quiz-section-title">
            <Award size={22}/> Course Final Exam & Official Certification
          </h3>
          
          {!previewMode && !pathData?.finalExamUnlocked && (
            <div className="alert alert-warning quiz-locked-message">
              <Lock size={18} />
              <span>Pass all session practice quizzes to unlock the Final Certification Exam (40 questions, max 3 attempts).</span>
            </div>
          )}

          {previewMode && (
            <div className="alert alert-warning quiz-locked-message">
              <Lock size={18} />
              <span>Enroll in the course to gain access to the quizzes, final exam, and certificate.</span>
            </div>
          )}

          {/* Certificate Claim Banner when final exam passed */}
          {finalExamPassed && (
            <div className="certificate-unlocked-banner">
              <div className="cert-banner-content">
                <Award size={36} className="cert-banner-icon" />
                <div>
                  <h4>Congratulations! Course Requirements Fulfilled</h4>
                  <p>You have completed all sessions. View your official Coursera/Udemy-level Certificate of Completion now!</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate(`/certificates`)}
                className="btn btn-primary btn-claim-certificate"
              >
                View Official Certificate 
              </button>
            </div>
          )}
          
          <div className="quiz-list">
            {(quizzes && quizzes.length > 0 ? quizzes : [
              { id: 1, title: `Final Certification Exam: ${courseTitle}`, isExamMode: true, timeLimitMinutes: 30 }
            ]).map((quiz) => {
              // Find the session associated with this quiz
              const associatedSession = quiz.sessionId ? pathData?.sessions?.find(s => s.id === quiz.sessionId) : null;
              const sessionCompleted = associatedSession?.progress?.percentage === 100;
              
              // Check if all videos and reading are completed for practice quiz
              const allVideosCompleted = associatedSession?.videos?.every(video => video.isCompleted) || false;
              const readingCompleted = associatedSession?.readingCompleted || false;
              const canTakePracticeQuiz = allVideosCompleted && readingCompleted;
              
              // Check if ALL practice quizzes are passed for final exam
              const practiceQuizzes = quizzes.filter(q => !q.isExamMode);
              const allPracticeQuizzesPassed = practiceQuizzes.length === 0 || practiceQuizzes.every(q => passedQuizIds.has(q.id));
              const canTakeFinalExam = allPracticeQuizzesPassed;
              
              return (
                <div key={quiz.id} className="quiz-list-item">
                  <div className="quiz-item-info">
                    <h4 className="quiz-item-title">
                      <Award size={18} className={quiz.isExamMode ? "exam-icon" : "quiz-icon"} />
                      {quiz.title}
                    </h4>
                    <span className="quiz-item-meta">
                      {quiz.isExamMode ? `Final Timed Exam (${quiz.timeLimitMinutes || 30} mins) • Unlocks Certificate & +100 XP` : 'Practice Assessment'}
                    </span>
                  </div>
                  <button
                    type="button"
                    disabled={
                      previewMode || 
                      (!canTakeFinalExam && quiz.isExamMode) ||
                      (!quiz.isExamMode && !canTakePracticeQuiz)
                    }
                    onClick={() => navigate(quiz.isExamMode ? `/exam/${quiz.id}` : `/quiz/${quiz.id}`)}
                    className={`btn ${quiz.isExamMode ? 'btn-primary' : 'btn-secondary'} btn-sm action-quiz-btn`}
                  >
                    {quiz.isExamMode ? 'Take Final Exam (+100 XP)' : (canTakePracticeQuiz ? 'Take Practice Quiz (+25 XP)' : 'Complete session first')}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LearningPath;
