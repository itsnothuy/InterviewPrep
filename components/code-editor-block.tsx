"use client";

import Editor from "@monaco-editor/react";
import { useRef, useState } from "react";
import LanguageSelector from "./language-selector";
import Output from "./output";
import { CODE_SNIPPETS, Language } from "@/app/code-constants";

const CodeEditorBlock = () => {
  const editorRef = useRef<any>();
  const [value, setValue] = useState<string>("");
  const [language, setLanguage] = useState<[Language, string]>([
    "javascript",
    "18.15.0",
  ]);

  const onMount = (editor: any) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (selectedLanguage: [Language, string]) => {
    setLanguage(selectedLanguage);
    setValue(CODE_SNIPPETS[selectedLanguage[0]]);
  };
  console.log(value);

  return (
    <div className="flex">
      <div className="w-1/2 pr-4">
        <LanguageSelector language={language} onSelect={onSelect} />
        <Editor
          height="75vh"
          theme="vs-dark"
          language={language[0]}
          defaultValue={CODE_SNIPPETS[language[0]]}
          value={value}
          onMount={onMount}
          onChange={(value) => setValue(value || "")}
        />
      </div>
      <div className="w-1/2">
        <Output editorRef={editorRef} language={language} />
      </div>
    </div>
  );
};

export default CodeEditorBlock;
