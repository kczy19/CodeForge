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
    testCases: {
      public: [
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
      ],
      private: [
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
  },
  {
    id: '2',
    title: 'Valid Parentheses',
    description: `Given a string \`s\` containing just the characters \`(\`, \`)\`, \`{\`, \`}\`, \`[\`, and \`]\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets are closed by the same type of brackets.
2. Open brackets are closed in the correct order.`,
    difficulty: 'easy',
    starterCode: `function isValid(s) {
  // Write your code here
}`,
    testCases: {
      public: [
        {
          id: '1',
          input: '"()"',
          expectedOutput: 'true',
          isPublic: true,
        },
        {
          id: '2',
          input: '"([{}])"',
          expectedOutput: 'true',
          isPublic: true,
        },
      ],
      private: [
        {
          id: '3',
          input: '"(]"',
          expectedOutput: 'false',
          isPublic: false,
        },
        {
          id: '4',
          input: '"([)]"',
          expectedOutput: 'false',
          isPublic: false,
        },
      ],
    },
  },
  {
    id: '3',
    title: 'Merge Two Sorted Arrays',
    description: `You are given two integer arrays \`nums1\` and \`nums2\`, sorted in non-decreasing order, and two integers \`m\` and \`n\`, representing the number of elements in \`nums1\` and \`nums2\` respectively.

Merge \`nums2\` into \`nums1\` as one sorted array. Assume \`nums1\` has enough space to hold additional elements from \`nums2\`.`,
    difficulty: 'medium',
    starterCode: `function merge(nums1, m, nums2, n) {
  // Write your code here
}`,
    testCases: {
      public: [
        {
          id: '1',
          input: '[1,2,3,0,0,0], 3, [2,5,6], 3',
          expectedOutput: '[1,2,2,3,5,6]',
          isPublic: true,
        },
        {
          id: '2',
          input: '[1], 1, [], 0',
          expectedOutput: '[1]',
          isPublic: true,
        },
      ],
      private: [
        {
          id: '3',
          input: '[0], 0, [1], 1',
          expectedOutput: '[1]',
          isPublic: false,
        },
        {
          id: '4',
          input: '[4,5,6,0,0,0], 3, [1,2,3], 3',
          expectedOutput: '[1,2,3,4,5,6]',
          isPublic: false,
        },
      ],
    },
  },
];
