import { useState } from 'react';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import Modal from './ui/Modal';
import { btn, input, label, segment, segmentGroup } from './ui/styles';

const clamp = (n, min, max) => Math.min(max, Math.max(min, Number.isFinite(n) ? n : min));
const ALIGN = { left: ':---', center: ':---:', right: '---:' };

function buildTable(rows, cols, alignment) {
  const header = Array.from({ length: cols }, (_, i) => `Column ${i + 1}`);
  const lines = [
    `| ${header.join(' | ')} |`,
    `| ${Array(cols).fill(ALIGN[alignment]).join(' | ')} |`,
    ...Array.from({ length: rows }, () => `| ${Array(cols).fill('   ').join(' | ')} |`),
  ];
  return lines.join('\n');
}

export default function TableEditorModal({ isOpen, onClose, onInsert }) {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [alignment, setAlignment] = useState('left');
  const [hover, setHover] = useState(null);

  const insert = () => {
    onInsert(`\n${buildTable(rows, cols, alignment)}\n`);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Insert table"
      footer={
        <>
          <button onClick={onClose} className={btn.ghost}>Cancel</button>
          <button onClick={insert} className={btn.primary}>Insert {cols} × {rows} table</button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <span className={label}>Pick a size</span>
          <div
            className="inline-grid gap-1 rounded-md bg-gray-100 dark:bg-dark-900 p-2"
            style={{ gridTemplateColumns: 'repeat(8, 1.25rem)' }}
            onMouseLeave={() => setHover(null)}
          >
            {Array.from({ length: 6 * 8 }).map((_, i) => {
              const r = Math.floor(i / 8) + 1;
              const c = (i % 8) + 1;
              const ref = hover || { r: rows, c: cols };
              const on = r <= ref.r && c <= ref.c;
              return (
                <button
                  key={i}
                  type="button"
                  aria-label={`${c} columns, ${r} rows`}
                  onMouseEnter={() => setHover({ r, c })}
                  onFocus={() => setHover({ r, c })}
                  onClick={() => { setRows(r); setCols(c); }}
                  className={`h-5 w-5 rounded-sm border transition-colors ${on ? 'border-brand-500 bg-brand-100 dark:bg-brand-900/50' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-800'}`}
                />
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="tbl-cols" className={label}>Columns</label>
            <input id="tbl-cols" type="number" min={1} max={20} value={cols} onChange={(e) => setCols(clamp(parseInt(e.target.value, 10), 1, 20))} className={input} />
          </div>
          <div>
            <label htmlFor="tbl-rows" className={label}>Body rows</label>
            <input id="tbl-rows" type="number" min={1} max={50} value={rows} onChange={(e) => setRows(clamp(parseInt(e.target.value, 10), 1, 50))} className={input} />
          </div>
        </div>

        <div>
          <span className={label}>Text alignment</span>
          <div className={segmentGroup} role="radiogroup" aria-label="Alignment">
            {[{ a: 'left', Icon: AlignLeft }, { a: 'center', Icon: AlignCenter }, { a: 'right', Icon: AlignRight }].map((o) => (
              <button key={o.a} role="radio" aria-checked={alignment === o.a} onClick={() => setAlignment(o.a)} className={`${segment(alignment === o.a)} inline-flex items-center justify-center gap-1.5 capitalize`}>
                <o.Icon size={14} /> {o.a}
              </button>
            ))}
          </div>
        </div>

        <pre className="max-h-32 overflow-auto rounded-md bg-gray-50 dark:bg-dark-900 p-3 font-mono text-xs text-gray-600 dark:text-gray-400">{buildTable(Math.min(rows, 4), cols, alignment)}{rows > 4 ? '\n…' : ''}</pre>
      </div>
    </Modal>
  );
}
