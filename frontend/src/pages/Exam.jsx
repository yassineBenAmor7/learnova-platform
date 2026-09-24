import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { quizService } from '../services/quiz.service';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Clock, AlertTriangle, Flame, Award } from 'lucide-react';
import './Exam.css';

function Exam() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { error: toastError, success: toastSuccess, warning: toastWarning } = useToast();
  const [quiz, setQuiz] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [examStarted, setExamStarted] = useState(false);
  const [result, setResult] = useState(null);
  const [showReview, setShowReview] = useState(false);
  const [examBlocked, setExamBlocked] = useState(false);
  const [blockReason, setBlockReason] = useState(null);
  const [generatingCert, setGeneratingCert] = useState(false);

  const endTimeRef = useRef(null);
  const hasAutoSubmittedRef = useRef(false);
  const handleSubmitRef = useRef();

  useEffect(() => {
    loadExam();
  }, [id]);

  // Manage body class for Coursera/Udemy distraction-free exam mode
  useEffect(() => {
    if (examStarted && !result) {
      document.body.classList.add('exam-session-active');
    } else {
      document.body.classList.remove('exam-session-active');
    }
    return () => {
      document.body.classList.remove('exam-session-active');
    };
  }, [examStarted, result]);

  // Keep handleSubmitRef current to avoid stale closures
  handleSubmitRef.current = () => handleSubmit();

  // Rock-solid drift-proof countdown timer
  useEffect(() => {
    if (!examStarted || result || !endTimeRef.current) return;

    const tick = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.round((endTimeRef.current - now) / 1000));
      setTimeLeft(remaining);

      if (remaining <= 0) {
        if (!hasAutoSubmittedRef.current) {
          hasAutoSubmittedRef.current = true;
          if (toastWarning) {
            toastWarning('Time has expired! Submitting your exam automatically...', 6000);
          }
          if (handleSubmitRef.current) {
            handleSubmitRef.current();
          }
        }
      }
    };

    tick();
    const intervalId = setInterval(tick, 1000);
    return () => clearInterval(intervalId);
  }, [examStarted, result]);

  const loadExam = async () => {
    try {
      setLoading(true);
      const quizData = await quizService.getForLearner(id);
      
      console.log('=== EXAM LOADING DEBUG ===');
      console.log('Exam ID:', id);
      console.log('Exam Data:', quizData);
      console.log('Is Exam Mode:', quizData.isExamMode);
      console.log('User ID:', user?.id);
      
      // Check attempt limit for final exams BEFORE loading the exam
      if (quizData.isExamMode && user?.id) {
        try {
          const validation = await quizService.validateExamAttempts(quizData.id, user.id);
          console.log('Exam Attempt Validation:', validation);

          if (!validation.allowed) {
            console.log('BLOCKING:', validation.reason);
            setExamBlocked(true);
            setBlockReason(validation.reason);
            setLoading(false);
            return;
          }

          setQuiz(quizData);
          setQuiz(prev => ({ ...prev, attemptsRemaining: validation.attemptsRemaining, maxAttempts: 3 }));
        } catch (err) {
          console.error('Failed to validate exam attempts:', err);
          setQuiz(quizData);
        }
      } else {
        setQuiz(quizData);
      }
      
      const initialDuration = (quizData.timeLimitMinutes || 60) * 60;
      setTimeLeft(initialDuration);
      setTotalDuration(initialDuration);
    } catch (err) {
      toastError(err.message || 'Failed to load exam', 5000);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startExam = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const attemptData = await quizService.startAttempt(id, user.id);
      setAttempt(attemptData);

      // Determine accurate deadline from backend attempt or quiz duration
      let durationSec = (quiz?.timeLimitMinutes || 60) * 60;
      if (attemptData?.expiresAt) {
        const diffSec = Math.round((new Date(attemptData.expiresAt).getTime() - Date.now()) / 1000);
        if (diffSec > 0) {
          durationSec = diffSec;
        }
      }

      setTimeLeft(durationSec);
      setTotalDuration(durationSec);
      endTimeRef.current = Date.now() + durationSec * 1000;
      hasAutoSubmittedRef.current = false;
      setExamStarted(true);
      
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } catch (err) {
      toastError(err.message || 'Failed to start exam', 5000);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answerId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: Number(answerId)
    }));
  };

  const handleSubmit = async () => {
    if (!attempt?.id || submitting) return;
    
    try {
      setSubmitting(true);
      endTimeRef.current = null;
      const payload = Object.entries(answers).map(([questionId, optionId]) => ({
        questionId: Number(questionId),
        optionId: Number(optionId),
      }));
      const res = await quizService.submitAttempt(attempt.id, payload);
      
      if (document.exitFullscreen && document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      
      setResult(res);
      window.scrollTo(0, 0);

      // Pre-generate certificate automatically upon passing
      if (res?.passed && quiz?.courseId) {
        try {
          const learningPathService = (await import('../services/learning-path.service')).default;
          await learningPathService.checkAndGenerateCertificate(quiz.courseId);
        } catch (certErr) {
          console.error('Auto certificate generation error:', certErr);
        }
      }
    } catch (err) {
      toastError(err.message || 'Failed to submit exam', 5000);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const isComplete = () => {
    if (!quiz || !quiz.questions) return false;
    return quiz.questions.every(q => answers[q.id]);
  };

  const formatTime = (seconds) => {
    if (!seconds || seconds <= 0) return '00:00';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="exam-container">
        <div className="loading">Loading exam...</div>
      </div>
    );
  }

  if (examBlocked) {
    return (
      <div className="exam-container" style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '2.5rem 2rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem' }}>Exam Access Restricted</h2>
          <p style={{ color: '#64748b', lineHeight: '1.6' }}>{blockReason}</p>
          <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="exam-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '2.5rem 2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📋</div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem' }}>Exam Not Found</h2>
          <p style={{ color: '#64748b', lineHeight: '1.6' }}>The exam you're looking for doesn't exist or you don't have access to it.</p>
          <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (result && !showReview) {
    return (
      <div className="exam-container">
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '2.5rem 2rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{result.passed ? 'Exam Passed!' : 'Exam Not Passed'}</h2>
          <p className="subtitle" style={{ color: '#64748b', marginTop: '0.5rem' }}>
            {result.passed ? 'Congratulations! You reached the passing score for this exam.' : 'Your score is below the passing threshold.'}
          </p>
          <div style={{ fontSize: '3.5rem', fontWeight: '800', margin: '1.5rem 0', color: result.passed ? '#10b981' : '#ef4444' }}>
            {Math.round(result.score)}%
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setShowReview(true)} className="btn btn-secondary">
              Review Answers 
            </button>
            {result.passed && (
              <button
                type="button"
                disabled={generatingCert}
                onClick={async () => {
                  try {
                    setGeneratingCert(true);
                    const courseId = quiz?.courseId;
                    if (!courseId) {
                      toastError('Course ID not found');
                      navigate('/certificates');
                      return;
                    }
                    const learningPathService = (await import('../services/learning-path.service')).default;
                    const res = await learningPathService.checkAndGenerateCertificate(courseId);
                    if (res?.certificate || res?.success || res?.message?.includes('Certificate generated') || res?.message?.includes('Certificate already issued')) {
                      toastSuccess('Your official certificate is ready!');
                    } else {
                      toastError(res?.message || 'Unable to generate certificate');
                    }
                    navigate('/certificates');
                  } catch (err) {
                    console.error('Failed to generate certificate:', err);
                    navigate('/certificates');
                  } finally {
                    setGeneratingCert(false);
                  }
                }}
                className="btn btn-primary"
                style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#ffffff', border: 'none', fontWeight: 800, padding: '0.75rem 1.5rem', borderRadius: '12px', cursor: generatingCert ? 'not-allowed' : 'pointer' }}
              >
                {generatingCert ? 'Issuing Certificate...' : 'Get Official Certificate →'}
              </button>
            )}
            <Link to={quiz?.courseId ? `/learning-path/${quiz.courseId}` : "/courses"} className="btn btn-secondary">
              Back to Course
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (showReview) {
    return (
      <div className="exam-container page-wrapper" style={{ maxWidth: '920px' }}>
        <div className="exam-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="exam-title" style={{ fontSize: '1.75rem', fontWeight: 800 }}>Exam Answers Review</h1>
            <p className="exam-description" style={{ color: '#64748b' }}>{quiz?.title}</p>
          </div>
          <button onClick={() => setShowReview(false)} className="btn btn-secondary">
            ← Back to Results
          </button>
        </div>

        <div className="questions-review-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {quiz?.questions?.map((question, index) => {
            const userAnswerId = answers[question.id];
            const isCorrect = question.options?.some(opt => opt.id === userAnswerId && opt.isCorrect);

            return (
              <div key={question.id} className="question-card card" style={{
                padding: '1.5rem',
                borderRadius: '16px',
                border: isCorrect ? '2px solid #10b981' : '2px solid #ef4444',
                background: isCorrect ? '#f0fdf4' : '#fef2f2'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontWeight: 700, alignItems: 'center' }}>
                  <span className="question-number-icon">{index + 1}</span>
                  <span style={{ color: isCorrect ? '#059669' : '#dc2626' }}>
                    {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#1e293b' }}>{question.text}</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {question.options?.map((option) => {
                    const isSelected = option.id === userAnswerId;
                    const isRightOption = option.isCorrect;

                    let optionBg = '#ffffff';
                    let optionBorder = '#e2e8f0';
                    let optionColor = '#334155';

                    if (isRightOption) {
                      optionBg = '#dcfce7';
                      optionBorder = '#10b981';
                      optionColor = '#065f46';
                    } else if (isSelected && !isRightOption) {
                      optionBg = '#fee2e2';
                      optionBorder = '#ef4444';
                      optionColor = '#991b1b';
                    }

                    return (
                      <div key={option.id} style={{
                        padding: '1rem 1.25rem',
                        borderRadius: '12px',
                        background: optionBg,
                        border: `2px solid ${optionBorder}`,
                        color: optionColor,
                        fontWeight: isSelected || isRightOption ? 600 : 400
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>{option.text}</span>
                          {isRightOption && <span style={{ fontWeight: 800, color: '#059669' }}>✓ Correct Answer</span>}
                          {isSelected && !isRightOption && <span style={{ fontWeight: 800, color: '#dc2626' }}>✗ Your Choice</span>}
                        </div>
                        {option.explanation && (
                          <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', opacity: 0.9 }}>
                            <strong>Explanation:</strong> {option.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const totalQuestions = quiz?.questions?.length || 0;
  const answeredCount = quiz?.questions
    ? quiz.questions.filter(q => answers[q.id] !== undefined).length
    : 0;
  const progressPercent = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;
  const isCritical = timeLeft < 300;
  const isWarning = timeLeft >= 300 && timeLeft < 600;

  if (!examStarted) {
    return (
      <div className="exam-container">
        <div className="exam-intro card">
          <h1 className="exam-title">{quiz.title}</h1>
          <p className="exam-description">{quiz.description}</p>
          
          <div className="exam-info">
            <div className="info-item">
              <span className="info-label">Questions:</span>
              <span className="info-value">{totalQuestions}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Time Limit:</span>
              <span className="info-value">{quiz.timeLimitMinutes || 60} minutes</span>
            </div>
            <div className="info-item">
              <span className="info-label">Passing Score:</span>
              <span className="info-value">{quiz.passingScore || 70}%</span>
            </div>
          </div>

          <div className="exam-warning">
            <h3>Important Exam Rules</h3>
            <ul>
              <li>Once you click <strong>Start Exam</strong>, the official countdown timer begins immediately and cannot be paused</li>
              <li>A real-time countdown timer will remain pinned at the top of your screen throughout the session</li>
              <li>When the timer expires, all answered questions are automatically submitted</li>
              <li>Make sure you select an answer for all {totalQuestions} questions to enable submission</li>
              <li>The exam will run in fullscreen mode; avoid reloading or navigating away</li>
            </ul>
          </div>

          <button onClick={startExam} className="btn btn-primary btn-large">
            Start Exam
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="exam-container exam-mode">
      {/* Coursera / Udemy Grade Unified Assessment Header */}
      <header className="pro-exam-topbar">
        <div className="pro-exam-topbar-inner">
          {/* Brand & Exam Title (Left) */}
          <div className="pro-topbar-brand-section">
            <Link to="/dashboard" className="navbar-logo pro-brand-logo" title="Learnova Platform">
              <img src="/logo.svg" alt="Learnova Logo" className="navbar-brand-img" />
              <span>Learnova</span>
            </Link>
            <div className="pro-brand-divider" />
            <div className="pro-exam-badge-group">
              <span className="pro-exam-status-tag">
                <span className="live-dot" />
                FINAL EXAM
              </span>
              <h1 className="pro-topbar-title" title={quiz.title}>
                {quiz.title}
              </h1>
            </div>
          </div>

          {/* Central Cockpit: Countdown Timer & Live Question Progress (Center) */}
          <div className="pro-topbar-center-cockpit">
            {/* Live Countdown Timer */}
            <div
              className={`pro-timer-card ${
                isCritical ? 'timer-critical' : isWarning ? 'timer-warning' : 'timer-normal'
              }`}
            >
              <Clock className="pro-timer-icon" size={18} />
              <div className="pro-timer-details">
                <span className="pro-timer-caption">TIME REMAINING</span>
                <span className="pro-timer-digits">{formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* Live Progress Bar */}
            <div className="pro-topbar-progress-box">
              <div className="pro-progress-header">
                <span className="pro-progress-label">Live Progress</span>
                <span className="pro-progress-count">
                  <strong>{answeredCount}</strong> of {totalQuestions} answered ({Math.round(progressPercent)}%)
                </span>
              </div>
              <div className="pro-progress-bar-track">
                <div
                  className="pro-progress-bar-fill"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Learner Profile Section & Submit Action (Right) */}
          <div className="pro-topbar-user-section">
            {user?.gamification && (
              <div className="navbar-gamification pro-exam-gamification">
                <div className="gamification-item" title="Consecutive learning days">
                  <Flame size={16} className="icon-streak" />
                  <span>{user.gamification.currentStreak || 0}d</span>
                </div>
                <div className="gamification-item" title="Current level">
                  <Award size={16} className="icon-points" />
                  <span>Lvl. {user.gamification.level || 1}</span>
                </div>
              </div>
            )}

            <div className="navbar-user-info pro-exam-user-info" title="Current Candidate">
              <div className="user-avatar-mini">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <span className="user-name">{user?.firstName} {user?.lastName}</span>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isComplete() || submitting}
              className="pro-topbar-submit-btn"
              title={
                !isComplete()
                  ? `Answer all questions to submit (${totalQuestions - answeredCount} remaining)`
                  : 'Submit your exam now'
              }
            >
              {submitting ? 'Submitting...' : 'Submit Exam'}
            </button>
          </div>
        </div>

        {/* Urgent Alert Banner (< 5 min remaining) */}
        {isCritical && timeLeft > 0 && (
          <div className="pro-exam-alert-strip">
            <AlertTriangle size={15} />
            <span>Urgent: Less than 5 minutes remaining! Complete your answers before the timer runs out.</span>
          </div>
        )}
      </header>

      <div className="exam-content">
        {quiz.questions && quiz.questions.length > 0 ? (
          <div className="questions-list">
            {quiz.questions.map((question, index) => (
              <div key={question.id} className="question-card card">
                <div className="question-header">
                  <span className="question-number-icon">{index + 1}</span>
                  <span className="question-points">
                    {Number(question.points) || 1} point{(Number(question.points) || 1) > 1 ? 's' : ''}
                  </span>
                </div>
                
                <h3 className="question-text">{question.text}</h3>
                
                <div className="options-list">
                  {question.options && question.options.map((option) => (
                    <label key={option.id} className="option-label">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option.id}
                        checked={answers[question.id] === option.id}
                        onChange={() => handleAnswerChange(question.id, option.id)}
                        className="option-input"
                      />
                      <span className="option-text">{option.text}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-questions">
            <p>No questions available for this exam</p>
          </div>
        )}

        <div className="exam-actions">
          <div className="exam-bottom-summary">
            <span>
              {answeredCount === totalQuestions
                ? 'All questions answered. Ready to submit!'
                : `${totalQuestions - answeredCount} question(s) remaining`}
            </span>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!isComplete() || submitting}
            className="btn btn-primary btn-large"
          >
            {submitting ? 'Submitting...' : 'Submit Exam'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Exam;
