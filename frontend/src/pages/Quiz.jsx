import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { quizService } from '../services/quiz.service';
import { courseService } from '../services/course.service';
import { useAuth } from '../context/AuthContext';
import './Quiz.css';

function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [showReview, setShowReview] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLastPracticeQuiz, setIsLastPracticeQuiz] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadQuiz();
    }
  }, [id, user]);

  useEffect(() => {
    if (attempt && quiz?.isExamMode && attempt.expiresAt && !result) {
      const interval = setInterval(() => {
        const now = new Date();
        const expiresAt = new Date(attempt.expiresAt);
        const remaining = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 1000));
        setTimeRemaining(remaining);
        
        if (remaining === 0) {
          handleSubmit();
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [attempt, quiz, result]);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      const quizData = await quizService.getForAttempt(id);
      
      console.log('=== QUIZ LOADING DEBUG ===');
      console.log('Quiz ID:', id);
      console.log('Quiz Data:', quizData);
      console.log('Is Exam Mode:', quizData.isExamMode);
      console.log('User ID:', user.id);
      
      // Check attempt limit for final exams BEFORE loading the quiz
      if (quizData.isExamMode) {
        try {
          const myAttempts = await quizService.getMyAttempts(user.id);
          console.log('All Attempts:', myAttempts);
          console.log('Quiz ID from data:', quizData.id);
          
          const examAttempts = myAttempts.filter(a => a.quizId === quizData.id);
          console.log('Exam Attempts:', examAttempts);
          console.log('Exam Attempts Length:', examAttempts.length);
          console.log('Exam Attempts Details:', examAttempts.map(a => ({ id: a.id, quizId: a.quizId, passed: a.passed, score: a.score })));
          
          const maxAttempts = 3; // Professional standard: 3 attempts for final exams
          
          // Check if user has already passed this exam FIRST
          const passedAttempt = examAttempts.find(a => a.passed === true);
          console.log('Passed Attempt:', passedAttempt);
          console.log('Passed Attempt Check:', examAttempts.some(a => a.passed === true));
          
          // Alternative check: if user has certificate for this course, consider exam passed
          let hasCertificate = false;
          try {
            const certificates = await (await import('../services/certificate.service')).certificateService.getMyCertificates();
            hasCertificate = certificates.some(c => c.courseId === quizData.courseId);
            console.log('Has Certificate:', hasCertificate);
          } catch (certErr) {
            console.log('Could not check certificates:', certErr);
          }
          
          if (passedAttempt || hasCertificate) {
            console.log('BLOCKING: User already passed this exam');
            setError('Congratulations! You have already passed this final exam and earned your certificate. No further attempts are needed.');
            setLoading(false);
            return;
          }
          
          // Check if user has used all attempts SECOND (only if not passed)
          if (examAttempts.length >= maxAttempts && !passedAttempt) {
            console.log('BLOCKING: User used all attempts');
            console.log('Attempts length:', examAttempts.length, 'Max attempts:', maxAttempts);
            setError(`You have used all ${maxAttempts} attempts for this final exam. Please contact support for assistance.`);
            setLoading(false);
            return;
          }
          
          setQuiz(quizData);
          setQuiz(prev => ({ ...prev, attemptsRemaining: maxAttempts - examAttempts.length, maxAttempts }));
        } catch (err) {
          console.error('Failed to check attempts:', err);
          setQuiz(quizData);
        }
      } else {
        setQuiz(quizData);
      }
      
      // Load all quizzes for the course to determine if this is the last practice quiz of the current session
      if (quizData.courseId) {
        try {
          const courseData = await courseService.getById(quizData.courseId);
          
          // Find the current session for this quiz
          const currentSession = courseData.sessions?.find(s => 
            s.title.toLowerCase().includes(quizData.title.toLowerCase().replace('quiz', '').trim()) ||
            quizData.title.toLowerCase().includes(s.title.toLowerCase())
          );
          
          const sessions = [...(courseData.sessions || [])].sort((a, b) => a.orderNumber - b.orderNumber);
          const currentSessionIndex = sessions.findIndex((s) => 
            s.id === quizData.sessionId ||
            (currentSession && s.id === currentSession.id) ||
            s.title.toLowerCase().includes(quizData.title.toLowerCase().replace('quiz', '').trim()) ||
            quizData.title.toLowerCase().includes(s.title.toLowerCase())
          );
          
          const isLastSessionOfCourse = currentSessionIndex !== -1 && currentSessionIndex === (sessions.length - 1);
          quizData.isLastPracticeQuiz = isLastSessionOfCourse;
          setIsLastPracticeQuiz(isLastSessionOfCourse);
        } catch (err) {
          console.error('Failed to load course quizzes:', err);
          quizData.isLastPracticeQuiz = false;
          setIsLastPracticeQuiz(false);
        }
      }
      
      const attemptData = await quizService.startAttempt(id, user.id);
      setAttempt(attemptData);
    } catch (err) {
      setError(err.message || 'Failed to load quiz');
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
      setResult(res);
      window.scrollTo(0, 0);

      // Si c'est un practice quiz réussi, marquer la session comme complétée
      if (!quiz?.isExamMode && res.passed && quiz?.courseId) {
        try {
          const learningPathService = (await import('../services/learning-path.service')).default;
          
          // Trouver la session correspondante à ce quiz
          const courseData = await courseService.getById(quiz.courseId);
          const session = courseData.sessions?.find(s => 
            s.title.toLowerCase().includes(quiz.title.toLowerCase().replace('quiz', '').trim()) ||
            quiz.title.toLowerCase().includes(s.title.toLowerCase())
          );
          
          if (session) {
            await learningPathService.completeSession(session.id);
            console.log('Session marked as completed automatically');
          }
        } catch (err) {
          console.error('Failed to auto-complete session:', err);
        }
      }

      // Si c'est un examen final réussi, générer automatiquement le certificat
      console.log('=== QUIZ SUBMISSION RESULT ===');
      console.log('Quiz isExamMode:', quiz?.isExamMode);
      console.log('Result passed:', res?.passed);
      console.log('Course ID:', quiz?.courseId);
      console.log('Quiz ID:', quiz?.id);
      
      if (quiz?.isExamMode && res.passed && quiz?.courseId) {
        try {
          console.log('=== CERTIFICATE GENERATION START ===');
          console.log('Course ID:', quiz.courseId);
          console.log('Quiz ID:', quiz.id);
          
          const learningPathService = (await import('../services/learning-path.service')).default;
          const certResult = await learningPathService.checkAndGenerateCertificate(quiz.courseId);
          
          console.log('Certificate generation result:', certResult);
          
          const { toast } = await import('../contexts/ToastContext');
          
          if (certResult.message === 'Certificate generated successfully' || certResult.success) {
            toast.success('Congratulations! Your certificate has been generated successfully!', {
              duration: 5000,
            });
          } else if (certResult.message === 'Certificate already exists') {
            toast.info('Certificate already exists. You can view it in your certificates.', {
              duration: 3000,
            });
          } else {
            toast.success('Congratulations! You have earned your certificate!', {
              duration: 5000,
            });
          }
        } catch (certErr) {
          console.error('Certificate generation failed:', certErr);
          console.error('Error details:', JSON.stringify(certErr));
          const { toast } = await import('../contexts/ToastContext');
          toast.error('Failed to generate certificate. Please try again later.', {
            duration: 4000,
          });
        }
      } else {
        console.log('=== CERTIFICATE GENERATION SKIPPED ===');
        console.log('Reason: Conditions not met');
        console.log('Quiz isExamMode:', quiz?.isExamMode);
        console.log('Result passed:', res?.passed);
        console.log('Course ID:', quiz?.courseId);
      }

      // No automatic redirection - user must click "Proceed to Next Session" button
    } catch (err) {
      setError(err.message || 'Failed to submit quiz');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const moveToQuestion = (direction) => {
    if (!quiz?.questions?.length) return;

    if (direction === 'next') {
      const isCurrentAnswered = Boolean(answers[currentQuestion?.id]);
      if (!isCurrentAnswered) return;

      if (currentQuestionIndex + 1 < quiz.questions.length) {
        setCurrentQuestionIndex((current) => Math.min(current + 1, quiz.questions.length - 1));
      }

      return;
    }

    setCurrentQuestionIndex((current) => Math.max(current - 1, 0));
  };

  const isComplete = () => {
    if (!quiz || !quiz.questions) return false;
    return quiz.questions.every(q => answers[q.id]);
  };

  const currentQuestion = quiz?.questions?.[currentQuestionIndex] || null;
  const answeredCount = quiz?.questions?.filter((question) => answers[question.id])?.length || 0;
  const highestAnsweredIndex = quiz?.questions?.reduce((highest, question, index) => {
    if (answers[question.id]) {
      return Math.max(highest, index);
    }

    return highest;
  }, -1) ?? -1;
  const nextQuestionUnlockedIndex = Math.min(
    quiz?.questions?.length ? quiz.questions.length - 1 : 0,
    Math.max(0, highestAnsweredIndex + 1)
  );

  if (loading) {
    return (
      <div className="quiz-container">
        <div className="loading">Loading quiz...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-container">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (result && !showReview) {
    const canRetry = !quiz?.isExamMode || (quiz?.attemptsRemaining && quiz.attemptsRemaining > 0);
    
    return (
      <div className="quiz-container" style={{ padding: '2rem', maxWidth: '500px', margin: '20px auto 0', transform: 'translateY(25px)'}}>
        <div className="card" style={{ maxWidth: '100%', margin: '0 auto', textAlign: 'center', padding: '2.5rem 2rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800' }}>{result.passed ? 'Congratulations!' : 'Quiz Not Passed'}</h2>
          <p className="subtitle" style={{ color: '#64748b', marginTop: '0.5rem' }}>
            {result.passed ? 'You have successfully passed this quiz.' : 'You did not reach the minimum passing score.'}
          </p>
          <div style={{ fontSize: '3.5rem', fontWeight: '800', margin: '1.5rem 0', color: result.passed ? '#10b981' : '#ef4444' }}>
            {Math.round(result.score)}%
          </div>
          
          {quiz?.isExamMode && quiz?.attemptsRemaining !== undefined && (
            <div style={{ 
              background: 'rgba(59, 130, 246, 0.1)', 
              padding: '0.75rem 1rem', 
              borderRadius: '8px', 
              marginBottom: '1.5rem',
              border: '1px solid rgba(59, 130, 246, 0.3)'
            }}>
              <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                Attempts remaining: <strong style={{ color: '#60a5fa' }}>{quiz.attemptsRemaining} / {quiz.maxAttempts}</strong>
              </span>
            </div>
          )}
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => {
                setShowReview(true);
              }}
              className="btn btn-secondary"
            >
              Review Answers
            </button>
            {canRetry && !result.passed && (
              <button
                type="button"
                onClick={() => {
                  window.location.reload();
                }}
                className="btn btn-primary"
              >
                {quiz?.isExamMode ? `Retry (${quiz.attemptsRemaining} left)` : 'Try Again'}
              </button>
            )}
            <Link to={quiz?.courseId ? `/learning-path/${quiz.courseId}` : "/courses"} className="btn btn-secondary">
              Back to Course
            </Link>
            {quiz?.isExamMode && result.passed && <Link to="/certificates" className="btn btn-primary">View my certificates</Link>}
            {!quiz?.isExamMode && result.passed && quiz?.courseId && (
              <button
                type="button"
                onClick={async () => {
                  try {
                    const courseData = await courseService.getById(quiz.courseId);
                    const sessions = [...(courseData.sessions || [])].sort((a, b) => a.orderNumber - b.orderNumber);
                    
                    // Find the current session for this quiz
                    const currentSession = sessions.find((s) => 
                      s.id === quiz.sessionId ||
                      s.title.toLowerCase().includes(quiz.title.toLowerCase().replace('quiz', '').trim()) ||
                      quiz.title.toLowerCase().includes(s.title.toLowerCase())
                    );
                    
                    const currentSessionIndex = sessions.findIndex((s) => s.id === currentSession?.id);
                    const nextSession = currentSessionIndex !== -1 ? sessions[currentSessionIndex + 1] : null;

                    if (nextSession) {
                      // Navigate to the newly unlocked next session!
                      window.location.href = `/learning-path/${quiz.courseId}?session=${nextSession.id}`;
                    } else {
                      // Last session of the course! Proceed to final exam if available
                      const finalExam = courseData.quizzes?.find((q) => q.isExamMode);
                      if (finalExam) {
                        window.location.href = `/exam/${finalExam.id}`;
                      } else {
                        window.location.href = `/learning-path/${quiz.courseId}`;
                      }
                    }
                  } catch (err) {
                    console.error('Failed to navigate:', err);
                    window.location.href = `/learning-path/${quiz.courseId}`;
                  }
                }}
                className="btn btn-primary"
              >
                {isLastPracticeQuiz ? 'Proceed to Final Exam →' : 'Proceed to Next Session →'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (showReview) {
    return (
      <div className="quiz-container">
        <div className="quiz-header">
          <button onClick={() => setShowReview(false)} className="btn btn-secondary">
            ← Back to Results
          </button>
          <h1 className="quiz-title">Review Answers</h1>
          <p className="quiz-description">{quiz.title}</p>
        </div>

        <div className="quiz-content">
          {quiz.questions && quiz.questions.length > 0 ? (
            <div className="questions-list">
              {quiz.questions.map((question, index) => {
                const userAnswer = answers[question.id];
                const correctOption = question.options?.find(opt => opt.isCorrect);
                const selectedOption = question.options?.find(opt => opt.id === userAnswer);
                const isCorrect = selectedOption?.isCorrect;

                return (
                  <div key={question.id} className="question-card card" style={{ 
                    border: isCorrect ? '2px solid #10b981' : '2px solid #ef4444',
                    backgroundColor: isCorrect ? '#f0fdf4' : '#fef2f2'
                  }}>
                    <div className="question-header">
                      <span className="question-number-icon">{index + 1}</span>
                      <span className="question-points" style={{ color: isCorrect ? '#10b981' : '#ef4444' }}>
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>
                    
                    <h3 className="question-text">{question.text}</h3>
                    
                    <div className="options-list">
                      {question.options && question.options.map((option) => (
                        <div key={option.id} className="option-label" style={{
                          padding: '0.75rem',
                          margin: '0.5rem 0',
                          borderRadius: '0.5rem',
                          backgroundColor: option.isCorrect ? '#dcfce7' : 
                                          (option.id === userAnswer ? '#fee2e2' : '#f3f4f6'),
                          border: option.isCorrect ? '2px solid #10b981' : 
                                 (option.id === userAnswer ? '2px solid #ef4444' : '1px solid #e5e7eb')
                        }}>
                          <span className="option-text">
                            {option.text}
                            {option.isCorrect && ' (Correct)'}
                            {option.id === userAnswer && !option.isCorrect && ' (Your Choice)'}
                          </span>
                          {quiz?.showExplanationAfterAnswer && option.explanation && (
                            <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                              <strong>Explanation:</strong> {option.explanation}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-questions">
              <p>No questions available for this quiz</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <Link to="/dashboard" className="back-link">
          ← Back to Dashboard
        </Link>
        <h1 className="quiz-title">{quiz.title}</h1>
        <p className="quiz-description">{quiz.description}</p>
        <div className="quiz-meta">
          <span className="quiz-questions">
            {quiz.questions?.length || 0} questions
          </span>
          <span className="quiz-passing">
            Passing score: {quiz.passingScore}%
          </span>
          {quiz.isExamMode && timeRemaining !== null && (
            <span className="quiz-timer" style={{ 
              color: timeRemaining < 60 ? '#ef4444' : '#10b981',
              fontWeight: 'bold',
              marginLeft: '1rem'
            }}>
              ⏱️ {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
            </span>
          )}
        </div>
      </div>

      <div className="quiz-content">
        <div className="quiz-layout">
          <div className="quiz-main-column">
            {quiz.questions && quiz.questions.length > 0 && currentQuestion ? (
              <div className="questions-list single-question-list">
                <div className="quiz-question-topbar">
                  <div>
                    <span className="section-kicker">Practice Assessment</span>
                    <span className="question-progress-copy">
                      Question {currentQuestionIndex + 1} of {quiz.questions.length}
                    </span>
                  </div>
                  <div className="progress-block">
                    <div className="progress-label">
                      <span>{answeredCount} answered</span>
                      <span>{Math.round(((currentQuestionIndex + 1) / quiz.questions.length) * 100)}%</span>
                    </div>
                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div key={currentQuestion.id} className="question-card card">
                  <div className="question-header">
                    <span className="question-number-icon">{currentQuestionIndex + 1}</span>
                    <span className="question-points">
                      {Number(currentQuestion.points) || 1} point{(Number(currentQuestion.points) || 1) > 1 ? 's' : ''}
                    </span>
                  </div>

                  <h3 className="question-text">{currentQuestion.text}</h3>

                  <div className="options-list">
                    {currentQuestion.options && currentQuestion.options.map((option) => (
                      <label key={option.id} className="option-label">
                        <input
                          type="radio"
                          name={`question-${currentQuestion.id}`}
                          value={option.id}
                          checked={answers[currentQuestion.id] === option.id}
                          onChange={() => handleAnswerChange(currentQuestion.id, option.id)}
                          className="option-input"
                        />
                        <span className="option-text">{option.text}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-questions">
                <p>No questions available for this quiz</p>
              </div>
            )}

            <div className="quiz-actions">
              <div className="quiz-actions-left">
                <span className="answered-state">
                  {answeredCount}/{quiz.questions?.length || 0} completed
                </span>
              </div>
              <div className="quiz-button-group">
                <button
                  onClick={() => moveToQuestion('previous')}
                  disabled={currentQuestionIndex === 0}
                  className="btn btn-secondary btn-nav"
                >
                  ← Previous
                </button>

                {currentQuestionIndex < (quiz.questions?.length || 1) - 1 ? (
                  <button
                    onClick={() => moveToQuestion('next')}
                    disabled={!answers[currentQuestion?.id]}
                    className="btn btn-primary btn-large btn-nav"
                  >
                    Next Question →
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!isComplete() || submitting}
                    className="btn btn-primary btn-large btn-nav"
                  >
                    {submitting ? 'Submitting...' : 'Submit Quiz'}
                  </button>
                )}
              </div>
            </div>
          </div>

          <aside className="quiz-sidebar-panel">
            <div className="quiz-side-card">
              <div className="side-card-header">
                <span className="side-icon">◎</span>
                <span className="side-title">Assessment</span>
              </div>
              <div className="side-card-title">
                {quiz?.title}
              </div>
              <div className="side-metrics">
                <div>
                  <span className="metric-label">Questions</span>
                  <span className="metric-value">{quiz?.questions?.length || 0}</span>
                </div>
                <div>
                  <span className="metric-label">Passing</span>
                  <span className="metric-value">{quiz?.passingScore || 70}%</span>
                </div>
              </div>
              <div className="side-progress-summary">
                <span>Progress</span>
                <span>{Math.round(((answeredCount || 0) / (quiz.questions?.length || 1)) * 100)}%</span>
              </div>
              <div className="side-progress-bar">
                <div className="side-progress-bar-fill" style={{ width: `${Math.round(((answeredCount || 0) / (quiz.questions?.length || 1)) * 100)}%` }}></div>
              </div>

              <div className="side-question-map">
                <div className="side-question-map-title">
                  <span>Question plan</span>
                  <span>{quiz?.questions?.length || 0}</span>
                </div>
                <div className="side-question-list">
                  {quiz?.questions?.map((question, index) => (
                    <button
                      key={question.id}
                      type="button"
                      disabled={index > nextQuestionUnlockedIndex}
                      className={`side-question-item ${index === currentQuestionIndex ? 'current' : ''} ${answers[question.id] ? 'answered' : ''}`}
                      onClick={() => {
                        if (index <= nextQuestionUnlockedIndex) {
                          setCurrentQuestionIndex(index);
                        }
                      }}
                    >
                      <span className="side-question-number">{index + 1}</span>
                      <span className="side-question-status">
                        {answers[question.id] ? 'Answered' : index < currentQuestionIndex ? 'Done' : 'Locked'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
