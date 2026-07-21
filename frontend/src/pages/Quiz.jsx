import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { quizService } from '../services/quiz.service';
import './Quiz.css';

function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadQuiz();
  }, [id]);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      const quizData = await quizService.getForLearner(id);
      setQuiz(quizData);
      
      // Start attempt
      const attemptData = await quizService.startAttempt(id);
      setAttempt(attemptData);
    } catch (err) {
      setError('Failed to load quiz');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answerId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const result = await quizService.submitAttempt(attempt.id, answers);
      navigate(`/quiz/result/${result.id}`);
    } catch (err) {
      setError('Failed to submit quiz');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const isComplete = () => {
    if (!quiz || !quiz.questions) return false;
    return quiz.questions.every(q => answers[q.id]);
  };

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

  if (!quiz) {
    return (
      <div className="quiz-container">
        <div className="alert alert-warning">Quiz not found</div>
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
        </div>
      </div>

      <div className="quiz-content">
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
            <p>No questions available for this quiz</p>
          </div>
        )}

        <div className="quiz-actions">
          <button
            onClick={handleSubmit}
            disabled={!isComplete() || submitting}
            className="btn btn-primary btn-large"
          >
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
