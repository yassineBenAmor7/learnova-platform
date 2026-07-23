import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { quizService } from '../services/quiz.service';
import { useAuth } from '../context/AuthContext';
import './Exam.css';

function Exam() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [examStarted, setExamStarted] = useState(false);
  const [result, setResult] = useState(null);

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
      setQuiz(quizData);
      
      if (quizData.timeLimitMinutes) {
        setTimeLeft(quizData.timeLimitMinutes * 60);
      }
    } catch (err) {
      setError(err.message || 'Impossible de charger l\'examen');
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
      setError(err.message || 'Échec du démarrage de l\'examen');
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
    } catch (err) {
      setError(err.message || 'Échec de la soumission de l\'examen');
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

  if (error) {
    return (
      <div className="exam-container">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="exam-container" style={{ padding: '2rem' }}>
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '2rem' }}>
          <h2>{result.passed ? '🎉 Examen Réussi !' : '❌ Examen Non Validé'}</h2>
          <p className="subtitle">
            {result.passed ? 'Félicitations, vous avez obtenu la note minimale requise pour valider cet examen.' : 'Votre score est inférieur au seuil de réussite.'}
          </p>
          <div style={{ fontSize: '3.5rem', fontWeight: 'bold', margin: '1.5rem 0', color: result.passed ? '#10b981' : '#ef4444' }}>
            {Math.round(result.score)}%
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/courses" className="btn btn-secondary">Retour aux cours</Link>
            {result.passed && <Link to="/certificates" className="btn btn-primary">Obtenir mon certificat</Link>}
          </div>
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
            <h3>⚠️ Important Instructions</h3>
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
          <span className="timer-icon">⏱</span>
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
