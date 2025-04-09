// src/components/ProblemList.tsx
import { CheckCircle } from 'lucide-react';
import { Problem } from '../types'; // Added missing import

interface Props {
  problems: Problem[];
  solvedProblems: string[];
  onSelect: (problem: Problem, index: number) => void;
  selectedProblem: Problem | undefined;
}

export default function ProblemList({
  problems,
  solvedProblems,
  onSelect,
  selectedProblem,
}: Props) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Problems</h2>
      <div className="space-y-2">
        {problems.map((problem, index) => (
          <button
            key={problem.id}
            onClick={() => onSelect(problem, index)}
            className={`w-full flex items-center justify-between p-3 text-left rounded hover:bg-gray-100 ${
              selectedProblem?.id === problem.id ? 'bg-gray-200' : ''
            }`}
          >
            <div>
              <span className="font-medium">{problem.title}</span>
              <div className="text-sm text-gray-500">
                Difficulty:{' '}
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    problem.difficulty === 'easy'
                      ? 'bg-green-100 text-green-800'
                      : problem.difficulty === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {problem.difficulty}
                </span>
              </div>
            </div>
            {solvedProblems.includes(problem.id) && (
              <CheckCircle className="text-green-500" size={20} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}