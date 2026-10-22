import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLearning } from '../../hooks/useLearning';
import QuizQuestion from './QuizQuestion';
import Button from '../common/Button';
import {
  HelpCircle,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  ArrowRight,
  Award,
  Sparkles
} from 'lucide-react';

const Quiz = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    courses,
    selectedCourseId,
    isEnrolled,
    submitQuiz,
    getQuizScore
  } = useLearning();

  const courseId = searchParams.get('courseId') || selectedCourseId || '101';
  const course = courses.find(c => c.id === String(courseId)) || courses[0];

  const enrolled = isEnrolled(course?.id);
  const existingResult = getQuizScore(course?.id);

  const questions = course?.quiz || [];

  // Controlled quiz state: { [questionId]: optionIndex }
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(null);

  // Initialize from existing score if already submitted in context
  useEffect(() => {
    if (existingResult) {
      setAnswers(existingResult.answers || {});
      setQuizScore(existingResult);
      setIsSubmitted(true);
    } else {
      setAnswers({});
      setIsSubmitted(false);
      setQuizScore(null);
    }
  }, [courseId, existingResult]);

  // Conditional Rendering State: "Course not enrolled"
  if (!enrolled) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center max-w-xl mx-auto my-8 shadow-xs">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Course not enrolled</h2>
        <p className="text-sm text-slate-600 mb-6">
          You must be enrolled in <strong className="text-indigo-600">{course?.title}</strong> to attempt the module assessment quiz.
        </p>
        <Button
          variant="primary"
          onClick={() => navigate(`/enrollment/${course?.id}`)}
          icon={<ArrowRight className="w-4 h-4" />}
        >
          Enroll to Access Quiz
        </Button>
      </div>
    );
  }

  // Handle controlled radio selection
  const handleSelectAnswer = (qId, optionIndex) => {
    setAnswers(prev => ({ ...prev, [qId]: optionIndex }));
    if (errors[qId]) {
      setErrors(prev => ({ ...prev, [qId]: null }));
    }
  };

  // Form validation for Quiz answers (Experiment 4f)
  const validateQuiz = () => {
    const newErrors = {};
    questions.forEach(q => {
      if (answers[q.id] === undefined) {
        newErrors[q.id] = 'Please select an answer for this question.';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Quiz with useCallback hook invocation from context (Experiment 1f & 2f)
  const handleSubmitQuiz = (e) => {
    e.preventDefault();
    if (!validateQuiz()) return;

    let correctCount = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const result = submitQuiz(course.id, answers, questions.length, correctCount);
    setQuizScore({
      score: result.score,
      passed: result.passed,
      correctCount,
      totalQuestions: questions.length
    });
    setIsSubmitted(true);
  };

  const handleRetake = () => {
    setAnswers({});
    setErrors({});
    setIsSubmitted(false);
    setQuizScore(null);
  };

  const answeredCount = Object.keys(answers).length;

  return (
    <div className="space-y-6">
      {/* Quiz Header & Status */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
            Knowledge Verification Quiz
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">{course.title}</h2>
          <p className="text-xs text-slate-500">
            {questions.length} Questions • 70% minimum score required to qualify for certificate
          </p>
        </div>

        {!isSubmitted && (
          <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-center">
            <span className="text-[11px] text-slate-500 font-semibold uppercase">Progress</span>
            <div className="text-sm font-bold text-slate-800">
              {answeredCount} / {questions.length} Answered
            </div>
          </div>
        )}
      </div>

      {/* Quiz Result Banner */}
      {isSubmitted && quizScore && (
        <div className={`p-6 rounded-2xl border text-center ${
          quizScore.passed
            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
            : 'bg-rose-50/80 border-rose-200 text-rose-900'
        }`}>
          <div className="inline-flex p-3 rounded-2xl bg-white shadow-sm mb-3">
            {quizScore.passed ? (
              <Award className="w-8 h-8 text-emerald-600" />
            ) : (
              <AlertCircle className="w-8 h-8 text-rose-600" />
            )}
          </div>
          <h3 className="text-xl font-bold">
            {quizScore.passed ? "Congratulations! Assessment Passed!" : "Quiz Score Below 70%"}
          </h3>
          <p className="text-sm mt-1">
            You scored <strong className="text-base">{quizScore.score}%</strong> ({quizScore.correctCount} of {quizScore.totalQuestions} correct).
          </p>
          <div className="flex justify-center gap-3 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetake}
              icon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Retake Quiz
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(`/learning/assignments?courseId=${course.id}`)}
              icon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Proceed to Assignment
            </Button>
          </div>
        </div>
      )}

      {/* Controlled Quiz Questions Form */}
      <form onSubmit={handleSubmitQuiz} className="space-y-4">
        {questions.map((q, idx) => (
          <QuizQuestion
            key={q.id}
            questionNumber={idx + 1}
            question={q}
            selectedAnswer={answers[q.id]}
            onSelectAnswer={handleSelectAnswer}
            isSubmitted={isSubmitted}
            error={errors[q.id]}
          />
        ))}

        {/* Action Bottom Bar */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-slate-500">
            {isSubmitted
              ? "All responses evaluated against official curriculum key."
              : "Review your chosen options before submitting for grading."}
          </span>

          <div className="flex gap-3">
            {!isSubmitted ? (
              <Button
                type="submit"
                variant="primary"
                size="md"
                icon={<CheckCircle className="w-4 h-4" />}
              >
                Submit Quiz for Grading
              </Button>
            ) : (
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={() => navigate(`/learning/assignments?courseId=${course.id}`)}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Continue to Assignment
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Quiz;
