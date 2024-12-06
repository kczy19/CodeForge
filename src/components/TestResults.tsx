// src/components/TestResults.tsx
import { CheckCircle, XCircle } from 'lucide-react';

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

export default function TestResults({ testCases, isLoading }: Props) {
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

  if (!testCases.length) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <p className="text-gray-600">No test results to display.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4 px-4 pt-4">Test Results</h3>
      <div className="divide-y">
        {testCases.map((testCase, index) => (
          <div
            key={testCase.id}
            className={`p-4 ${
              !testCase.result
                ? 'bg-gray-50'
                : testCase.result.passed
                ? 'bg-green-50'
                : 'bg-red-50'
            }`}
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
                <span className="font-medium">Expected Output:</span>{' '}
                {testCase.expectedOutput}
              </div>
              {testCase.result && !testCase.result.passed && (
                <div>
                  <span className="font-medium text-red-600">Your Output:</span>{' '}
                  {testCase.result.actual}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}