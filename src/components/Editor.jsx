import CodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { oneDark } from '@codemirror/theme-one-dark';
import { githubLight } from '@uiw/codemirror-theme-github';

export default function Editor({ value, onChange, isDark }) {
  return (
    <div className="h-full w-full overflow-hidden bg-white dark:bg-[#282c34]">
      <CodeMirror
        value={value}
        height="100%"
        extensions={[
          markdown({ base: markdownLanguage, codeLanguages: languages }),
        ]}
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
}
