// Shared class strings so every button in the app looks and behaves the same.
const focus = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-dark-800';

export const btn = {
  primary: `inline-flex items-center justify-center gap-2 rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-gray-950 hover:bg-brand-600 active:bg-brand-700 disabled:opacity-50 disabled:pointer-events-none transition-colors ${focus}`,
  secondary: `inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-800 px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-700 disabled:opacity-50 transition-colors ${focus}`,
  ghost: `inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors ${focus}`,
  danger: `inline-flex items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors ${focus}`,
  icon: `inline-flex items-center justify-center rounded-md p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 hover:text-gray-900 dark:hover:text-gray-100 transition-colors ${focus}`,
};

export const input = 'w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent';

export const label = 'block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5';

export const kbd = 'inline-flex items-center rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-dark-700 px-1.5 py-0.5 font-mono text-[11px] text-gray-600 dark:text-gray-300';

/** Segmented control option. */
export const segment = (active) =>
  `flex-1 rounded px-3 py-1.5 text-sm transition-colors ${focus} ${
    active
      ? 'bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100 font-medium shadow-sm'
      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
  }`;

export const segmentGroup = 'flex gap-1 rounded-md bg-gray-100 dark:bg-dark-900 p-1';
