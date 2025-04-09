import { useState } from 'react';
import Editor from '@monaco-editor/react';
import 'react-resizable/css/styles.css';

interface Props {
  problemId: string;
  onRun: (code: string) => void;
  onSubmit: (code: string) => void;
  initialTemplate?: string;
  setCode: (code: string) => void;
  code: string;
}

export default function CodeEditor({
  problemId,
  onRun,
  onSubmit,
  initialTemplate = '',
  setCode,
  code,
}: Props) {
  const [codeMap, setCodeMap] = useState<{ [key: string]: string }>({
    [problemId]: initialTemplate,
  });

  const handleCodeChange = (value: string | undefined) => {
    const updatedCode = value || '';
    setCodeMap((prev) => ({
      ...prev,
      [problemId]: updatedCode,
    }));
    setCode(updatedCode);
  };

  const handleRun = () => {
    const currentCode = codeMap[problemId] || initialTemplate;
    onRun(currentCode); // Ensure the latest code is passed to onRun
  };

  const handleSubmit = () => {
    const currentCode = codeMap[problemId] || initialTemplate;
    onSubmit(currentCode); // Ensure the latest code is passed to onSubmit
  };

  return (
    <div className="relative h-full flex flex-col">
      <Editor
        height="calc(100% - 50px)"
        defaultLanguage="javascript"
        value={code}
        onChange={(value) => {
          setCode(value || '');
        }}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false,
        }}
      />
      <div className="h-[50px] flex items-center justify-end gap-4 px-4 bg-[#1e1e1e] border-t border-gray-700">
        <button
          onClick={() => onRun(code)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Run
        </button>
        <button
          onClick={() => onSubmit(code)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
