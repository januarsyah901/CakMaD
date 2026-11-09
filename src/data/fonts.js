export const FONTS = [
  { id: 'sans-serif', label: 'System sans' },
  { id: "'Times New Roman', Times, serif", label: 'Times New Roman' },
  { id: "'Lora', serif", label: 'Lora' },
  { id: "'Playfair Display', serif", label: 'Playfair Display' },
  { id: "'Poppins', sans-serif", label: 'Poppins' },
  { id: "'Fira Code', monospace", label: 'Fira Code' },
];

export const fontLabel = (id) => FONTS.find((f) => f.id === id)?.label || 'System sans';
