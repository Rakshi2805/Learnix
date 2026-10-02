import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Brain, 
  Compass, 
  Clock, 
  Award, 
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { 
  LearnerProfile, 
  AILevel, 
  LearningGoal, 
  LearningPace, 
  DIAGNOSTIC_QUESTIONS, 
  calculateDetectedLevel, 
  DiagnosticResult 
} from '../types/learner';

type AssessmentStage = 'profile' | 'quiz' | 'result';

export const GetStartedPage: React.FC = () => {
  const navigate = useNavigate();

  // Step state
  const [stage, setStage] = useState<AssessmentStage>('profile');

  // Form Profile State
  const [profile, setProfile] = useState<LearnerProfile>({
    name: '',
    currentLevel: '',
    learningGoal: '',
    learningPace: '',
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof LearnerProfile, string>>>({});

  // Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [quizError, setQuizError] = useState<string>('');

  // Diagnostic Result State
  const [result, setResult] = useState<DiagnosticResult | null>(null);

  // Profile Form Validation
  const validateProfile = (): boolean => {
    const errors: Partial<Record<keyof LearnerProfile, string>> = {};

    if (!profile.name.trim()) {
      errors.name = 'Please enter your name.';
    }
    if (!profile.currentLevel) {
      errors.currentLevel = 'Please select your current AI/ML level.';
    }
    if (!profile.learningGoal) {
      errors.learningGoal = 'Please choose your primary learning goal.';
    }
    if (!profile.learningPace) {
      errors.learningPace = 'Please select your preferred learning pace.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateProfile()) {
      setStage('quiz');
      setCurrentQuestionIndex(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Quiz Navigation & Handlers
  const currentQuestion = DIAGNOSTIC_QUESTIONS[currentQuestionIndex];
  const totalQuestions = DIAGNOSTIC_QUESTIONS.length;

  const handleSelectAnswer = (optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionIndex
    }));
    setQuizError('');
  };

  const handleNextQuestion = () => {
    if (answers[currentQuestion.id] === undefined) {
      setQuizError('Please select an answer choice before moving forward.');
      return;
    }
    setQuizError('');
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    setQuizError('');
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = () => {
    // Check if the current question has an answer
    if (answers[currentQuestion.id] === undefined) {
      setQuizError('Please select an answer choice before submitting.');
      return;
    }

    // Check if all questions have been answered
    const unanswered = DIAGNOSTIC_QUESTIONS.filter(q => answers[q.id] === undefined);
    if (unanswered.length > 0) {
      setQuizError(`Please answer all questions before submitting. (${unanswered.length} question(s) remaining)`);
      return;
    }

    // Calculate score
    let calculatedScore = 0;
    DIAGNOSTIC_QUESTIONS.forEach(q => {
      if (answers[q.id] === q.correctAnswerIndex) {
        calculatedScore += 1;
      }
    });

    const detected = calculateDetectedLevel(calculatedScore);

    const diagnosticResult: DiagnosticResult = {
      learnerName: profile.name.trim(),
      score: calculatedScore,
      totalQuestions: totalQuestions,
      detectedLevel: detected,
      profile: { ...profile },
      submittedAt: new Date().toISOString()
    };

    setResult(diagnosticResult);
    // Store in sessionStorage so Roadmap retains data even on refresh
    try {
      sessionStorage.setItem('learnix_diagnostic_result', JSON.stringify(diagnosticResult));
    } catch {
      // ignore storage errors if unavailable
    }

    setStage('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToRoadmap = () => {
    if (result) {
      navigate('/roadmap', { state: result });
    } else {
      navigate('/roadmap');
    }
  };

  const handleRetakeDiagnostic = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setQuizError('');
    setResult(null);
    setStage('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Stage 1: Learner Profile */}
      {stage === 'profile' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-10 backdrop-blur-sm shadow-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-400 text-xs font-semibold mb-4">
              <User className="w-3.5 h-3.5" />
              <span>Step 1 of 2: Learner Profile</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Tell us about yourself
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-300">
              Customize your learning experience so Learnix can tailor explanations to your background.
            </p>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-6">
            {/* Field: Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-200 mb-2">
                Your Name <span className="text-rose-400">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={profile.name}
                onChange={(e) => {
                  setProfile({ ...profile, name: e.target.value });
                  if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
                }}
                placeholder="e.g. Alex Johnson"
                className={`w-full px-4 py-3 rounded-xl bg-slate-950/80 border text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                  formErrors.name 
                    ? 'border-rose-500/80 focus:ring-rose-500/40' 
                    : 'border-slate-800 focus:border-sky-500 focus:ring-sky-500/30'
                }`}
              />
              {formErrors.name && (
                <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {formErrors.name}
                </p>
              )}
            </div>

            {/* Field: Current AI/ML Level */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Current AI/ML Level <span className="text-rose-400">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(['Beginner', 'Intermediate', 'Advanced'] as AILevel[]).map((level) => {
                  const isSelected = profile.currentLevel === level;
                  return (
                    <button
                      type="button"
                      key={level}
                      onClick={() => {
                        setProfile({ ...profile, currentLevel: level });
                        if (formErrors.currentLevel) setFormErrors({ ...formErrors, currentLevel: undefined });
                      }}
                      className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        isSelected
                          ? 'border-sky-500 bg-sky-500/15 text-white shadow-md shadow-sky-500/10'
                          : 'border-slate-800 bg-slate-950/50 text-slate-300 hover:border-slate-700 hover:bg-slate-950'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="font-semibold text-sm">{level}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-sky-400" />}
                      </div>
                      <span className="text-xs text-slate-400">
                        {level === 'Beginner' && 'New to AI & ML concepts'}
                        {level === 'Intermediate' && 'Familiar with basic models'}
                        {level === 'Advanced' && 'Experienced practitioner'}
                      </span>
                    </button>
                  );
                })}
              </div>
              {formErrors.currentLevel && (
                <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {formErrors.currentLevel}
                </p>
              )}
            </div>

            {/* Field: Learning Goal */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Learning Goal <span className="text-rose-400">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {([
                  'AI Fundamentals',
                  'Machine Learning',
                  'Deep Learning',
                  'AI/ML Interviews',
                ] as LearningGoal[]).map((goal) => {
                  const isSelected = profile.learningGoal === goal;
                  return (
                    <button
                      type="button"
                      key={goal}
                      onClick={() => {
                        setProfile({ ...profile, learningGoal: goal });
                        if (formErrors.learningGoal) setFormErrors({ ...formErrors, learningGoal: undefined });
                      }}
                      className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-500/15 text-white shadow-md shadow-indigo-500/10'
                          : 'border-slate-800 bg-slate-950/50 text-slate-300 hover:border-slate-700 hover:bg-slate-950'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Compass className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`} />
                        <span className="font-medium text-sm">{goal}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                    </button>
                  );
                })}
              </div>
              {formErrors.learningGoal && (
                <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {formErrors.learningGoal}
                </p>
              )}
            </div>

            {/* Field: Preferred Learning Pace */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Preferred Learning Pace <span className="text-rose-400">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(['Quick', 'Balanced', 'Detailed'] as LearningPace[]).map((pace) => {
                  const isSelected = profile.learningPace === pace;
                  return (
                    <button
                      type="button"
                      key={pace}
                      onClick={() => {
                        setProfile({ ...profile, learningPace: pace });
                        if (formErrors.learningPace) setFormErrors({ ...formErrors, learningPace: undefined });
                      }}
                      className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        isSelected
                          ? 'border-purple-500 bg-purple-500/15 text-white shadow-md shadow-purple-500/10'
                          : 'border-slate-800 bg-slate-950/50 text-slate-300 hover:border-slate-700 hover:bg-slate-950'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <div className="flex items-center gap-1.5">
                          <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-purple-400' : 'text-slate-400'}`} />
                          <span className="font-semibold text-sm">{pace}</span>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                      </div>
                      <span className="text-xs text-slate-400">
                        {pace === 'Quick' && 'Fast high-yield summaries'}
                        {pace === 'Balanced' && 'Standard concepts & labs'}
                        {pace === 'Detailed' && 'Deep mathematical rigor'}
                      </span>
                    </button>
                  );
                })}
              </div>
              {formErrors.learningPace && (
                <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {formErrors.learningPace}
                </p>
              )}
            </div>

            {/* Submit button */}
            <div className="pt-4 border-t border-slate-800/80">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 shadow-lg shadow-sky-500/25 active:scale-98 transition-all duration-200"
              >
                <span>Continue to Diagnostic Quiz</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stage 2: Diagnostic Assessment Quiz */}
      {stage === 'quiz' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-10 backdrop-blur-sm shadow-xl">
          {/* Progress Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <div className="flex items-center gap-1.5 text-sky-400 font-semibold">
                <Brain className="w-4 h-4" />
                <span>Diagnostic Assessment</span>
              </div>
              <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-sky-500 to-indigo-600 transition-all duration-300 rounded-full"
                style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Details */}
          <div className="mb-6">
            <span className="inline-block text-[11px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-3">
              Topic: {currentQuestion.topic}
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((optionText, optIdx) => {
              const isSelected = answers[currentQuestion.id] === optIdx;
              const optionLetters = ['A', 'B', 'C', 'D'];

              return (
                <button
                  type="button"
                  key={optIdx}
                  onClick={() => handleSelectAnswer(optIdx)}
                  className={`w-full p-4 rounded-xl border text-left flex items-start gap-3 transition-all duration-200 ${
                    isSelected
                      ? 'border-sky-500 bg-sky-500/15 text-white shadow-md shadow-sky-500/15 ring-1 ring-sky-500'
                      : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:bg-slate-900/80'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    isSelected 
                      ? 'bg-sky-500 text-white' 
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {optionLetters[optIdx]}
                  </span>
                  <span className="text-sm font-medium leading-relaxed pt-0.5">
                    {optionText}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quiz Error Alert */}
          {quizError && (
            <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{quizError}</span>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                currentQuestionIndex === 0
                  ? 'opacity-40 cursor-not-allowed text-slate-600 bg-slate-950'
                  : 'text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {currentQuestionIndex < totalQuestions - 1 ? (
              <button
                type="button"
                onClick={handleNextQuestion}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 shadow-md shadow-sky-500/20 transition-all active:scale-98"
              >
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitQuiz}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 shadow-md shadow-emerald-500/25 transition-all active:scale-98"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Diagnostic</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Stage 3: Diagnostic Result */}
      {stage === 'result' && result && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-10 backdrop-blur-sm shadow-xl text-center">
          {/* Result Icon */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 p-0.5 mx-auto mb-6 flex items-center justify-center shadow-xl shadow-sky-500/25">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Award className="w-8 h-8 text-sky-400" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Diagnostic Complete</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            Assessment Results for {result.learnerName}
          </h1>

          <p className="text-sm text-slate-400 max-w-lg mx-auto mb-8">
            Your calibration test is complete! Here is how your diagnostic baseline was evaluated.
          </p>

          {/* Results Summary Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto mb-8">
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col items-center justify-center">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                Quiz Score
              </span>
              <div className="text-3xl font-extrabold text-white">
                <span className="text-sky-400">{result.score}</span> / {result.totalQuestions}
              </div>
              <span className="text-xs text-slate-500 mt-1">
                {Math.round((result.score / result.totalQuestions) * 100)}% accuracy
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col items-center justify-center">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                Detected Starting Level
              </span>
              <div className="text-2xl font-extrabold">
                <span className={`px-3 py-0.5 rounded-lg border text-sm sm:text-base ${
                  result.detectedLevel === 'Beginner'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    : result.detectedLevel === 'Intermediate'
                    ? 'bg-sky-500/10 border-sky-500/30 text-sky-400'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                }`}>
                  {result.detectedLevel}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 mt-1.5">
                {result.score <= 2 && 'Score: 0–2 (Beginner)'}
                {result.score >= 3 && result.score <= 4 && 'Score: 3–4 (Intermediate)'}
                {result.score === 5 && 'Score: 5 (Advanced)'}
              </span>
            </div>
          </div>

          {/* Explanation Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-left max-w-xl mx-auto mb-8">
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-slate-300 leading-relaxed">
                <p className="font-semibold text-white mb-1">
                  How Learnix will use this result:
                </p>
                <p>
                  This evaluation will be used to calibrate your personalised learning path. 
                  Based on your <span className="text-sky-300 font-semibold">{result.detectedLevel}</span> baseline and interest in <span className="text-indigo-300 font-semibold">{result.profile.learningGoal}</span>, 
                  your tutor will balance theory and practice at a <span className="text-purple-300 font-semibold">{result.profile.learningPace}</span> pace.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleRetakeDiagnostic}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Diagnostic</span>
            </button>

            <button
              type="button"
              onClick={handleProceedToRoadmap}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 hover:from-sky-400 hover:to-indigo-500 shadow-lg shadow-sky-500/25 active:scale-98 transition-all"
            >
              <span>Create My Learning Path</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
