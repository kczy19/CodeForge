// src/pages/Room.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { socket } from '../services/socket';
import { useRoomStore } from '../store/roomStore';
import CodeEditor from '../components/CodeEditor';
import Scoreboard from '../components/Scoreboard';
import TestResults from '../components/TestResults';
import ProblemList from '../components/ProblemList';
import {
  Copy,
  Clock,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { runCode } from '../services/codeRunner';

export default function Room() {
  const { roomId } = useParams();
  const { room, currentUser } = useRoomStore();
  const [selectedProblemIndex, setSelectedProblemIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>();
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showTestResults, setShowTestResults] = useState<boolean>(true);
  const [code, setCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedProblem = room?.problems[selectedProblemIndex];

  useEffect(() => {
    if (!room) {
      setIsLoading(true);
      setError(null);
    } else {
      setIsLoading(false);
    }
  }, [room]);

  useEffect(() => {
    if (room?.startTime) {
      const interval = setInterval(() => {
        const elapsed = Date.now() - room.startTime!;
        const remaining = Math.max(0, 30 * 60 - Math.floor(elapsed / 1000));
        setTimeLeft(remaining);
        if (remaining === 0) clearInterval(interval);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [room?.startTime]);

  useEffect(() => {
    if (selectedProblem?.testCases?.public) {
      setTestResults(selectedProblem.testCases.public.map(testCase => ({
        ...testCase,
        id: testCase.id || Math.random().toString(),
        isPublic: true,
        result: undefined
      })));
    }
  }, [selectedProblemIndex, selectedProblem]);

  const copyInviteLink = () => {
    navigator.clipboard.writeText(room?.id || '');
  };

  const handleRunCode = async (currentCode: string) => {
    if (!selectedProblem) return;
    setIsRunning(true);
    setTestResults([]); // Clear previous test results
    if (selectedProblem.testCases.public.length === 0) {
      setTestResults([{ id: 'no-tests', input: '', expectedOutput: '', isPublic: true }]);
      setIsRunning(false);
      return;
    }
    const results = await Promise.all(
      selectedProblem.testCases.public.map(async (testCase) => ({
        ...testCase,
        result: await runCode(currentCode, testCase),
      }))
    );
    setTestResults(results);
    setIsRunning(false);
  };

  const handleSubmitCode = async (currentCode: string) => {
    if (!roomId || !currentUser || !selectedProblem) return;

    const allTestCases = [
      ...selectedProblem.testCases.public,
      ...selectedProblem.testCases.private,
    ];

    setTestResults([]); // Clear previous test results
    const results = await Promise.all(
      allTestCases.map(async (testCase) => ({
        ...testCase,
        result: await runCode(currentCode, testCase),
      }))
    );

    if (results.every((testCase) => testCase.result.passed)) {
      socket.emit('submit-solution', {
        roomId,
        userId: currentUser.id,
        problemId: selectedProblem.id,
        code: currentCode,
      });
      alert('Solution submitted successfully!');
    } else {
      alert('Some test cases failed. Please fix your solution before submitting.');
    }
  };

  const handlePreviousProblem = () => {
    if (selectedProblemIndex > 0) {
      setSelectedProblemIndex(selectedProblemIndex - 1);
    }
  };

  const handleNextProblem = () => {
    if (selectedProblemIndex < (room?.problems.length || 1) - 1) {
      setSelectedProblemIndex(selectedProblemIndex + 1);
    }
  };

  useEffect(() => {
    if (selectedProblem) {
      try {
        setCode(selectedProblem.starterCode || '');
        setTestResults(
          selectedProblem.testCases?.public?.map(testCase => ({
            ...testCase,
            result: undefined
          })) || []
        );
        setShowTestResults(true);
      } catch (err) {
        setError('Error loading problem data');
        console.error('Error:', err);
      }
    }
  }, [selectedProblem]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading room...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!room) return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center text-gray-600">
        <p>Room not found</p>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">Room ID: {roomId}</h1>
          <button
            onClick={copyInviteLink}
            className="flex items-center gap-2 text-blue-600 hover:underline"
          >
            <Copy size={16} />
            Copy Invite Link
          </button>
        </div>
        {room.status === 'started' && (
          <div className="flex items-center gap-2 text-gray-700">
            <Clock size={20} />
            <span className="font-medium">
              Time Left: {Math.floor((timeLeft || 0) / 60)}:
              {String((timeLeft || 0) % 60).padStart(2, '0')}
            </span>
          </div>
        )}
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar with Problem List and Scoreboard */}
        <aside className="w-80 bg-white border-r overflow-y-auto">
          <ProblemList
            problems={room.problems}
            solvedProblems={currentUser?.solvedProblems || []}
            onSelect={(problem, index) => {
              setSelectedProblemIndex(index);
            }}
            selectedProblem={selectedProblem}
          />
          <Scoreboard participants={room.participants} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {selectedProblem ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Problem Details */}
              <div className="p-6 bg-white shadow-md">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">{selectedProblem.title}</h2>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        selectedProblem?.difficulty === 'easy'
                          ? 'bg-green-100 text-green-800'
                          : selectedProblem?.difficulty === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {selectedProblem.difficulty.charAt(0).toUpperCase() +
                        selectedProblem.difficulty.slice(1)}
                    </span>
                    <button
                      onClick={handlePreviousProblem}
                      className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                      disabled={selectedProblemIndex === 0}
                      title="Previous Problem"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={handleNextProblem}
                      className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                      disabled={selectedProblemIndex === (room?.problems.length || 1) - 1}
                      title="Next Problem"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedProblem.description}
                  </p>
                </div>
              </div>

              {/* Code Editor and Action Buttons */}
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 overflow-auto">
                  <CodeEditor
                    problemId={selectedProblem.id}
                    onRun={handleRunCode}
                    onSubmit={handleSubmitCode}
                    initialTemplate={selectedProblem.starterCode}
                    setCode={setCode}
                    code={code}
                  />
                </div>

                {/* Test Results */}
                <div className="bg-gray-100 border-t">
                  <button
                    onClick={() => setShowTestResults(!showTestResults)}
                    className="flex items-center gap-2 p-2 w-full text-sm text-gray-700 focus:outline-none"
                  >
                    {showTestResults ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    <span className="font-medium">
                      {showTestResults ? 'Hide' : 'Show'} Test Results
                    </span>
                  </button>
                  {showTestResults && (
                    <div className="overflow-auto" style={{ maxHeight: '30vh' }}>
                      <TestResults testCases={testResults} isLoading={isRunning} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a problem to start coding
            </div>
          )}
        </main>
      </div>
    </div>
  );
}