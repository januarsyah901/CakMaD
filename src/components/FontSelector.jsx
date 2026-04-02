import React from 'react';
import { Type } from 'lucide-react';

const FONTS = [
  { id: 'sans-serif', label: 'System Default' },
  { id: "'Times New Roman', Times, serif", label: 'Times New Roman' },
  { id: "'Poppins', sans-serif", label: 'Poppins' },
  { id: "'Playfair Display', serif", label: 'Playfair Display' },
  { id: "'Lora', serif", label: 'Lora' },
  { id: "'Fira Code', monospace", label: 'Fira Code' },
];

export default function FontSelector({ selectedFont, onSelect }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-800 transition-colors">
      <Type size={16} className="text-gray-500 dark:text-gray-400" />
      <select
        value={selectedFont}
        onChange={(e) => onSelect(e.target.value)}
        className="appearance-none bg-transparent text-sm font-medium outline-none text-gray-700 dark:text-gray-300 pr-4 cursor-pointer"
        style={{
          fontFamily: selectedFont === 'sans-serif' ? 'inherit' : selectedFont,
        }}
      >
        {FONTS.map((font) => (
          <option 
            key={font.id} 
            value={font.id}
            className="text-gray-900 dark:text-white dark:bg-dark-800"
            style={{ fontFamily: font.id }}
          >
            {font.label}
          </option>
        ))}
      </select>
    </div>
  );
}
