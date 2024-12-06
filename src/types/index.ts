// src/types/index.ts
export interface Room {
  id: string;
  participants: Participant[];
  problems: Problem[];
  status: 'waiting' | 'started' | 'finished';
  startTime?: number;
}

export interface Participant {
  id: string;
  name: string;
  isReady: boolean;
  solvedProblems: string[];
  score: number;
}

// src/types/index.ts

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  starterCode: string;
  testCases: {
    public: TestCase[];
    private: TestCase[];
  };
}
export interface TestCase {
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