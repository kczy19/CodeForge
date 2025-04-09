export const problem2 = {
  id: 2,
  title: "Valid Palindrome",
  description: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.

Alphanumeric characters include letters and numbers.

Given a string s, return true if it is a palindrome, or false otherwise.`,
  difficulty: "hard",
  starterCode: `function isPalindrome(s) {
  // Write your code here
}`,
  testCases: {
    public: [
      {
        id: '1',
        input: '"A man, a plan, a canal: Panama"',
        expectedOutput: 'true',
        isPublic: true
      },
      {
        id: '2',
        input: '"race a car"',
        expectedOutput: 'false',
        isPublic: true
      }
    ],
    private: [
      {
        id: '3',
        input: '" "',
        expectedOutput: 'true',
        isPublic: false
      },
      {
        id: '4',
        input: '"12321"',
        expectedOutput: 'true',
        isPublic: false
      }
    ]
  }
};