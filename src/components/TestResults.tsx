// src/components/TestResults.tsx
import { CheckCircle, XCircle } from 'lucide-react';
import React from 'react';

interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isPublic: boolean;
  result?: {
    passed: boolean;
    expected: string;
    actual: string;
  };
}

interface Props {
  testCases: TestCase[];
  isLoading: boolean;
}

const TestResults: React.FC<Props> = ({ testCases, isLoading }) => {
  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-2">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!testCases || testCases.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        Run your code to see test results
      </div>
    );
  }

  return (
    <div className="p-4">
      {testCases.map((testCase, index) => (
        <div
          key={testCase.id || index}
          className="border rounded-md p-4 mb-4 bg-white shadow"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Test Case {index + 1}</span>
            {testCase.result && (
              testCase.result.passed ? (
                <CheckCircle className="text-green-500" size={20} />
              ) : (
                <XCircle className="text-red-500" size={20} />
              )
            )}
          </div>
          <div className="space-y-1 text-sm">
            <div>
              <span className="font-medium">Input:</span> {testCase.input}
            </div>
            <div>
              <span className="font-medium">Expected Output:</span> {testCase.expectedOutput}
            </div>
            {testCase.result && !testCase.result.passed && (
              <div>
                <span className="font-medium">Actual Output:</span> {testCase.result.actual}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TestResults;