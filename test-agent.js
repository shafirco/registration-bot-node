/**
 * Test script for the LangChain Agent
 * Run: node test-agent.js
 */

const testCases = [
  {
    name: "דני לוי",
    phone: "0521234567",
    message: "שלום! אני רוצה לבדוק את סטטוס המשלוח שלי מספר 12345"
  },
  {
    name: "שרה כהן",
    phone: "0501234567",
    message: "מה המחיר למשלוח חבילה לירושלים?"
  },
  {
    name: "יוסי אברהם",
    phone: "0541234567",
    message: "האם אפשר לשלוח חבילה היום?"
  }
];

async function testAgent() {
  const baseUrl = "http://localhost:4000";
  
  console.log("🧪 Testing A.B Deliveries LangChain Agent\n");
  console.log("=" .repeat(60));
  
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`\nTest ${i + 1}: ${testCase.name}`);
    console.log(`Phone: ${testCase.phone}`);
    console.log(`Message: ${testCase.message}`);
    console.log("-".repeat(60));
    
    try {
      const response = await fetch(`${baseUrl}/agent/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(testCase)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Error:", errorData);
        continue;
      }
      
      const data = await response.json();
      console.log("✅ Response:", data.reply);
      console.log("🔧 Tools used:", data.actions.join(", ") || "None");
      console.log("⏰ Timestamp:", data.timestamp);
      
    } catch (error) {
      console.error("❌ Failed to connect:", error.message);
      console.log("\n⚠️  Make sure the server is running:");
      console.log("   cd server-node && npm start");
      break;
    }
  }
  
  console.log("\n" + "=".repeat(60));
  console.log("✨ Tests completed!\n");
}

testAgent();

