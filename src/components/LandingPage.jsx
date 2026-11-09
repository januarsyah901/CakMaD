import { useEffect } from 'react';
import { ArrowRight, Moon, Sun } from 'lucide-react';
import Preview from './Preview';
import { btn } from './ui/styles';
import { templates } from '../data/templates';
import { analytics } from '../utils/analytics';

const SAMPLE = `## Q3 support review

Median first response fell from **4.2 h** to **1.6 h** after the triage rota changed.

| Channel | Tickets | Median reply |
| :--- | ---: | ---: |
| Email | 1,284 | 1.9 h |
| Chat | 2,031 | 0.4 h |

Backlog growth stays below $r = \\frac{\\text{opened}}{\\text{closed}} < 1$.

- [x] Move triage to a rota
- [ ] Publish macros for refunds`;

const FEATURES = [
  ['Tables', 'GitHub-style tables, plus a size picker for new ones.'],
  ['Math', 'LaTeX through KaTeX: inline $…$ or display $$…$$.'],
  ['Diagrams', 'Mermaid flowcharts, sequence diagrams and Gantt charts from code blocks.'],
  ['Code', 'Syntax highlighting in the preview and the PDF.'],
  ['Images', 'Paste or drop an image into the editor; it is embedded in the document.'],
  ['PDF', 'A4, Letter or A3, three margin sizes, optional cover page. Links stay clickable.'],
  ['Files', 'Several documents with tabs. Open and download plain .md files.'],
  ['Styling', 'Six fonts and per-document custom CSS that carries into the PDF.'],
];

export default function LandingPage({ onStartWriting, onViewExample, onStartTemplate, isDark, onToggleDark }) {
  useEffect(() => {
    analytics.track('Landing Page Visited');
  }, []);

  const start = () => {
    analytics.track('Start Writing Clicked', { source: 'landing_hero_primary' });
    onStartWriting();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 text-gray-900 dark:text-gray-100">
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-dark-800">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <img src="/icon.svg" alt="" className="h-7 w-7 rounded-md" />
            <span className="font-semibold tracking-tight">Cak MaD</span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={onToggleDark} className={btn.icon} aria-label={isDark ? 'Use light theme' : 'Use dark theme'}>
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={start} className={btn.ghost}>Open editor</button>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[5fr_7fr] lg:py-20">
          <div>
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
              Paste Markdown.<br />Get a clean PDF.
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-gray-600 dark:text-gray-300">
              A Markdown editor that runs in your browser. Paste output from ChatGPT, Claude or Gemini, tidy it with a live preview, and export it as a PDF.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button onClick={start} className={`${btn.primary} px-5 py-2.5 text-base`}>
                Open the editor <ArrowRight size={18} />
              </button>
              <button
                onClick={() => { analytics.track('View Example Clicked', { source: 'landing_hero_secondary' }); onViewExample(); }}
                className={`${btn.secondary} px-5 py-2.5 text-base`}
              >
                Try a sample report
              </button>
            </div>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Free, no account. Documents are kept in your browser and never uploaded.</p>
          </div>

          {/* The real renderer on a real sample, not a screenshot. */}
          <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-800 shadow-sm" aria-label="Example: Markdown source and the rendered result">
            <div className="flex border-b border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex-1 border-r border-gray-200 dark:border-gray-700 px-4 py-2">report.md</span>
              <span className="flex-1 px-4 py-2">Preview</span>
            </div>
            <div className="grid sm:grid-cols-2">
              <pre className="hidden overflow-hidden border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-900 p-4 font-mono text-[11.5px] leading-5 text-gray-600 dark:text-gray-400 sm:block whitespace-pre-wrap">{SAMPLE}</pre>
              <div className="p-5 [&_.markdown-preview]:text-[13px] [&_.markdown-preview]:leading-6 [&_.markdown-preview_h2]:mt-0 [&_.markdown-preview_h2]:text-lg">
                <Preview content={SAMPLE} selectedFont="sans-serif" />
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-dark-800">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <h2 className="text-2xl font-semibold tracking-tight">What it handles</h2>
            <dl className="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map(([term, desc]) => (
                <div key={term}>
                  <dt className="text-sm font-semibold">{term}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{desc}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight">Start from a template</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Opens in the editor with placeholder text in [brackets].</p>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((t) => (
              <li key={t.id}>
                <button
                  onClick={() => onStartTemplate(t)}
                  className="group flex h-full w-full items-start justify-between gap-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-800 px-4 py-3 text-left transition-colors hover:border-gray-400 dark:hover:border-gray-500"
                >
                  <span>
                    <span className="block text-sm font-medium">{t.label}</span>
                    <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">{t.description}</span>
                  </span>
                  <ArrowRight size={16} className="mt-0.5 shrink-0 text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-gray-700 dark:group-hover:text-gray-200" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-800">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-6 text-sm text-gray-500 dark:text-gray-400 sm:px-6">
          <span>Cak MaD</span>
          <a href="https://saweria.co/januarsyah" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 dark:hover:text-gray-100">
            Support the project on Saweria
          </a>
        </div>
      </footer>
    </div>
  );
}
