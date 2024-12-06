// src/components/ProblemList.tsx
import { Button } from 'your-button-component'; // Replace with your actual button component
import { Problem } from '../types';

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
              <div className="text-sm text-gray-500">Difficulty: {problem.difficulty}</div>
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