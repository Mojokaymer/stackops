import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "eu-west-3"
});

export async function askBedrock(prompt: string) {
  const command = new InvokeModelCommand({
    modelId: process.env.BEDROCK_MODEL_ID || "anthropic.claude-3-5-sonnet-20240620-v1:0",
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      messages: [
        { role: "user", content: prompt }
      ],
      max_tokens: 1024
    }),
    contentType: "application/json",
    accept: "application/json"
  });
  
  const response = await client.send(command);
  return JSON.parse(Buffer.from(response.body).toString()).content;
}

