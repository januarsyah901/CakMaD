// Markdown formatting commands for the CodeMirror editor (toolbar + shortcuts).
import { EditorSelection } from '@codemirror/state';

/** Wrap each selection in `before`/`after`; with no selection insert a placeholder and select it. */
function wrap(view, before, after = before, placeholder = '') {
  const { state } = view;
  const tr = state.changeByRange((range) => {
    const text = state.sliceDoc(range.from, range.to);
    // Toggle off when the selection is already wrapped.
    const outerFrom = range.from - before.length;
    if (text && outerFrom >= 0 && state.sliceDoc(outerFrom, range.from) === before && state.sliceDoc(range.to, range.to + after.length) === after) {
      return {
        changes: [{ from: outerFrom, to: range.from }, { from: range.to, to: range.to + after.length }],
        range: EditorSelection.range(outerFrom, range.to - before.length),
      };
    }
    const inner = text || placeholder;
    return {
      changes: { from: range.from, to: range.to, insert: before + inner + after },
      range: EditorSelection.range(range.from + before.length, range.from + before.length + inner.length),
    };
  });
  view.dispatch(state.update(tr, { scrollIntoView: true, userEvent: 'input' }));
  view.focus();
  return true;
}

/** Add `prefix` to every line touched by the selection (or remove it if all lines have it). */
function prefixLines(view, prefix) {
  const { state } = view;
  const lines = [];
  for (const range of state.selection.ranges) {
    for (let pos = range.from; pos <= range.to;) {
      const line = state.doc.lineAt(pos);
      if (!lines.some((l) => l.number === line.number)) lines.push(line);
      pos = line.to + 1;
    }
  }
  const numbered = prefix === '1. ';
  const has = (line) => (numbered ? /^\d+\. /.test(line.text) : line.text.startsWith(prefix));
  const allHave = lines.every(has);
  const changes = lines.map((line, i) => {
    if (allHave) {
      const len = numbered ? line.text.match(/^\d+\. /)[0].length : prefix.length;
      return { from: line.from, to: line.from + len };
    }
    // Headings replace an existing heading marker instead of stacking.
    const existing = prefix.startsWith('#') ? (line.text.match(/^#{1,6} /)?.[0].length || 0) : 0;
    return { from: line.from, to: line.from + existing, insert: numbered ? `${i + 1}. ` : prefix };
  });
  view.dispatch({ changes, scrollIntoView: true, userEvent: 'input' });
  view.focus();
  return true;
}

function insertBlock(view, text, selectFrom = 0, selectTo = selectFrom) {
  const { state } = view;
  const { from, to } = state.selection.main;
  const line = state.doc.lineAt(from);
  // Put blocks on their own line.
  const lead = line.text.slice(0, from - line.from).trim() ? '\n\n' : '';
  const insert = lead + text;
  const base = from + lead.length;
  view.dispatch({
    changes: { from, to, insert },
    selection: { anchor: base + selectFrom, head: base + selectTo },
    scrollIntoView: true,
    userEvent: 'input',
  });
  view.focus();
  return true;
}

export const COMMANDS = {
  bold: (v) => wrap(v, '**', '**', 'bold text'),
  italic: (v) => wrap(v, '*', '*', 'italic text'),
  strike: (v) => wrap(v, '~~', '~~', 'text'),
  code: (v) => wrap(v, '`', '`', 'code'),
  link: (v) => {
    const { from, to } = v.state.selection.main;
    const text = v.state.sliceDoc(from, to) || 'link text';
    v.dispatch({
      changes: { from, to, insert: `[${text}](https://)` },
      selection: { anchor: from + text.length + 3, head: from + text.length + 11 },
      userEvent: 'input',
    });
    v.focus();
    return true;
  },
  h1: (v) => prefixLines(v, '# '),
  h2: (v) => prefixLines(v, '## '),
  h3: (v) => prefixLines(v, '### '),
  bullet: (v) => prefixLines(v, '- '),
  numbered: (v) => prefixLines(v, '1. '),
  task: (v) => prefixLines(v, '- [ ] '),
  quote: (v) => prefixLines(v, '> '),
  codeBlock: (v) => {
    const { from, to } = v.state.selection.main;
    const body = v.state.sliceDoc(from, to);
    return insertBlock(v, '```\n' + body + '\n```\n', 3, 3);
  },
  math: (v) => insertBlock(v, '$$\nE = mc^2\n$$\n', 3, 11),
  mermaid: (v) => insertBlock(v, '```mermaid\ngraph LR\n    A --> B\n```\n', 24, 31),
  divider: (v) => insertBlock(v, '\n---\n\n', 6),
};
