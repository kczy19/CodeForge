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
    <div className="h-full flex flex-col bg-gray-900 rounded-lg shadow-lg" style={{ height: '600px' }}>
      <div className="flex-1">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          theme="vs-dark"
          value={codeMap[problemId] || initialTemplate}
          onChange={handleCodeChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            automaticLayout: true,
            scrollBeyondLastLine: false,
            tabSize: 2,
          }}
        />
      </div>
      <div className="flex justify-end p-2 space-x-2">
        <button
          onClick={handleRun}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Run
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
