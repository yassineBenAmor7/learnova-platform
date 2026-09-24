import React from 'react';
import PropTypes from 'prop-types';

/**
 * QuestionCard - Composant réutilisable d'affichage d'une question de quiz/examen
 */
export const QuestionCard = ({
  question,
  index,
  selectedOptionId,
  onOptionSelect,
  showResult = false,
  disabled = false,
}) => {
  if (!question) return null;

  return (
    <div className={`question-card card ${showResult ? 'review-mode' : ''}`}>
      <div className="question-header">
        <span className="question-number-icon">{index + 1}</span>
        {question.points && (
          <span className="question-points">
            {question.points} point{question.points > 1 ? 's' : ''}
          </span>
        )}
      </div>

      <h3 className="question-text">{question.text}</h3>

      <div className="options-list">
        {question.options &&
          question.options.map((option, optIdx) => {
            const isSelected = selectedOptionId === option.id;
            const isCorrect = option.isCorrect;

            let optionClass = 'option-label';
            if (isSelected) optionClass += ' selected';
            if (showResult && isCorrect) optionClass += ' correct';
            if (showResult && isSelected && !isCorrect) optionClass += ' incorrect';

            return (
              <label key={option.id || optIdx} className={optionClass}>
                <input
                  type="radio"
                  name={`question-${question.id || index}`}
                  value={option.id}
                  checked={isSelected}
                  onChange={() => !disabled && onOptionSelect && onOptionSelect(question.id, option.id)}
                  disabled={disabled}
                  className="option-input"
                />
                <span className="option-letter">{String.fromCharCode(65 + optIdx)}</span>
                <span className="option-text">{typeof option === 'object' ? option.text : option}</span>
                {showResult && isCorrect && <span className="option-badge correct-badge">Correct</span>}
                {showResult && isSelected && !isCorrect && <span className="option-badge error-badge">Incorrect</span>}
              </label>
            );
          })}
      </div>

      {showResult && question.explanation && (
        <div className="question-explanation">
          <strong>Pedagogical Explanation:</strong> {question.explanation}
        </div>
      )}
    </div>
  );
};

QuestionCard.propTypes = {
  question: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  selectedOptionId: PropTypes.any,
  onOptionSelect: PropTypes.func,
  showResult: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default QuestionCard;
