import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  BrainCircuit,
  Target,
  Zap,
  CheckCircle2,
  Bot,
  Code2
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28 text-center flex flex-col items-center">

        {/* Education Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-300 text-xs sm:text-sm font-medium mb-8 backdrop-blur-sm shadow-sm animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>Next-Generation AI Education</span>
        </div>

        {/* Learnix Brand & Tagline */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-2 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 shadow-lg shadow-sky-500/25">
            <BrainCircuit className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Learnix
          </h1>
        </div>

        {/* Main Tagline */}
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400 max-w-4xl mx-auto leading-tight sm:leading-tight">
          Personalised AI Tutor for Learning AI
        </h2>

        {/* Short Description */}
        <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Master artificial intelligence faster with a smart tutor that analyzes your background, tailors lessons to your learning speed, and guides you through core AI concepts with real-time feedback.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link
            to="/get-started"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 hover:from-sky-400 hover:via-indigo-500 hover:to-purple-500 shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 active:scale-95 transition-all duration-200"
          >
            <Sparkles className="w-5 h-5 text-sky-200" />
            Start Learning
            <ArrowRight className="w-5 h-5" />
          </Link>

          <a
            href="#features"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 transition-all duration-200"
          >
            Explore Curriculum
          </a>
        </div>

        {/* Key Points */}
        <div className="mt-10 pt-6 border-t border-slate-900/80 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-400 max-w-2xl w-full">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Diagnostic Calibration</span>
          </div>

          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-sky-400 flex-shrink-0" />
            <span>Interactive AI Labs</span>
          </div>

          <div className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <span>Dynamic Feedback</span>
          </div>
        </div>

        {/* Interactive Mock Preview */}
        <div className="mt-16 w-full max-w-4xl rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl shadow-2xl p-4 sm:p-6 text-left">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/70 mb-5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />

              <span className="ml-2 text-xs font-mono text-slate-400">
                learnix-session.preview
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-md border border-sky-500/20">
              <Bot className="w-3.5 h-3.5" />
              <span>Interactive Tutor Session</span>
            </div>
          </div>

          <div className="space-y-4 text-sm font-sans">
            {/* User Query Simulation */}
            <div className="flex items-start gap-3 justify-end">
              <div className="bg-sky-600/30 border border-sky-500/30 rounded-2xl rounded-tr-sm px-4 py-2.5 text-slate-200 max-w-md">
                <p className="text-xs text-sky-400 font-semibold mb-1">
                  You
                </p>

                "I know Python basics, but what is Self-Attention in Transformers?"
              </div>
            </div>

            {/* AI Tutor Response Simulation */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 p-0.5 flex-shrink-0 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>

              <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl rounded-tl-sm px-4 py-3 text-slate-200 max-w-xl space-y-2">
                <p className="text-xs text-indigo-400 font-semibold flex items-center gap-1.5">
                  <span>Learnix AI Tutor</span>

                  <span className="text-[10px] px-1.5 py-0.2 bg-indigo-500/20 text-indigo-300 rounded">
                    Adaptive Response
                  </span>
                </p>

                <p className="text-slate-300 text-sm">
                  Think of self-attention as how words in a sentence look at each other to understand context. For example in:
                  <span className="text-sky-300 font-medium italic">
                    {' "The bank of the river overflowed"'}
                  </span>
                  {' vs '}
                  <span className="text-sky-300 font-medium italic">
                    {'"The bank approved the loan"'}
                  </span>.
                </p>

                <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 font-mono text-xs text-emerald-300 flex items-center justify-between">
                  <span>
                    Attention(Q, K, V) = softmax(QKᵀ / √d_k) V
                  </span>

                  <span className="text-slate-500 text-[10px]">
                    Step 1 of 3
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Feature Highlights Section */}
      <section
        id="features"
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-slate-900"
      >
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-sky-400 mb-2">
            Why Learnix?
          </h2>

          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
            Everything you need to master Artificial Intelligence
          </h3>

          <p className="mt-4 text-slate-400 text-sm sm:text-base">
            Traditional AI courses are static and one-size-fits-all. Learnix evolves with your comprehension.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">

          {/* Feature 1 */}
          <div className="group rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 hover:border-sky-500/40 hover:bg-slate-900/60 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6 text-sky-400" />
            </div>

            <h4 className="text-lg font-bold text-white mb-2">
              Adaptive Learning Tracks
            </h4>

            <p className="text-sm text-slate-400 leading-relaxed">
              Diagnostic assessments pinpoint your baseline so you skip what you already know and zoom in on high-yield AI concepts.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 hover:border-indigo-500/40 hover:bg-slate-900/60 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Code2 className="w-6 h-6 text-indigo-400" />
            </div>

            <h4 className="text-lg font-bold text-white mb-2">
              Interactive Hands-On Code
            </h4>

            <p className="text-sm text-slate-400 leading-relaxed">
              Experiment with PyTorch, transformers, embeddings, and prompt engineering with immediate tutor feedback and explanations.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 hover:border-purple-500/40 hover:bg-slate-900/60 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-purple-400" />
            </div>

            <h4 className="text-lg font-bold text-white mb-2">
              Socratic Guidance
            </h4>

            <p className="text-sm text-slate-400 leading-relaxed">
              Instead of simply giving away solutions, your AI tutor prompts you with smart leading questions to build deep intuition.
            </p>
          </div>
        </div>
      </section>

      {/* Curriculum Preview Section */}
      <section
        id="curriculum"
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-900"
      >
        <div className="rounded-3xl border border-slate-800/80 bg-gradient-to-b from-slate-900/50 to-slate-950 p-8 sm:p-12">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Curated AI Learning Modules
            </h3>

            <p className="text-slate-400 text-sm sm:text-base">
              Structured pathways designed to help learners progress from AI foundations to advanced concepts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: 'AI & Math Foundations',
                desc: 'Linear algebra, probability, and gradient descent fundamentals',
                tag: 'Beginner'
              },
              {
                title: 'Neural Networks & PyTorch',
                desc: 'Backprop, CNNs, RNNs, and model training pipelines',
                tag: 'Intermediate'
              },
              {
                title: 'LLMs & Transformers',
                desc: 'Attention mechanism, tokenization, fine-tuning & RAG',
                tag: 'Advanced'
              },
              {
                title: 'AI Agents & Tool Use',
                desc: 'Reasoning loops, MCP protocols, and multi-agent workflows',
                tag: 'Expert'
              },
            ].map((module, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/70 hover:border-slate-700 transition-colors"
              >
                <span className="inline-block text-[11px] font-semibold text-sky-400 px-2 py-0.5 rounded bg-sky-500/10 mb-3">
                  {module.tag}
                </span>

                <h5 className="font-semibold text-white text-base mb-2">
                  {module.title}
                </h5>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {module.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-sky-950/40 via-indigo-950/40 to-purple-950/40 border border-indigo-500/20 backdrop-blur-xl relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Ready to accelerate your AI journey?
            </h3>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
              Get an AI tutor that adapts to how you learn best. Begin your personalized roadmap today.
            </p>

            <div className="pt-4">
              <Link
                to="/get-started"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 shadow-lg shadow-sky-500/25 transition-all duration-200"
              >
                <Sparkles className="w-5 h-5 text-sky-200" />
                Start Learning Now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};