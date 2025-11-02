import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { spawn } from "node:child_process";

let lokkaClient: Client | null = null;

/**
 * Get or create Lokka MCP client
 */
export async function getLokkaClient(): Promise<Client> {
  if (lokkaClient) {
    return lokkaClient;
  }

  // Spawn Lokka MCP server
  const serverProcess = spawn("cmd", ["/c", "npx", "-y", "@merill/lokka"], {
    stdio: ["pipe", "pipe", "pipe"],
  });

  // Create MCP transport
  const transport = new StdioClientTransport({
    command: "cmd",
    args: ["/c", "npx", "-y", "@merill/lokka"],
  });

  // Create and initialize client
  lokkaClient = new Client(
    {
      name: "stackops-worker",
      version: "1.0.0",
    },
    {
      capabilities: {},
    }
  );

  await lokkaClient.connect(transport);

  return lokkaClient;
}

/**
 * Call a Lokka tool via MCP
 */
export async function callLokkaTool(
  toolName: string,
  parameters: Record<string, any>
): Promise<{ success: boolean; result?: any; error?: string }> {
  try {
    const client = await getLokkaClient();

    const response = await client.callTool({
      name: toolName,
      arguments: parameters,
    });

    return {
      success: true,
      result: response.content,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Unknown error calling Lokka tool",
    };
  }
}

/**
 * List available Lokka tools
 */
export async function listLokkaTools() {
  try {
    const client = await getLokkaClient();
    const tools = await client.listTools();
    return tools.tools;
  } catch (error: any) {
    console.error("Failed to list Lokka tools:", error);
    return [];
  }
}

