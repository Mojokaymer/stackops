import "dotenv/config";
import { getLokkaClient, listLokkaTools, callLokkaTool } from "./src/clients/lokka.js";

async function testLokka() {
  console.log("🧪 Testing Lokka MCP Integration...\n");

  try {
    // Step 1: Test connection
    console.log("📡 Step 1: Connecting to Lokka MCP server...");
    const client = await getLokkaClient();
    console.log("✅ Connected to Lokka MCP server!\n");

    // Step 2: List available tools
    console.log("📋 Step 2: Listing available Microsoft Graph tools...");
    const tools = await listLokkaTools();
    
    if (tools.length === 0) {
      console.log("❌ No tools found. Lokka MCP server might not be running or authenticated.\n");
      console.log("To start Lokka:");
      console.log("  1. Open Command Palette: Ctrl + Shift + P");
      console.log("  2. Type: MCP: List Servers");
      console.log("  3. Select: Lokka-Microsoft");
      console.log("  4. Click: Start Server");
      console.log("  5. Sign in when browser opens\n");
      process.exit(1);
    }

    console.log(`✅ Found ${tools.length} tools:\n`);
    
    tools.forEach((tool: any) => {
      console.log(`  📌 ${tool.name}`);
      if (tool.description) {
        console.log(`     ${tool.description}`);
      }
    });

    console.log("\n");

    // Step 3: Check for our required tools
    console.log("🔍 Step 3: Verifying required tools...");
    const requiredTools = [
      "msgraph_create_user",
      "msgraph_add_group_member", 
      "msgraph_assign_license",
      "msgraph_disable_user",
    ];

    const toolNames = tools.map((t: any) => t.name);
    const missingTools: string[] = [];

    requiredTools.forEach(toolName => {
      if (toolNames.includes(toolName)) {
        console.log(`  ✅ ${toolName}`);
      } else {
        console.log(`  ⚠️  ${toolName} - NOT FOUND`);
        missingTools.push(toolName);
      }
    });

    if (missingTools.length > 0) {
      console.log("\n⚠️  Some required tools are missing.");
      console.log("The actual tool names might be different. Available tools:");
      console.log(toolNames.join(", "));
    } else {
      console.log("\n✅ All required tools are available!");
    }

    // Step 4: Test a simple read operation (if available)
    console.log("\n🧪 Step 4: Testing a simple read operation...");
    
    // Look for a safe read operation to test
    const readTools = tools.filter((t: any) => 
      t.name.includes("list") || 
      t.name.includes("get") || 
      t.name.includes("read")
    );

    if (readTools.length > 0) {
      console.log(`Found read tool: ${readTools[0].name}`);
      console.log("(Skipping actual call to avoid modifying data)");
    }

    console.log("\n" + "=".repeat(50));
    console.log("🎉 LOKKA MCP INTEGRATION TEST COMPLETE!");
    console.log("=".repeat(50));
    console.log("\n✅ Summary:");
    console.log(`  - Connected to Lokka MCP server: YES`);
    console.log(`  - Tools available: ${tools.length}`);
    console.log(`  - Required tools present: ${requiredTools.length - missingTools.length}/${requiredTools.length}`);
    console.log(`  - Status: ${missingTools.length === 0 ? "✅ READY" : "⚠️  NEEDS ATTENTION"}`);
    
    if (missingTools.length === 0) {
      console.log("\n🚀 Your worker is ready to execute Microsoft Graph operations!");
      console.log("\nNext steps:");
      console.log("  1. Configure Supabase in .env");
      console.log("  2. Start worker: npm run dev");
      console.log("  3. Test via UI: http://localhost:3000/agent");
    }

    console.log("\n");

  } catch (error: any) {
    console.error("\n❌ ERROR:", error.message);
    console.error("\nFull error:", error);
    
    if (error.message?.includes("connect") || error.message?.includes("ECONNREFUSED")) {
      console.error("\n⚠️  Cannot connect to Lokka MCP server.");
      console.error("\nMake sure Lokka is running:");
      console.error("  1. Open Command Palette: Ctrl + Shift + P");
      console.error("  2. Type: MCP: List Servers");
      console.error("  3. Select: Lokka-Microsoft");
      console.error("  4. Check if status is 'Running'");
      console.error("  5. If not, click 'Start Server'");
    }
    
    if (error.message?.includes("authentication") || error.message?.includes("auth")) {
      console.error("\n⚠️  Authentication issue.");
      console.error("\nTry:");
      console.error("  1. Restart Lokka MCP server");
      console.error("  2. Sign in again when browser opens");
      console.error("  3. Ensure you have admin permissions");
    }
    
    process.exit(1);
  }
}

testLokka();

