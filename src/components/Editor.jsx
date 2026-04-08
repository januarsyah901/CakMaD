import { forwardRef, useImperativeHandle, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { oneDark } from '@codemirror/theme-one-dark';
import { githubLight } from '@uiw/codemirror-theme-github';
import { EditorView } from '@codemirror/view';

const Editor = forwardRef(({ value, onChange, isDark, lineWrapping }, ref) => {
  const editorRef = useRef(null);

  useImperativeHandle(ref, () => ({
    insertText: (text) => {
      const view = editorRef.current?.view;
      if (!view) return;
      
      const { state, dispatch } = view;
      const { from, to } = state.selection.main;
      
      dispatch({
        changes: { from, to, insert: text },
        selection: { anchor: from + text.length },
        scrollIntoView: true
      });
    }
  }));

  const extensions = [
    markdown({ base: markdownLanguage, codeLanguages: languages }),
  ];

  if (lineWrapping) {
    extensions.push(EditorView.lineWrapping);
  }

  return (
    <div className="h-full w-full overflow-hidden bg-white dark:bg-[#282c34]">
      <CodeMirror
        ref={editorRef}
        value={value}
        height="100%"
        extensions={extensions}
        theme={isDark ? oneDark : githubLight}
        onChange={onChange}
        className="h-full text-base [&>.cm-editor]:h-full [&>.cm-editor]:outline-none"
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          foldGutter: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          rectangularSelection: true,
          crosshairCursor: true,
          highlightActiveLine: true,
          highlightSelectionMatches: true,
          closeBracketsKeymap: true,
          defaultKeymap: true,
          searchKeymap: true,
          historyKeymap: true,
          foldKeymap: true,
          completionKeymap: true,
          lintKeymap: true,
        }}
      />
    </div>
  );
});

Editor.displayName = 'Editor';

export default Editor;

