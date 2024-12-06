// src/services/codeRunner.ts

export async function runCode(
  code: string,
  testCase: { input: string; expectedOutput: string }
) {
  try {
    // Extract the function name from the user's code
    const functionNameMatch = code.match(/function\s+(\w+)\s*\(/);
    if (!functionNameMatch) {
      throw new Error('Function declaration not found.');
    }
    const functionName = functionNameMatch[1];

    // Prepare the sandboxed environment
    const sandbox: any = { result: null };

    // Build the code to execute
    const wrappedCode = `
      ${code}
      sandbox.result = ${functionName}(${testCase.input});
    `;

    // Execute the code in a new Function
    new Function('sandbox', wrappedCode)(sandbox);

    // Parse expected and actual outputs
    const expected = JSON.parse(testCase.expectedOutput);
    const actual = sandbox.result;

    return {
      passed: JSON.stringify(actual) === JSON.stringify(expected),
      expected: JSON.stringify(expected),
      actual: JSON.stringify(actual),
    };
  } catch (error: any) {
    return {
      passed: false,
      expected: testCase.expectedOutput,
      actual: `Error: ${error.message}`,
    };
  }
}