import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { fromSSO } from "@aws-sdk/credential-provider-sso";

type LLMOpts = { system: string; user: string };

// Use cross-region inference profile for on-demand access
const bedrockModel = process.env.BEDROCK_MODEL_ID || "us.anthropic.claude-3-5-sonnet-20240620-v1:0";

// Initialize Bedrock client with SSO/IAM credentials
// AWS SDK will automatically use credentials from AWS_PROFILE or default credential chain
const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "us-east-2",
  credentials: process.env.AWS_PROFILE 
    ? fromSSO({ profile: process.env.AWS_PROFILE })
    : undefined // Use default credential chain (will use profile from AWS_PROFILE env or default profile)
});

export async function llmJson({ system, user }: LLMOpts): Promise<string> {
  if (!process.env.AWS_REGION) {
    throw new Error("AWS_REGION is required");
  }

  const body = {
    anthropic_version: "bedrock-2023-05-31",
    messages: [
      { role: "user", content: system + "\n\n" + user }
    ],
    max_tokens: 1500,
    temperature: 0.1
  };

  const resp = await client.send(new InvokeModelCommand({
    modelId: bedrockModel,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify(body),
  }));

  const parsed = JSON.parse(new TextDecoder().decode(resp.body));
  
  // Claude response structure: extract text from content array
  const text = parsed?.content?.[0]?.text ?? JSON.stringify(parsed);
  return text.trim();
}

