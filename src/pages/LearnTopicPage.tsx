import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Bot,
  BrainCircuit,
  CheckCircle2,
  Clock,
  HelpCircle,
  Lightbulb,
  Loader2,
  Send,
  Target,
  User,
} from 'lucide-react';

import { RoadmapTopic } from '../types/roadmap';
import { findTopicById } from '../data/roadmapData';
import { AILevel, DiagnosticResult } from '../types/learner';
import { askAiTutor } from '../services/tutorService';

interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
}

/* =========================================================
   LOCAL BACKUP TUTOR
   ========================================================= */

function getDemoTutorResponse(
  question: string,
  topicTitle: string,
  learnerLevel: AILevel
): string {
  const q = question.toLowerCase();

  const isTamil =
    q.includes('tamil') ||
    q.includes('தமிழ்') ||
    q.includes('tanglish');

  if (isTamil) {
    return `🟣 ${topicTitle} — Simple Tamil/Tanglish Explanation

${topicTitle} na AI/ML-la important-aana oru concept.

Simple-ah sonna:

Input
↓
AI / ML Process
↓
Output

Example:

Oru email spam-aa illa normal email-aa nu identify panna,
AI system previous emails-la irundhu patterns learn pannum.

For example:

• "You won a prize"
• "Click this link"
• "Send money"

Maadhiri patterns irundha,
system adha suspicious/spam-nu identify panna kathukkum.

${learnerLevel} learner-aa irukkumbodhu,
first basic idea-va understand pannunga.

Remember:

Concept → Working → Example → Practice`;
  }

  if (
    q.includes('interview') ||
    q.includes('interview question')
  ) {
    return `🎯 Interview Preparation — ${topicTitle}

1. What is ${topicTitle}?

${topicTitle} is an important concept in AI/ML that helps a system process information and produce useful results.

2. Why is it important?

It helps AI/ML systems solve real-world problems.

3. How does it work?

Input
↓
Processing / Learning
↓
Prediction / Result

4. Give a real-world example.

Spam email detection is one example.

5. How would you explain it to a beginner?

Start with the basic idea, then explain the working and give one practical example.

💡 Interview Tip:
Don't only memorize the definition. Explain the concept in your own words.`;
  }

  if (
    q.includes('example') ||
    q.includes('real-world') ||
    q.includes('real world') ||
    q.includes('application')
  ) {
    return `🌍 Real-World Example of ${topicTitle}

Consider a spam email filter.

Past Email Data
↓
Learn Patterns
↓
AI/ML Model
↓
New Email
↓
Spam / Not Spam

The important idea is:

Data → Learning → Prediction

As a ${learnerLevel} learner, first understand this basic flow.`;
  }

  if (
    q.includes('exam') ||
    q.includes('revision') ||
    q.includes('remember') ||
    q.includes('study')
  ) {
    return `📚 Exam Preparation — ${topicTitle}

Remember these points:

1. Definition
2. Purpose
3. Working
4. Example
5. Advantages
6. Limitations

Quick memory pattern:

Definition
↓
Purpose
↓
Working
↓
Example
↓
Advantages
↓
Limitations

Try explaining ${topicTitle} without looking at your notes.`;
  }

  if (
    q.includes('simple') ||
    q.includes('explain') ||
    q.includes('what is') ||
    q.includes('meaning')
  ) {
    return `💡 ${topicTitle} — Simple Explanation

Let's understand it step by step.

1. What is it?

${topicTitle} is an important concept in AI and machine learning.

2. Basic idea:

Input
↓
AI / ML Process
↓
Output

3. Real-world example:

A spam email filter receives an email,
analyses useful information,
and predicts:

Spam
or
Not Spam

4. Remember:

Concept → Working → Example → Result`;
  }

  return `Let's understand ${topicTitle} step by step.

Step 1 — Understand the concept

First learn what ${topicTitle} means.

Step 2 — Understand why it is used

Think about what problem it solves.

Step 3 — Understand the basic flow

Input
↓
AI / ML Processing
↓
Output

Step 4 — Give a real-world example

For example:

• Spam detection
• Recommendation systems
• Fraud detection
• Image recognition
• Voice assistants

Step 5 — Practice

Try answering:

"What is ${topicTitle}?"
"What problem does it solve?"
"Can I give one real-world example?"

You are learning at the ${learnerLevel} level.`;
}

/* =========================================================
   PAGE
   ========================================================= */

export const LearnTopicPage: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  /* =========================================================
     GET TOPIC
     ========================================================= */

  const topic = useMemo<RoadmapTopic | null>(() => {
    try {
      const state = location.state as
        | {
            topic?: RoadmapTopic;
          }
        | null
        | undefined;

      if (state?.topic) {
        return state.topic;
      }

      if (topicId) {
        return findTopicById(topicId);
      }
    } catch (error) {
      console.error('Error loading topic:', error);
    }

    return null;
  }, [location.state, topicId]);

  /* =========================================================
     GET DIAGNOSTIC DATA
     ========================================================= */

  const diagnosticData = useMemo<DiagnosticResult | null>(() => {
    try {
      const state = location.state as
        | {
            diagnosticData?: DiagnosticResult;
          }
        | null
        | undefined;

      if (state?.diagnosticData) {
        return state.diagnosticData;
      }

      const saved = sessionStorage.getItem(
        'learnix_diagnostic_result'
      );

      if (saved) {
        return JSON.parse(saved) as DiagnosticResult;
      }
    } catch (error) {
      console.error('Error loading learner data:', error);
    }

    return null;
  }, [location.state]);

  /* =========================================================
     PERSONALISATION
     ========================================================= */

  const learnerLevel: AILevel =
    diagnosticData?.detectedLevel ||
    topic?.difficulty ||
    'Beginner';

  const learnerGoal =
    diagnosticData?.profile?.learningGoal ||
    'AI Fundamentals';

  /* =========================================================
     AUTO SCROLL
     ========================================================= */

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages, isLoading]);

  /* =========================================================
     BACK TO ROADMAP
     ========================================================= */

  const handleBackToRoadmap = () => {
    if (diagnosticData) {
      navigate('/roadmap', {
        state: diagnosticData,
      });
    } else {
      navigate('/roadmap');
    }
  };

  /* =========================================================
     ADD MESSAGE
     ========================================================= */

  const addUserMessage = (text: string) => {
    const message: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages((previous) => [...previous, message]);
  };

  const addTutorMessage = (text: string) => {
    const message: ChatMessage = {
      id: `tutor-${Date.now()}`,
      sender: 'tutor',
      text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages((previous) => [...previous, message]);
  };

  /* =========================================================
     ASK AI TUTOR
     ========================================================= */

  const handleAskTutor = async (
    event?: React.FormEvent
  ) => {
    event?.preventDefault();

    const question = inputQuestion.trim();

    if (!question || isLoading || !topic) {
      return;
    }

    setErrorMessage(null);

    addUserMessage(question);
    setInputQuestion('');
    setIsLoading(true);

    try {
      const response = await askAiTutor({
        topic: topic.title,
        learnerLevel,
        learnerGoal,
        userQuestion: question,
      });

      /* OpenRouter success */
      if (response.answer) {
        setIsDemoMode(false);
        addTutorMessage(response.answer);
        return;
      }

      /* OpenRouter failed → local backup */
      console.warn(
        '[Learnix] AI Tutor unavailable:',
        response.error
      );

      setIsDemoMode(true);

      addTutorMessage(
        `🧪 Demo Tutor Mode\n\n${getDemoTutorResponse(
          question,
          topic.title,
          learnerLevel
        )}`
      );
    } catch (error) {
      console.error(
        '[Learnix] Tutor request failed:',
        error
      );

      setIsDemoMode(true);

      addTutorMessage(
        `🧪 Demo Tutor Mode\n\n${getDemoTutorResponse(
          question,
          topic.title,
          learnerLevel
        )}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* =========================================================
     SUGGESTIONS
     ========================================================= */

  const suggestedQuestions = [
    'Explain this topic simply',
    'Give me a real-world example',
    'What should I remember for an exam?',
    'Prepare me for interview questions',
    'Explain this in Tamil',
  ];

  const handleSuggestion = (question: string) => {
    setInputQuestion(question);
    setErrorMessage(null);

    setTimeout(() => {
      textareaRef.current?.focus();
    }, 50);
  };

  /* =========================================================
     TOPIC NOT FOUND
     ========================================================= */

  if (!topic) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-amber-400" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-3">
          Topic Not Found
        </h1>

        <p className="text-slate-400 text-sm mb-6">
          The requested learning topic could not be found.
        </p>

        <Link
          to="/roadmap"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Roadmap
        </Link>
      </div>
    );
  }

  /* =========================================================
     UI
     ========================================================= */

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

      {/* BACK BUTTON */}
      <button
        type="button"
        onClick={handleBackToRoadmap}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Roadmap
      </button>

      {/* =====================================================
          TOPIC CARD
          ===================================================== */}

      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">

        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-400 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            Step {topic.stepNumber} of 5
          </div>

          <div className="flex items-center gap-2">

            <span
              className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                topic.difficulty === 'Beginner'
                  ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                  : topic.difficulty === 'Intermediate'
                  ? 'bg-sky-500/15 border-sky-500/30 text-sky-400'
                  : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
              }`}
            >
              {topic.difficulty}
            </span>

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs text-slate-400 bg-slate-950 border border-slate-800">
              <Clock className="w-3 h-3" />
              {topic.estimatedTime}
            </span>

          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          {topic.title}
        </h1>

        <p className="mt-3 text-sm text-slate-400">
          {topic.description}
        </p>

        {/* INTRODUCTION */}

        <div className="mt-6 p-5 rounded-2xl bg-slate-950/70 border border-slate-800">

          <h2 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-3 flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-sky-400" />
            Topic Introduction
          </h2>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
            {topic.introduction}
          </p>

        </div>

        {/* OBJECTIVES */}

        <div className="mt-6">

          <h2 className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-indigo-400" />
            Learning Objectives
          </h2>

          <div className="space-y-2">

            {topic.objectives.map(
              (objective, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-slate-300 text-sm"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />

                  <span>{objective}</span>
                </div>
              )
            )}

          </div>
        </div>
      </div>

      {/* =====================================================
          AI TUTOR
          ===================================================== */}

      <section className="bg-slate-900/80 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl">

        {/* HEADER */}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-500 p-0.5">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-sky-400" />
              </div>
            </div>

            <div>

              <div className="flex items-center gap-2">

                <h2 className="text-xl font-bold text-white">
                  AI Tutor
                </h2>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                    isDemoMode
                      ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                      : 'bg-sky-500/10 border-sky-500/20 text-sky-400'
                  }`}
                >
                  {isDemoMode
                    ? 'Backup Mode'
                    : 'OpenRouter AI'}
                </span>

              </div>

              <p className="text-xs sm:text-sm text-slate-400">
                {isDemoMode
                  ? 'AI unavailable for the previous request. Try again.'
                  : 'Personalised AI explanations based on your learning level.'}
              </p>

            </div>
          </div>

          {/* PERSONALISATION */}

          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">

            <span>Level:</span>

            <span className="font-semibold text-sky-300">
              {learnerLevel}
            </span>

            <span>•</span>

            <span className="text-slate-300">
              {learnerGoal}
            </span>

          </div>

        </div>

        {/* =================================================
            SUGGESTIONS
            ================================================= */}

        <div className="pt-6">

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            Suggested Questions
          </div>

          <div className="flex flex-wrap gap-2">

            {suggestedQuestions.map(
              (question, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() =>
                    handleSuggestion(question)
                  }
                  className="px-3 py-2 rounded-xl text-xs sm:text-sm font-medium bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-600 hover:bg-slate-800 transition"
                >
                  {question}
                </button>
              )
            )}

          </div>
        </div>

        {/* =================================================
            CHAT
            ================================================= */}

        <div className="my-6">

          {messages.length === 0 ? (

            <div className="p-6 rounded-2xl bg-slate-950/50 border border-slate-800 text-center">

              <HelpCircle className="w-7 h-7 mx-auto mb-3 text-slate-600" />

              <p className="text-sm font-medium text-slate-300">
                No questions yet
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Ask the AI Tutor anything about this topic.
              </p>

            </div>

          ) : (

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">

              {messages.map((message) => (

                <div
                  key={message.id}
                  className={`flex items-start gap-2.5 ${
                    message.sender === 'user'
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >

                  {/* AI ICON */}

                  {message.sender === 'tutor' && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 p-0.5 flex-shrink-0">
                      <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                        <Bot className="w-4 h-4 text-sky-400" />
                      </div>
                    </div>
                  )}

                  {/* MESSAGE */}

                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-sm ${
                      message.sender === 'user'
                        ? 'bg-sky-600/20 border border-sky-500/30 text-slate-100 rounded-tr-sm'
                        : 'bg-slate-950 border border-slate-800 text-slate-300 rounded-tl-sm'
                    }`}
                  >

                    <div className="flex items-center justify-between gap-4 mb-2">

                      <span
                        className={`text-[11px] font-semibold ${
                          message.sender === 'user'
                            ? 'text-sky-300'
                            : 'text-indigo-300'
                        }`}
                      >
                        {message.sender === 'user'
                          ? 'You'
                          : 'AI Tutor'}
                      </span>

                      <span className="text-[10px] text-slate-500">
                        {message.timestamp}
                      </span>

                    </div>

                    <div className="whitespace-pre-wrap leading-relaxed">
                      {message.text}
                    </div>

                  </div>

                  {/* USER ICON */}

                  {message.sender === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-sky-300" />
                    </div>
                  )}

                </div>

              ))}

              {/* LOADING */}

              {isLoading && (

                <div className="flex items-start gap-2.5">

                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 p-0.5">
                    <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                      <Bot className="w-4 h-4 text-sky-400" />
                    </div>
                  </div>

                  <div className="rounded-2xl rounded-tl-sm bg-slate-950 border border-slate-800 px-4 py-3 flex items-center gap-2 text-xs text-slate-400">

                    <Loader2 className="w-4 h-4 animate-spin text-sky-400" />

                    AI Tutor is thinking...

                  </div>

                </div>

              )}

              <div ref={chatBottomRef} />

            </div>
          )}

        </div>

        {/* ERROR */}

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {errorMessage}
          </div>
        )}

        {/* =================================================
            INPUT
            ================================================= */}

        <form
          onSubmit={handleAskTutor}
          className="space-y-3"
        >

          <textarea
            ref={textareaRef}
            value={inputQuestion}
            onChange={(event) => {
              setInputQuestion(event.target.value);

              if (errorMessage) {
                setErrorMessage(null);
              }
            }}
            onKeyDown={(event) => {
              if (
                event.key === 'Enter' &&
                !event.shiftKey
              ) {
                event.preventDefault();
                handleAskTutor();
              }
            }}
            rows={3}
            placeholder={`Ask something about ${topic.title}...`}
            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 resize-none"
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">

            <p className="text-[11px] text-slate-500">
              Enter to send • Shift + Enter for new line
            </p>

            <button
              type="submit"
              disabled={
                isLoading ||
                !inputQuestion.trim()
              }
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold ${
                isLoading ||
                !inputQuestion.trim()
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 text-white hover:opacity-90'
              }`}
            >

              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Thinking...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Ask Tutor
                </>
              )}

            </button>

          </div>

        </form>

      </section>

      {/* =====================================================
          BOTTOM BACK BUTTON
          ===================================================== */}

      <div className="text-center">

        <button
          type="button"
          onClick={handleBackToRoadmap}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Roadmap
        </button>

      </div>

    </div>
  );
};