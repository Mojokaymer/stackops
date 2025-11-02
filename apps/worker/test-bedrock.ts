import "dotenv/config";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

async function testBedrock() {
  console.log("🧪 Testing AWS Bedrock Connection...\n");
  
  console.log("Configuration:");
  console.log("  AWS_REGION:", process.env.AWS_REGION);
  console.log("  AWS_PROFILE:", process.env.AWS_PROFILE);
  console.log("  BEDROCK_MODEL_ID:", process.env.BEDROCK_MODEL_ID);
  console.log("");

  const client = new BedrockRuntimeClient({
    region: process.env.AWS_REGION || "us-east-2",
  });

  const body = {
    anthropic_version: "bedrock-2023-05-31",
    messages: [
      { role: "user", content: "Say 'Hello from AWS Bedrock!' in French" }
    ],
    max_tokens: 100,
    temperature: 0.1
  };

  try {
    console.log("📤 Sending request to Bedrock...");
    
    const response = await client.send(new InvokeModelCommand({
      modelId: process.env.BEDROCK_MODEL_ID || "anthropic.claude-3-5-sonnet-20240620-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify(body),
    }));

    const parsed = JSON.parse(new TextDecoder().decode(response.body));
    const text = parsed?.content?.[0]?.text;
    
    console.log("✅ SUCCESS! Bedrock is working!\n");
    console.log("Response:", text);
    console.log("\n🎉 AWS Bedrock is configured correctly!");
    
  } catch (error: any) {
    console.error("❌ ERROR:", error.message);
    console.error("\nFull error:", error);
    
    if (error.message?.includes("AccessDeniedException")) {
      console.error("\n⚠️  You need to request model access in AWS Bedrock Console:");
      console.error("   1. Go to https://console.aws.amazon.com/bedrock/");
      console.error("   2. Click 'Model access' in the left sidebar");
      console.error("   3. Click 'Modify model access'");
      console.error("   4. Enable 'Anthropic Claude 3.5 Sonnet'");
      console.error("   5. Wait for approval (usually instant)");
    }
    
    if (error.message?.includes("credentials")) {
      console.error("\n⚠️  Credentials issue:");
      console.error("   - Check that ~/.aws/credentials exists");
      console.error("   - Verify AWS_PROFILE matches profile name in credentials file");
      console.error("   - Try: $env:AWS_PROFILE='035058961043_AdministratorAccess'");
    }
    
    process.exit(1);
  }
}

testBedrock();

