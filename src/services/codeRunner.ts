// src/services/codeRunner.ts

export async function runCode(
  code: string,
  testCase: { input: string; expectedOutput: string }
) {
  try {
    const functionNameMatch = code.match(/function\s+(\w+)\s*\(/);
    if (!functionNameMatch) throw new Error('Function declaration not found.');
    const functionName = functionNameMatch[1];
    const sandbox: any = { result: null };
    const wrappedCode = `
      ${code}
      sandbox.result = ${functionName}(${testCase.input});
    `;
    new Function('sandbox', wrappedCode)(sandbox);
    const expected = eval(testCase.expectedOutput);
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