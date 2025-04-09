export const problem1 = {
  id: 1,
  title: "Two Sum",
  description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.`,
  difficulty: "easy",
  starterCode: `function twoSum(nums, target) {
  // Write your code here
}`,
  testCases: {
    public: [
      {
        id: '1',
        input: '[2,7,11,15], 9',
        expectedOutput: '[0,1]',
        isPublic: true
      },
      {
        id: '2',
        input: '[3,2,4], 6',
        expectedOutput: '[1,2]',
        isPublic: true
      }
    ],
    private: [
      {
        id: '3',
        input: '[3,3], 6',
        expectedOutput: '[0,1]',
        isPublic: false
      },
      {
        id: '4',
        input: '[1,2,3,4], 7',
        expectedOutput: '[2,3]',
        isPublic: false
      }
    ]
  }
};