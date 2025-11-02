import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

let supabaseClient: Client | null = null;

/**
 * Get or create Supabase MCP client
 */
export async function getSupabaseMCPClient(): Promise<Client> {
  if (supabaseClient) {
    return supabaseClient;
  }

  // Supabase MCP URL from .cursor/mcp.json
  const supabaseUrl = "https://mcp.supabase.com/mcp?project_ref=rwjjpkaoxtikmkqibavb";

  // Create SSE transport for HTTP-based MCP
  const transport = new SSEClientTransport(new URL(supabaseUrl));

  // Create and initialize client
  supabaseClient = new Client(
    {
      name: "stackops-worker",
      version: "1.0.0",
    },
    {
      capabilities: {},
    }
  );

  await supabaseClient.connect(transport);

  return supabaseClient;
}

/**
 * Execute SQL via Supabase MCP
 */
export async function executeSQL(query: string, params?: any[]) {
  try {
    const client = await getSupabaseMCPClient();

    const response = await client.callTool({
      name: "mcp_supabase_execute_sql",
      arguments: {
        query,
      },
    });

    return {
      success: true,
      data: response.content,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "SQL execution failed",
    };
  }
}

/**
 * List tables via Supabase MCP
 */
export async function listTables(schemas: string[] = ["public"]) {
  try {
    const client = await getSupabaseMCPClient();

    const response = await client.callTool({
      name: "mcp_supabase_list_tables",
      arguments: { schemas },
    });

    return {
      success: true,
      data: response.content,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to list tables",
    };
  }
}

/**
 * Insert intent via Supabase MCP
 */
export async function insertIntent(data: {
  tenant_id: string;
  type: string;
  input_json: any;
  plan_json: any;
  status: string;
}) {
  const query = `
    INSERT INTO intents (tenant_id, type, input_json, plan_json, status)
    VALUES ('${data.tenant_id}', '${data.type}', '${JSON.stringify(data.input_json)}'::jsonb, '${JSON.stringify(data.plan_json)}'::jsonb, '${data.status}')
    RETURNING *;
  `;

  return executeSQL(query);
}

/**
 * Insert audit log via Supabase MCP
 */
export async function insertAuditLog(data: {
  intent_id: string;
  step: string;
  tool_name: string;
  input_json: any;
  output_json: any;
  status: string;
}) {
  const query = `
    INSERT INTO audit_logs (intent_id, step, tool_name, input_json, output_json, status)
    VALUES ('${data.intent_id}', '${data.step}', '${data.tool_name}', '${JSON.stringify(data.input_json)}'::jsonb, '${JSON.stringify(data.output_json)}'::jsonb, '${data.status}')
    RETURNING *;
  `;

  return executeSQL(query);
}

/**
 * Get intent by ID via Supabase MCP
 */
export async function getIntent(intentId: string) {
  const query = `
    SELECT * FROM intents WHERE id = '${intentId}';
  `;

  return executeSQL(query);
}

/**
 * Update intent status via Supabase MCP
 */
export async function updateIntentStatus(intentId: string, status: string) {
  const query = `
    UPDATE intents SET status = '${status}' WHERE id = '${intentId}' RETURNING *;
  `;

  return executeSQL(query);
}

/**
 * Insert approval via Supabase MCP
 */
export async function insertApproval(data: {
  intent_id: string;
  approver: string;
  status: string;
}) {
  const query = `
    INSERT INTO approvals (intent_id, approver, status)
    VALUES ('${data.intent_id}', '${data.approver}', '${data.status}')
    RETURNING *;
  `;

  return executeSQL(query);
}

