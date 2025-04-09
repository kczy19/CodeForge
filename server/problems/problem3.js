export const problem3 = {
  id: 3,
  title: "FizzBuzz",
  description: `Given an integer n, return an array answer where:
  - answer[i] == "FizzBuzz" if i is divisible by 3 and 5.
  - answer[i] == "Fizz" if i is divisible by 3.
  - answer[i] == "Buzz" if i is divisible by 5.
  - answer[i] == i (as a string) if none of the above conditions are true.`,
  difficulty: "medium",
  starterCode: `function fizzBuzz(n) {
  // Write your code here
}`,
  testCases: {
    public: [
      {
        id: '1',
        input: '3',
        expectedOutput: '["1","2","Fizz"]',
        isPublic: true
      },
      {
        id: '2',
        input: '5',
        expectedOutput: '["1","2","Fizz","4","Buzz"]',
        isPublic: true
      }
    ],
    private: [
      {
        id: '3',
        input: '15',
        expectedOutput: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]',
        isPublic: false
      },
      {
        id: '4',
        input: '1',
        expectedOutput: '["1"]',
        isPublic: false
      }
    ]
  }
};