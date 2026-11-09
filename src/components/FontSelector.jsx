import { ChevronDown } from 'lucide-react';
import { FONTS } from '../data/fonts';

export default function FontSelector({ selectedFont, onSelect }) {
  return (
    <label className="relative flex items-center" title="Preview and PDF font">
      <span className="sr-only">Document font</span>
      <select
        value={selectedFont}
        onChange={(e) => onSelect(e.target.value)}
        className="appearance-none cursor-pointer rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-900 py-1 pl-2.5 pr-7 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
        style={{ fontFamily: selectedFont === 'sans-serif' ? 'inherit' : selectedFont }}
      >
        {FONTS.map((font) => (
          <option key={font.id} value={font.id} style={{ fontFamily: font.id }}>
            {font.label}
          </option>
        ))}
      </select>
      <ChevronDown size={14} className="pointer-events-none absolute right-2 text-gray-500" />
    </label>
  );
}
