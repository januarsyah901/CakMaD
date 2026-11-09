import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { oneDark } from '@codemirror/theme-one-dark';
import { githubLight } from '@uiw/codemirror-theme-github';
import { EditorView, keymap } from '@codemirror/view';
import { Prec } from '@codemirror/state';
import { COMMANDS } from './editorCommands';

const Editor = forwardRef(({ value, onChange, isDark, lineWrapping }, ref) => {
  const editorRef = useRef(null);

  useImperativeHandle(ref, () => ({
    insertText: (text) => {
      const view = editorRef.current?.view;
      if (!view) return;
      const { from, to } = view.state.selection.main;
      view.dispatch({
        changes: { from, to, insert: text },
        selection: { anchor: from + text.length },
        scrollIntoView: true,
      });
      view.focus();
    },
    run: (name) => {
      const view = editorRef.current?.view;
      if (view && COMMANDS[name]) COMMANDS[name](view);
    },
  }));

  const extensions = useMemo(() => {
    const ext = [
      markdown({ base: markdownLanguage, codeLanguages: languages }),
      Prec.high(keymap.of([
        { key: 'Mod-b', run: COMMANDS.bold },
        { key: 'Mod-i', run: COMMANDS.italic },
        { key: 'Mod-k', run: COMMANDS.link },
        { key: 'Mod-Shift-x', run: COMMANDS.strike },
        { key: 'Mod-`', run: COMMANDS.code },
      ])),
      // Let the app-level drop zone handle files (open .md / insert images)
      // instead of CodeMirror pasting the raw file text at the cursor.
      EditorView.domEventHandlers({
        drop: (e) => e.dataTransfer?.files?.length > 0,
      }),
      EditorView.theme({
        '&': { fontSize: '14px' },
        '.cm-content': { fontFamily: "'Fira Code', ui-monospace, SFMono-Regular, Menlo, monospace", padding: '16px 0', fontVariantLigatures: 'none' },
        '.cm-gutters': { border: 'none' },
        '.cm-line': { padding: '0 16px 0 8px' },
      }),
    ];
    if (lineWrapping) ext.push(EditorView.lineWrapping);
    return ext;
  }, [lineWrapping]);

  return (
    <div className="h-full w-full overflow-hidden bg-white dark:bg-[#282c34]">
      <CodeMirror
        ref={editorRef}
        value={value}
        height="100%"
        extensions={extensions}
        theme={isDark ? oneDark : githubLight}
        onChange={onChange}
        placeholder="Write or paste Markdown here…"
        className="h-full [&>.cm-editor]:h-full [&>.cm-editor]:outline-none"
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          foldGutter: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: false,
          rectangularSelection: true,
          crosshairCursor: true,
          highlightActiveLine: true,
          highlightSelectionMatches: true,
          closeBracketsKeymap: true,
          defaultKeymap: true,
          searchKeymap: true,
          historyKeymap: true,
          foldKeymap: true,
          completionKeymap: false,
          lintKeymap: true,
        }}
      />
    </div>
  );
});

Editor.displayName = 'Editor';

export default Editor;
