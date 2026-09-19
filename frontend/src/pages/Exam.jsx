import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { quizService } from '../services/quiz.service';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../contexts/ToastContext';
import './Exam.css';

function Exam() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { error: toastError } = useToast();
  const [quiz, setQuiz] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [examStarted, setExamStarted] = useState(false);
  const [result, setResult] = useState(null);
  const [showReview, setShowReview] = useState(false);
  const [examBlocked, setExamBlocked] = useState(false);
  const [blockReason, setBlockReason] = useState(null);

  useEffect(() => {
    loadExam();
  }, [id]);

  useEffect(() => {
    let timer;
    if (examStarted && timeLeft > 0 && !result) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [examStarted, timeLeft, result]);

  const loadExam = async () => {
    try {
      setLoading(true);
      const quizData = await quizService.getForLearner(id);
      
      console.log('=== EXAM LOADING DEBUG ===');
      console.log('Exam ID:', id);
      console.log('Exam Data:', quizData);
      console.log('Is Exam Mode:', quizData.isExamMode);
      console.log('User ID:', user.id);
      
      // Check attempt limit for final exams BEFORE loading the exam
      if (quizData.isExamMode) {
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
      
      if (quizData.timeLimitMinutes) {
        setTimeLeft(quizData.timeLimitMinutes * 60);
      }
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
    if (!attempt?.id) return;
    
    try {
      setSubmitting(true);
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
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
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
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{result.passed ? 'Exam Passed!' : '❌ Exam Not Passed'}</h2>
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
                onClick={async () => {
                  try {
                    const learningPathService = (await import('../services/learning-path.service')).default;
                    const res = await learningPathService.checkAndGenerateCertificate(quiz.courseId);
                    if (res?.certificate || res?.success || res?.message?.includes('Certificate generated') || res?.message?.includes('Certificate already issued')) {
                      navigate('/certificates');
                    } else {
                      navigate('/certificates');
                    }
                  } catch (err) {
                    console.error('Failed to generate certificate:', err);
                    navigate('/certificates');
                  }
                }}
                className="btn btn-primary"
                style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#ffffff', border: 'none', fontWeight: 800, padding: '0.75rem 1.5rem', borderRadius: '12px' }}
              >
                🎓 Obtenir mon Certificat Officiel →
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
                  <span className="question-number">
                    <span className="question-number-icon">{index + 1}</span>
                  </span>
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

  if (!examStarted) {
    return (
      <div className="exam-container">
        <div className="exam-intro card">
          <h1 className="exam-title">{quiz.title}</h1>
          <p className="exam-description">{quiz.description}</p>
          
          <div className="exam-info">
            <div className="info-item">
              <span className="info-label">Questions:</span>
              <span className="info-value">{quiz.questions?.length || 0}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Time Limit:</span>
              <span className="info-value">{quiz.timeLimitMinutes} minutes</span>
            </div>
            <div className="info-item">
              <span className="info-label">Passing Score:</span>
              <span className="info-value">{quiz.passingScore}%</span>
            </div>
          </div>

          <div className="exam-warning">
            <h3>Important Instructions</h3>
            <ul>
              <li>Once started, the exam timer cannot be paused</li>
              <li>You must complete all questions before the time runs out</li>
              <li>The exam will be in fullscreen mode</li>
              <li>Do not refresh the page during the exam</li>
              <li>Make sure you have a stable internet connection</li>
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
      <div className="exam-header">
        <div className="exam-timer">
          <span className={`timer-display ${timeLeft < 300 ? 'timer-warning' : ''}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
        <h1 className="exam-title">{quiz.title}</h1>
      </div>

      <div className="exam-content">
        {quiz.questions && quiz.questions.length > 0 ? (
          <div className="questions-list">
            {quiz.questions.map((question, index) => (
              <div key={question.id} className="question-card card">
                <div className="question-header">
                  <span className="question-number">
                    Question {index + 1}
                  </span>
                  <span className="question-points">
                    {question.points || 1} point{question.points !== 1 ? 's' : ''}
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
