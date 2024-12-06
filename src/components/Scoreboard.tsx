// src/components/Scoreboard.tsx
import { Participant } from '../types';
import { Trophy } from 'lucide-react';

interface Props {
  participants: Participant[];
}

export default function Scoreboard({ participants }: Props) {
  const sortedParticipants = [...participants].sort((a, b) => b.score - a.score);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Trophy className="text-yellow-500" />
        Scoreboard
      </h2>
      <div className="space-y-2">
        {sortedParticipants.map((participant, index) => (
          <div
            key={participant.id}
            className="flex items-center justify-between p-2 bg-gray-50 rounded"
          >
            <div className="flex items-center gap-2">
              <span className="font-medium">{index + 1}.</span>
              <span>{participant.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">
                Solved: {participant.solvedProblems.length}
              </span>
              <span className="font-semibold">{participant.score} pts</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}