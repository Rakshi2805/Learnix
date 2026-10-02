import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Award,
  BarChart3,
  CheckCircle2,
  Target,
  TrendingUp,
} from 'lucide-react';
import { DiagnosticResult } from '../types/learner';

interface QuizResult {
  topicId: string;
  topicTitle: string;
  score: number;
  total: number;
  percentage: number;
  recommendation: string;
  completedAt: string;
}

export default function ProgressDashboardPage() {
  const diagnosticData = useMemo<DiagnosticResult | null>(() => {
    try {
      const saved = sessionStorage.getItem('learnix_diagnostic_result');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }, []);

  const completedTopics = useMemo<string[]>(() => {
    try {
      const saved = localStorage.getItem('learnix_completed_topics');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }, []);

  const latestQuiz = useMemo<QuizResult | null>(() => {
    try {
      const saved = localStorage.getItem('learnix_topic_quiz_result');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }, []);

  const totalTopics = 5;

  const progressPercentage = Math.min(
    Math.round((completedTopics.length / totalTopics) * 100),
    100
  );

  const recommendation =
    latestQuiz?.recommendation ||
    'Complete your first topic quiz to receive an adaptive recommendation.';

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <Link
            to="/roadmap"
            className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Roadmap
          </Link>

          <div className="flex items-center gap-3">
            <BarChart3 className="text-cyan-400" size={32} />
            <div>
              <h1 className="text-3xl font-bold">Progress Dashboard</h1>
              <p className="mt-1 text-slate-400">
                Track your personalised learning progress.
              </p>
            </div>
          </div>
        </div>

        {/* Learner information */}
        <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <p className="text-sm text-slate-400">Learner</p>
              <p className="mt-1 text-xl font-semibold">
                {diagnosticData?.learnerName || 'Learner'}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-400">Current Level</p>
              <p className="mt-1 text-xl font-semibold">
                {diagnosticData?.detectedLevel || 'Not assessed'}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-400">Learning Goal</p>
              <p className="mt-1 text-xl font-semibold">
                {diagnosticData?.profile?.learningGoal || 'Not selected'}
              </p>
            </div>
          </div>
        </div>

        {/* Progress cards */}
        <div className="grid gap-6 md:grid-cols-3">

          {/* Overall progress */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Overall Progress</p>
                <p className="mt-1 text-3xl font-bold">
                  {progressPercentage}%
                </p>
              </div>

              <TrendingUp className="text-cyan-400" size={30} />
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-cyan-400 transition-all"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            <p className="mt-3 text-sm text-slate-400">
              {completedTopics.length} of {totalTopics} topics completed
            </p>
          </div>

          {/* Diagnostic score */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Diagnostic Score</p>
                <p className="mt-1 text-3xl font-bold">
                  {diagnosticData
                    ? `${diagnosticData.score}/${diagnosticData.totalQuestions}`
                    : '—'}
                </p>
              </div>

              <Target className="text-cyan-400" size={30} />
            </div>

            <p className="text-sm text-slate-400">
              Initial knowledge assessment
            </p>
          </div>

          {/* Latest quiz */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Latest Topic Quiz</p>
                <p className="mt-1 text-3xl font-bold">
                  {latestQuiz ? `${latestQuiz.percentage}%` : '—'}
                </p>
              </div>

              <Award className="text-cyan-400" size={30} />
            </div>

            <p className="text-sm text-slate-400">
              {latestQuiz?.topicTitle || 'No quiz completed yet'}
            </p>
          </div>
        </div>

        {/* Recommendation */}
        <div className="mt-6 rounded-2xl border border-cyan-900 bg-slate-900 p-6">
          <div className="flex gap-4">
            <Target className="mt-1 shrink-0 text-cyan-400" size={24} />

            <div>
              <h2 className="text-lg font-semibold">
                Adaptive Recommendation
              </h2>

              <p className="mt-2 text-slate-300">
                {recommendation}
              </p>
            </div>
          </div>
        </div>

        {/* Completed topics */}
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-5 text-xl font-semibold">
            Completed Topics
          </h2>

          {completedTopics.length === 0 ? (
            <p className="text-slate-400">
              No topics completed yet. Start learning from your roadmap.
            </p>
          ) : (
            <div className="space-y-3">
              {completedTopics.map((topicId) => (
                <div
                  key={topicId}
                  className="flex items-center gap-3 rounded-xl bg-slate-800 px-4 py-3"
                >
                  <CheckCircle2
                    size={20}
                    className="text-green-400"
                  />

                  <span className="text-slate-200">
                    {topicId}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            to="/roadmap"
            className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-400"
          >
            Continue Learning
          </Link>

          <Link
            to="/"
            className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-white hover:bg-slate-800"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}