import React from 'react';
import { Sparkles, ArrowRight, Eye, BookOpen, FileCode, PenTool, CheckCircle, ShieldCheck } from 'lucide-react';
import { analytics } from '../utils/analytics';

export default function LandingPage({ onStartWriting, onViewExample }) {
  React.useEffect(() => {
    analytics.track('Landing Page Visited');
  }, []);

  const handleStart = () => {
    analytics.track('Start Writing Clicked', { source: 'landing_hero_primary' });
    onStartWriting();
  };

  const handleExample = () => {
    analytics.track('View Example Clicked', { source: 'landing_hero_secondary' });
    onViewExample();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors">
      {/* Top Navigation */}
      <header className="w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-dark-800/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/icon.svg" alt="Cak MaD Logo" className="w-9 h-9 rounded-lg shadow-sm" />
            <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">Cak MaD</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleStart}
              className="px-4 py-2 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-lg shadow-sm transition"
            >
              Start Writing
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800/60 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-6">
            <Sparkles size={14} className="text-brand-500" />
            From Raw AI Prompts to Publication Ready
          </div>

          {/* Hero Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50 leading-[1.15]">
            Edit and export Markdown beautifully
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Turn AI-generated Markdown into clean, professional documents instantly.
          </p>

          {/* CTA Group */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={handleStart}
              className="w-full sm:w-auto px-7 py-3.5 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-semibold rounded-xl shadow-md shadow-brand-500/20 transition flex items-center justify-center gap-2 text-base"
            >
              Start Writing
              <ArrowRight size={18} />
            </button>
            <button
              onClick={handleExample}
              className="w-full sm:w-auto px-6 py-3.5 bg-white dark:bg-dark-800 hover:bg-gray-100 dark:hover:bg-dark-700 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-xl transition flex items-center justify-center gap-2 text-base"
            >
              <Eye size={18} />
              View Example
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle size={15} className="text-brand-500" /> Instant PDF Export
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle size={15} className="text-brand-500" /> Beautiful Typography Presets
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={15} className="text-brand-500" /> 100% Client-Side Privacy
            </span>
          </div>
        </section>

        {/* Workflow Diagram Banner */}
        <section className="py-8 px-4 max-w-4xl mx-auto">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-brand-50/60 via-amber-50/40 to-orange-50/60 dark:from-dark-800 dark:via-dark-800 dark:to-dark-800 border border-brand-200/80 dark:border-gray-700/60">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center items-center">
              <div className="space-y-1">
                <span className="text-xs uppercase font-bold tracking-wider text-brand-600 dark:text-brand-400">Step 1</span>
                <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">AI Output</h4>
                <p className="text-xs text-gray-500">Copy output from ChatGPT, Claude, or Gemini</p>
              </div>

              <div className="space-y-1 md:border-x md:border-gray-200 dark:md:border-gray-700 px-4">
                <span className="text-xs uppercase font-bold tracking-wider text-brand-600 dark:text-brand-400">Step 2</span>
                <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">Cak MaD Polish</h4>
                <p className="text-xs text-gray-500">Edit, structure tables, math equations, and fonts</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs uppercase font-bold tracking-wider text-brand-600 dark:text-brand-400">Step 3</span>
                <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">Beautiful Document</h4>
                <p className="text-xs text-gray-500">Print or export to PDF ready for clients or teams</p>
              </div>
            </div>
          </div>
        </section>

        {/* Use Case Cards Section */}
        <section className="py-16 px-4 sm:px-6 max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
              Designed for your daily publishing workflows
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Solve the gap between raw text output and presentation-ready deliverables.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 1. AI Reports */}
            <div className="p-6 rounded-2xl bg-white dark:bg-dark-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:border-brand-400 dark:hover:border-brand-500 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-4">
                  <Sparkles size={20} />
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">AI Reports</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                  Generate content with AI → polish and export as an executive summary.
                </p>
              </div>
              <span className="mt-4 text-[11px] font-semibold text-brand-600 dark:text-brand-400">Executive Briefs →</span>
            </div>

            {/* 2. Research Documents */}
            <div className="p-6 rounded-2xl bg-white dark:bg-dark-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:border-brand-400 dark:hover:border-brand-500 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                  <BookOpen size={20} />
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">Research Documents</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                  Convert structured Markdown into readable documents with math & tables.
                </p>
              </div>
              <span className="mt-4 text-[11px] font-semibold text-amber-600 dark:text-amber-400">Academic Papers →</span>
            </div>

            {/* 3. Documentation */}
            <div className="p-6 rounded-2xl bg-white dark:bg-dark-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:border-brand-400 dark:hover:border-brand-500 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-4">
                  <FileCode size={20} />
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">Documentation</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                  Create clean technical documentation with diagrams and syntax highlighting.
                </p>
              </div>
              <span className="mt-4 text-[11px] font-semibold text-orange-600 dark:text-orange-400">Technical Specs →</span>
            </div>

            {/* 4. Personal Notes */}
            <div className="p-6 rounded-2xl bg-white dark:bg-dark-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:border-brand-400 dark:hover:border-brand-500 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                  <PenTool size={20} />
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">Personal Notes</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                  Organize meeting notes, daily journals, and articles with better readability.
                </p>
              </div>
              <span className="mt-4 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Daily Notes →</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-gray-200 dark:border-gray-800 text-center text-xs text-gray-500 dark:text-gray-400">
        <p>Cak MaD • Edit and export Markdown beautifully</p>
      </footer>
    </div>
  );
}
