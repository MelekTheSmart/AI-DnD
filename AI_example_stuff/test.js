import fetch from "node-fetch";

async function runTest() {
  const testCases = [
    "Say hello to the world",
    "What time is it?",
    "Tell me a joke",
  ];

  for (const testCase of testCases) {
    console.log(`Testing: "${testCase}"`);
    try {
      const response = await fetch("http://localhost:8080/api/function-call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: testCase }),
      });
      const data = await response.json();
      console.log("Response:", data.response);
    } catch (error) {
      console.error("Error:", error);
    }
    console.log("---");
  }
}

runTest();
