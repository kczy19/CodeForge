// server/problems.js
export const problems = [
  {
    id: '1',
    title: 'Two Sum',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.`,
    difficulty: 'easy',
    starterCode: `function twoSum(nums, target) {
  // Write your code here
}`,
    testCases: [
      {
        id: '1',
        input: '[2,7,11,15], 9',
        expectedOutput: '[0,1]',
        isPublic: true,
      },
      {
        id: '2',
        input: '[3,2,4], 6',
        expectedOutput: '[1,2]',
        isPublic: true,
      },
      {
        id: '3',
        input: '[3,3], 6',
        expectedOutput: '[0,1]',
        isPublic: false,
      },
      {
        id: '4',
        input: '[1,2,3,4], 7',
        expectedOutput: '[2,3]',
        isPublic: false,
      },
    ],
  },
  {
    id: '2',
    title: 'Valid Parentheses',
    description: `Given a string \`s\` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    difficulty: 'medium',
    starterCode: `function isValid(s) {
  // Write your code here
}`,
    testCases: [
      { id: '1', input: '"()"', expectedOutput: 'true', isPublic: true },
      { id: '2', input: '"()[]{}"', expectedOutput: 'true', isPublic: true },
      { id: '3', input: '"(]"', expectedOutput: 'false', isPublic: false },
      { id: '4', input: '"{[]}"', expectedOutput: 'true', isPublic: false },
    ],
  },
  // Add more problems as needed
];