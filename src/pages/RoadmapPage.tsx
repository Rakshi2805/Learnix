import React, { useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  Map, 
  Award, 
  Compass, 
  Clock, 
  ArrowRight, 
  Lock, 
  Play, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { DiagnosticResult, LearningGoal, AILevel, LearningPace } from '../types/learner';
import { generatePersonalisedRoadmap } from '../data/roadmapData';
import { RoadmapTopic } from '../types/roadmap';

export const RoadmapPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve diagnostic result from location.state or fallback to sessionStorage
  const diagnosticData: DiagnosticResult | null = useMemo(() => {
    if (location.state && (location.state as DiagnosticResult).detectedLevel) {
      return location.state as DiagnosticResult;
    }
    try {
      const saved = sessionStorage.getItem('learnix_diagnostic_result');
      if (saved) {
        return JSON.parse(saved) as DiagnosticResult;
      }
    } catch {
      // ignore storage errors
    }
    return null;
  }, [location.state]);

  // If no diagnostic data is found, show friendly missing data state
  if (!diagnosticData) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto mb-6 flex items-center justify-center">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          No Diagnostic Assessment Found
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto mb-8">
          To generate your personalised learning roadmap, please complete your quick learner profile and 5-question diagnostic calibration first.
        </p>
        <Link
          to="/get-started"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 shadow-lg shadow-sky-500/25 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Start Diagnostic Assessment</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const { learnerName, score, detectedLevel, profile } = diagnosticData;
  const goal: LearningGoal = profile.learningGoal as LearningGoal || 'AI Fundamentals';
  const pace: LearningPace = profile.learningPace as LearningPace || 'Balanced';
  const level: AILevel = detectedLevel || 'Intermediate';

  // Generate the real personalized roadmap based on calibration data
  const roadmap = useMemo(() => {
    return generatePersonalisedRoadmap(goal, level, pace, score);
  }, [goal, level, pace, score]);

  const handleStartTopic = (topic: RoadmapTopic) => {
    if (topic.status === 'Current') {
      navigate(`/learn/${topic.id}`, {
        state: {
          topic,
          diagnosticData,
        }
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Top Breadcrumb / Badge */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-400 text-xs sm:text-sm font-semibold mb-4">
          <Map className="w-4 h-4" />
          <span>Personalised Learning Roadmap</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Your AI Learning Roadmap
        </h1>
        <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
          A targeted 5-step curriculum custom-built for your baseline, goal, and study pace.
        </p>
      </div>

      {/* Personalisation Summary Card */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-sm shadow-xl mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800/80 gap-4">
          <div>
            <h2 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
              Your Learning Profile
            </h2>
            <p className="text-xl sm:text-2xl font-bold text-white">
              {learnerName || 'Learner'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Detected Level:</span>
            <span className={`px-3 py-1 rounded-xl text-xs sm:text-sm font-bold border ${
              level === 'Beginner'
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                : level === 'Intermediate'
                ? 'bg-sky-500/15 border-sky-500/30 text-sky-400'
                : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
            }`}>
              {level}
            </span>
          </div>
        </div>

        {/* 4 Profile Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-6 mb-6">
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-indigo-400 mb-1">
              <Compass className="w-3.5 h-3.5" />
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Goal</span>
            </div>
            <p className="font-semibold text-sm text-white truncate" title={goal}>{goal}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-sky-400 mb-1">
              <Award className="w-3.5 h-3.5" />
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Detected Level</span>
            </div>
            <p className="font-semibold text-sm text-white">{level}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Quiz Score</span>
            </div>
            <p className="font-semibold text-sm text-white">{score} / 5</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-purple-400 mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Learning Pace</span>
            </div>
            <p className="font-semibold text-sm text-white">{pace}</p>
          </div>
        </div>

        {/* Why this roadmap? Section */}
        <div className="p-4 sm:p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-left">
          <div className="flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm space-y-1.5">
              <h3 className="font-semibold text-white">
                Why this roadmap?
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Your roadmap is based on your diagnostic performance, selected goal and preferred learning pace.
              </p>
              <p className="text-sky-300 font-medium text-xs sm:text-sm pt-1">
                {roadmap.scoreMessage}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Vertical Roadmap Steps */}
      <div className="space-y-6 relative mb-12">
        {/* Timeline connector line */}
        <div className="hidden sm:block absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-sky-500 via-indigo-500/50 to-slate-800 z-0" />

        {roadmap.topics.map((topic, index) => {
          const isCurrent = topic.status === 'Current';
          const isLocked = topic.status === 'Locked';
          const isCompleted = topic.status === 'Completed';

          return (
            <div 
              key={topic.id}
              className={`relative z-10 rounded-2xl border transition-all duration-300 ${
                isCurrent 
                  ? 'bg-slate-900/90 border-sky-500/70 ring-1 ring-sky-500/50 shadow-xl shadow-sky-500/10' 
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700/80 opacity-90'
              } p-5 sm:p-6`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Left Step & Info */}
                <div className="flex items-start gap-4">
                  {/* Step Circle Badge */}
                  <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center font-bold text-sm shadow-md transition-all ${
                    isCurrent
                      ? 'bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-sky-500/30'
                      : isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-900 text-slate-500 border border-slate-800'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : `Step ${topic.stepNumber}`}
                  </div>

                  {/* Title & Metadata */}
                  <div className="space-y-1.5 text-left">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-base sm:text-lg font-bold text-white">
                        {topic.title}
                      </h4>
                      {/* Status Badge */}
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
                        isCurrent
                          ? 'bg-sky-500/15 border-sky-500/30 text-sky-300 animate-pulse'
                          : isCompleted
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                          : 'bg-slate-800/80 border-slate-700/60 text-slate-400'
                      }`}>
                        {topic.status}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                      {topic.description}
                    </p>

                    {/* Metadata pills */}
                    <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <span className="text-slate-500">Difficulty:</span>
                        <span className={`font-medium ${
                          topic.difficulty === 'Beginner' ? 'text-amber-400' :
                          topic.difficulty === 'Intermediate' ? 'text-sky-400' : 'text-emerald-400'
                        }`}>
                          {topic.difficulty}
                        </span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{topic.estimatedTime}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Action Button */}
                <div className="sm:flex-shrink-0 pt-2 sm:pt-0">
                  {isCurrent ? (
                    <button
                      type="button"
                      onClick={() => handleStartTopic(topic)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 shadow-md shadow-sky-500/25 active:scale-95 transition-all"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>Start Topic</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-slate-500 bg-slate-900/80 border border-slate-800/80 cursor-not-allowed opacity-75"
                    >
                      <Lock className="w-3.5 h-3.5 text-slate-600" />
                      <span>Locked</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Navigation Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 border-t border-slate-900">
        <Link
          to="/get-started"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Retake Diagnostic Assessment</span>
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
        >
          <span>Return to Home</span>
        </Link>
      </div>
    </div>
  );
};
