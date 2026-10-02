import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  RotateCcw,
  Target,
  Trophy,
  XCircle,
} from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { RoadmapTopic } from '../types/roadmap';
import { findTopicById } from '../data/roadmapData';
import { DiagnosticResult } from '../types/learner';
import { getQuizForTopic, QuizQuestion } from '../data/quizData_temp';

interface QuizResult {
  topicId: string;
  topicTitle: string;
  score: number;
  total: number;
  completedAt: string;
}

interface CompletedTopic {
  topicId: string;
  topicTitle: string;
  score: number;
  total: number;
  completedAt: string;
}

export const TopicQuizPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { topicId } = useParams<{ topicId: string }>();

  const diagnosticData =
    (location.state as DiagnosticResult | undefined) ||
    JSON.parse(sessionStorage.getItem('learnix_diagnostic') || 'null');

  /*
   * findTopicById() returns RoadmapTopic | null
   */
  const topic: RoadmapTopic | null = topicId
    ? findTopicById(
        topicId,
        diagnosticData?.detectedLevel,
        diagnosticData?.profile?.learningPace
      )
    : null;

  /*
   * Get questions from quizData.ts
   */
  const questions: QuizQuestion[] = useMemo(() => {
    if (!topic) {
      return [];
    }

    return getQuizForTopic(topic);
  }, [topic]);

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [selectedAnswer, setSelectedAnswer] =
    useState<string | null>(null);

  const [answers, setAnswers] =
    useState<Record<number, string>>({});

  const [showResult, setShowResult] = useState(false);

  // --------------------------------------------------
  // TOPIC NOT FOUND
  // --------------------------------------------------

  if (!topic) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
        <div className="text-center">

          <Target className="w-14 h-14 mx-auto mb-4 text-blue-400" />

          <h1 className="text-2xl font-bold mb-2">
            Topic Not Found
          </h1>

          <p className="text-slate-400 mb-6">
            We could not find this learning topic.
          </p>

          <button
            onClick={() =>
              navigate('/roadmap', {
                state: diagnosticData,
              })
            }
            className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition"
          >
            Back to Roadmap
          </button>

        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // QUIZ NOT AVAILABLE
  // --------------------------------------------------

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
        <div className="text-center">

          <BrainCircuit className="w-14 h-14 mx-auto mb-4 text-blue-400" />

          <h1 className="text-2xl font-bold mb-2">
            Quiz Not Available
          </h1>

          <p className="text-slate-400 mb-6">
            There are no quiz questions available for this topic yet.
          </p>

          <button
            onClick={() =>
              navigate('/roadmap', {
                state: diagnosticData,
              })
            }
            className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition"
          >
            Back to Roadmap
          </button>

        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // CALCULATE SCORE
  // --------------------------------------------------

  const calculateScore = (
    submittedAnswers: Record<number, string> = answers
  ) => {
    return questions.reduce((score, question, index) => {
      return (
        score +
        (submittedAnswers[index] === question.correctAnswer
          ? 1
          : 0)
      );
    }, 0);
  };

  // --------------------------------------------------
  // FINISH QUIZ
  // --------------------------------------------------

  const finishQuiz = () => {
    const finalAnswers = {
      ...answers,
      [currentQuestion]:
        selectedAnswer || answers[currentQuestion],
    };

    const score = calculateScore(finalAnswers);

    const result: QuizResult = {
      topicId: topic.id,
      topicTitle: topic.title,
      score,
      total: questions.length,
      completedAt: new Date().toISOString(),
    };

    // Save latest quiz result
    sessionStorage.setItem(
      'learnix_topic_quiz_result',
      JSON.stringify(result)
    );

    // ----------------------------------------------
    // Save completed topics
    // ----------------------------------------------

    const existingCompleted: CompletedTopic[] =
      JSON.parse(
        sessionStorage.getItem(
          'learnix_completed_topics'
        ) || '[]'
      );

    /*
     * If the learner repeats the same quiz,
     * replace the old result for that topic.
     */
    const updatedCompleted = existingCompleted.filter(
      (item) => item.topicId !== topic.id
    );

    updatedCompleted.push({
      topicId: topic.id,
      topicTitle: topic.title,
      score,
      total: questions.length,
      completedAt: result.completedAt,
    });

    sessionStorage.setItem(
      'learnix_completed_topics',
      JSON.stringify(updatedCompleted)
    );

    setAnswers(finalAnswers);
    setShowResult(true);
  };

  // --------------------------------------------------
  // NEXT QUESTION
  // --------------------------------------------------

  const handleNext = () => {
    if (!selectedAnswer) {
      return;
    }

    const updatedAnswers = {
      ...answers,
      [currentQuestion]: selectedAnswer,
    };

    setAnswers(updatedAnswers);

    if (currentQuestion < questions.length - 1) {
      const nextQuestion = currentQuestion + 1;

      setCurrentQuestion(nextQuestion);

      setSelectedAnswer(
        updatedAnswers[nextQuestion] || null
      );
    } else {
      /*
       * Last question
       */
      const finalScore = calculateScore(updatedAnswers);

      const result: QuizResult = {
        topicId: topic.id,
        topicTitle: topic.title,
        score: finalScore,
        total: questions.length,
        completedAt: new Date().toISOString(),
      };

      sessionStorage.setItem(
        'learnix_topic_quiz_result',
        JSON.stringify(result)
      );

      // Save completed topic
      const existingCompleted: CompletedTopic[] =
        JSON.parse(
          sessionStorage.getItem(
            'learnix_completed_topics'
          ) || '[]'
        );

      const updatedCompleted = existingCompleted.filter(
        (item) => item.topicId !== topic.id
      );

      updatedCompleted.push({
        topicId: topic.id,
        topicTitle: topic.title,
        score: finalScore,
        total: questions.length,
        completedAt: result.completedAt,
      });

      sessionStorage.setItem(
        'learnix_completed_topics',
        JSON.stringify(updatedCompleted)
      );

      setAnswers(updatedAnswers);
      setShowResult(true);
    }
  };

  // --------------------------------------------------
  // PREVIOUS QUESTION
  // --------------------------------------------------

  const handlePrevious = () => {
    if (currentQuestion === 0) {
      return;
    }

    const previousQuestion = currentQuestion - 1;

    setCurrentQuestion(previousQuestion);

    setSelectedAnswer(
      answers[previousQuestion] || null
    );
  };

  // --------------------------------------------------
  // RESTART QUIZ
  // --------------------------------------------------

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers({});
    setShowResult(false);
  };

  // --------------------------------------------------
  // RESULT VALUES
  // --------------------------------------------------

  const score = calculateScore();

  const percentage = Math.round(
    (score / questions.length) * 100
  );

  const isRevision = score <= 2;

  const isContinue =
    score >= 3 && score <= 4;

  const isAdvance = score === 5;

  // --------------------------------------------------
  // RECOMMENDED ACTION
  // --------------------------------------------------

  const handleRecommendedAction = () => {
    if (isRevision) {
      navigate(`/learn/${topic.id}`, {
        state: {
          topic,
          diagnosticData,
        },
      });

      return;
    }

    navigate('/roadmap', {
      state: diagnosticData,
    });
  };

  // ==================================================
  // RESULT SCREEN
  // ==================================================

  if (showResult) {
    return (
      <div className="min-h-screen bg-slate-950 text-white px-6 py-10">

        <div className="max-w-3xl mx-auto">

          <button
            onClick={() =>
              navigate('/roadmap', {
                state: diagnosticData,
              })
            }
            className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Roadmap
          </button>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center">

            {/* Icon */}

            {isAdvance ? (
              <Trophy className="w-16 h-16 mx-auto mb-5 text-yellow-400" />
            ) : isContinue ? (
              <CheckCircle2 className="w-16 h-16 mx-auto mb-5 text-green-400" />
            ) : (
              <XCircle className="w-16 h-16 mx-auto mb-5 text-orange-400" />
            )}

            <p className="text-sm text-blue-400 font-semibold uppercase tracking-wide mb-2">
              Topic Quiz Completed
            </p>

            <h1 className="text-3xl font-bold mb-3">
              {topic.title}
            </h1>

            {/* Score */}

            <div className="text-6xl font-bold mb-2">
              {score}/{questions.length}
            </div>

            <p className="text-slate-400 mb-8">
              {percentage}% Score
            </p>

            {/* Recommendation */}

            <div className="bg-slate-800/70 rounded-2xl p-6 mb-8">

              <h2 className="text-xl font-bold mb-2">

                {isRevision
                  ? 'Revise This Topic'
                  : isAdvance
                  ? 'Advance to the Next Topic'
                  : 'Continue to the Next Topic'}

              </h2>

              <p className="text-slate-400">

                {isRevision
                  ? 'Your score is below 50%. Review this topic and try the quiz again.'
                  : isAdvance
                  ? 'Excellent performance! You are ready for a more advanced topic.'
                  : 'You have a good understanding. Continue to the next topic in your learning path.'}

              </p>

            </div>

            {/* Adaptive Rule */}

            <div className="text-left bg-slate-950 border border-slate-800 rounded-2xl p-5 mb-8">

              <h3 className="font-semibold mb-4">
                Adaptive Learning Rule
              </h3>

              <div className="space-y-3 text-sm">

                <div className="flex justify-between">
                  <span className="text-slate-400">
                    0–2 correct
                  </span>

                  <span className="text-orange-400 font-medium">
                    Revision
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">
                    3–4 correct
                  </span>

                  <span className="text-blue-400 font-medium">
                    Continue
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">
                    5 correct
                  </span>

                  <span className="text-green-400 font-medium">
                    Advance
                  </span>
                </div>

              </div>

            </div>

            {/* Buttons */}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">

              <button
                onClick={handleRecommendedAction}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition font-medium"
              >
                {isRevision
                  ? 'Revise Topic'
                  : 'Start Recommended'}
              </button>

              <button
                onClick={restartQuiz}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition font-medium flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Repeat Quiz
              </button>

              <button
                onClick={() =>
                  navigate('/roadmap', {
                    state: diagnosticData,
                  })
                }
                className="px-6 py-3 rounded-xl border border-slate-700 hover:bg-slate-800 transition font-medium"
              >
                Back to Roadmap
              </button>

            </div>

          </div>
        </div>
      </div>
    );
  }

  // ==================================================
  // QUIZ SCREEN
  // ==================================================

  const question = questions[currentQuestion];

  const progress =
    ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-10">

      <div className="max-w-3xl mx-auto">

        {/* Back */}

        <button
          onClick={() =>
            navigate(`/learn/${topic.id}`, {
              state: {
                topic,
                diagnosticData,
              },
            })
          }
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Topic
        </button>

        {/* Header */}

        <div className="mb-8">

          <div className="flex items-center justify-between mb-3">

            <div>

              <p className="text-sm text-blue-400 font-medium">
                Topic Quiz
              </p>

              <h1 className="text-2xl font-bold">
                {topic.title}
              </h1>

            </div>

            <div className="flex items-center gap-2 text-slate-400 text-sm">

              <BrainCircuit className="w-5 h-5" />

              Question {currentQuestion + 1} of {questions.length}

            </div>

          </div>

          {/* Progress */}

          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">

            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>

        {/* Question */}

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7">

          <h2 className="text-xl font-semibold leading-relaxed mb-7">
            {question.question}
          </h2>

          {/* Options */}

          <div className="space-y-3">

            {question.options.map((option) => {

              const isSelected =
                selectedAnswer === option.id;

              return (
                <button
                  key={option.id}
                  onClick={() =>
                    setSelectedAnswer(option.id)
                  }
                  className={`w-full text-left p-4 rounded-xl border transition ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500/10 text-white'
                      : 'border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-500 hover:bg-slate-800'
                  }`}
                >

                  <div className="flex items-center gap-4">

                    <span
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {option.id.toUpperCase()}
                    </span>

                    <span>
                      {option.text}
                    </span>

                  </div>

                </button>
              );
            })}

          </div>

          {/* Navigation */}

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-800">

            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            <button
              onClick={handleNext}
              disabled={!selectedAnswer}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-2"
            >

              {currentQuestion === questions.length - 1
                ? 'Finish Quiz'
                : 'Next Question'}

              <ArrowRight className="w-4 h-4" />

            </button>

          </div>

        </div>

        <div className="mt-6 text-center text-sm text-slate-500">
          Answer each question based on what you learned from this topic.
        </div>

      </div>

    </div>
  );
};

export default TopicQuizPage;