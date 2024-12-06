// src/components/CodeEditor.tsx
import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { ResizableBox } from 'react-resizable';
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
  initialTemplate,
  setCode,
  code,
}: Props) {
  const [localCode, setLocalCode] = useState<string>(initialTemplate || '');

  useEffect(() => {
    setLocalCode(initialTemplate || '');
    setCode(initialTemplate || '');
  }, [problemId, initialTemplate, setCode]);

  const handleCodeChange = (value: string | undefined) => {
    const updatedCode = value || '';
    setLocalCode(updatedCode);
    setCode(updatedCode);
  };

  return (
    <ResizableBox
      width={Infinity}
      height={400}
      minConstraints={[Infinity, 200]}
      maxConstraints={[Infinity, 600]}
      resizeHandles={['s']}
      className="resizable-box"
    >
      <div className="h-full flex flex-col bg-gray-900 rounded-lg shadow-lg">
        <div className="flex-1">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={localCode}
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
      </div>
    </ResizableBox>
  );
}