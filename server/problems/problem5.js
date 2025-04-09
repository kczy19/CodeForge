export const problem5 = {
  id: 5,
  title: "Maximum Subarray",
  description: "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
  difficulty: "medium",
  examples: [
    {
      input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
      output: "6",
      explanation: "The subarray [4,-1,2,1] has the largest sum 6."
    }
  ],
  constraints: ["1 <= nums.length <= 105", "-104 <= nums[i] <= 104"]
};