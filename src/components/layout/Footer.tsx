import React from 'react';
import { BrainCircuit, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/60 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 p-0.5 flex items-center justify-center">
                <BrainCircuit className="w-4 h-4 text-white" />
              </div>

              <span className="font-bold text-lg text-white">
                Learnix
              </span>
            </Link>

            <p className="text-sm font-medium text-sky-400">
              Personalised AI Tutor for Learning AI
            </p>

            <p className="text-sm text-slate-400 max-w-sm">
              Learn smarter with a personalised AI tutor that adapts to your
              knowledge, learning pace, and goals.
            </p>
          </div>

          {/* Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Platform
            </h4>

            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link
                  to="/get-started"
                  className="hover:text-sky-400 transition-colors"
                >
                  Diagnostic Assessment
                </Link>
              </li>

              <li>
                <a
                  href="#curriculum"
                  className="hover:text-sky-400 transition-colors"
                >
                  AI Learning Modules
                </a>
              </li>

              <li>
                <a
                  href="#features"
                  className="hover:text-sky-400 transition-colors"
                >
                  Adaptive Learning
                </a>
              </li>

              <li>
                <Link
                  to="/progress"
                  className="hover:text-sky-400 transition-colors"
                >
                  Progress Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Learnix Experience */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Learnix Experience
            </h4>

            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <span className="text-slate-400">
                  Personalised Learning Paths
                </span>
              </li>

              <li>
                <span className="text-slate-400">
                  AI-Powered Guidance
                </span>
              </li>

              <li>
                <span className="text-slate-400">
                  Adaptive Quizzes
                </span>
              </li>

              <li>
                <span className="text-slate-400">
                  Continuous Progress
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-900 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            © {new Date().getFullYear()} Learnix. All rights reserved.
          </p>

          <p className="flex items-center gap-1">
            Learn smarter. Grow faster. Build with AI.
          </p>
        </div>
      </div>
    </footer>
  );
};