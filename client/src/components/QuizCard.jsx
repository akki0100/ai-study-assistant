import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

export default function QuizCard({ quizList }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  if (!quizList || quizList.length === 0) return null;

  const currentQ = quizList[currentIdx];

  const handleSelect = (optionIndex) => {
    if (selectedOption !== null) return; // Answer locked
    setSelectedOption(optionIndex);

    if (optionIndex === currentQ.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    if (currentIdx + 1 < quizList.length) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    return (
      <div className="card result-card">
        <h3>Quiz Finished! 🎉</h3>
        <p className="score-text">Aapka Score: <strong>{score} / {quizList.length}</strong></p>
        <button 
          className="btn-primary" 
          onClick={() => { setCurrentIdx(0); setScore(0); setShowResult(false); setSelectedOption(null); }}
        >
          Retake Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="card quiz-card">
      <div className="card-header">
        <HelpCircle size={20} color="#10b981" />
        <span>Question {currentIdx + 1} of {quizList.length}</span>
      </div>

      <h4 className="question-text">{currentQ.question}</h4>

      <div className="options-grid">
        {currentQ.options.map((opt, i) => {
          let btnClass = "option-btn";
          if (selectedOption !== null) {
            if (i === currentQ.correctAnswer) btnClass += " correct";
            else if (i === selectedOption) btnClass += " wrong";
          }
          return (
            <button 
              key={i} 
              className={btnClass} 
              onClick={() => handleSelect(i)}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {selectedOption !== null && (
        <div className="explanation-box">
          <p><strong>Explanation:</strong> {currentQ.explanation}</p>
          <button className="btn-secondary" onClick={handleNext}>
            {currentIdx + 1 === quizList.length ? 'Show Results' : 'Next Question →'}
          </button>
        </div>
      )}
    </div>
  );
}