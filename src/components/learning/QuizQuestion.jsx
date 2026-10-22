import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

/**
 * Reusable QuizQuestion component with controlled radio selection and optional review state
 */
const QuizQuestion = ({
  questionNumber,
  question,
  selectedAnswer,
  onSelectAnswer,
  isSubmitted = false,
  error = null
}) => {
  return (
    <div className={`p-5 rounded-2xl border transition-all ${
      error
        ? 'border-rose-300 bg-rose-50/30'
        : isSubmitted
        ? 'border-slate-200 bg-slate-50/50'
        : 'border-slate-200 bg-white hover:border-indigo-200 shadow-xs'
    }`}>
      <div className="flex items-start justify-between gap-4 mb-3">
        <h4 id={`question-${question.id}-label`} className="text-sm font-bold text-slate-900 leading-snug">
          <span className="text-indigo-600 mr-1.5">Q{questionNumber}.</span>
          {question.question}
        </h4>
        {isSubmitted && (
          selectedAnswer === question.correctIndex ? (
            <span className="shrink-0 flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <CheckCircle className="w-3.5 h-3.5" /> Correct
            </span>
          ) : (
            <span className="shrink-0 flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
              <XCircle className="w-3.5 h-3.5" /> Incorrect
            </span>
          )
        )}
      </div>

      {error && <p id={`question-${question.id}-error`} role="alert" className="text-xs text-rose-600 mb-3">{error}</p>}

      <div className="space-y-2" role="group" aria-labelledby={`question-${question.id}-label`} aria-describedby={error ? `question-${question.id}-error` : undefined}>
        {question.options.map((option, idx) => {
          const isSelected = selectedAnswer === idx;
          const isCorrect = question.correctIndex === idx;

          let optionStyle = 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50';

          if (isSubmitted) {
            if (isCorrect) {
              optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold';
            } else if (isSelected && !isCorrect) {
              optionStyle = 'border-rose-500 bg-rose-50 text-rose-900 line-through';
            } else {
              optionStyle = 'border-slate-200 bg-white text-slate-400 opacity-70';
            }
          } else if (isSelected) {
            optionStyle = 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-semibold shadow-xs';
          }

          return (
            <label
              key={idx}
              className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${optionStyle} ${
                isSubmitted ? 'cursor-default' : ''
              }`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                aria-label={option}
                value={idx}
                checked={isSelected}
                disabled={isSubmitted}
                onChange={() => onSelectAnswer(question.id, idx)}
                className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
              />
              <span className="flex-1">{option}</span>
            </label>
          );
        })}
      </div>

      {/* Explanation when submitted */}
      {isSubmitted && question.explanation && (
        <div className="mt-3 p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl text-xs text-indigo-900">
          <span className="font-bold">Explanation: </span>
          <span>{question.explanation}</span>
        </div>
      )}
    </div>
  );
};

export default QuizQuestion;
