import "dotenv/config";
import Fastify from "fastify";
import { 
  insertIntent, 
  getIntent, 
  updateIntentStatus, 
  insertApproval, 
  insertAuditLog 
} from "./clients/supabaseMCP.js";
import { planFromText } from "./services/planner.js";
import { checkPlanAllowed } from "./services/guardrails.js";
import { executePlan } from "./services/executor.js";

const app = Fastify({ logger: true });

app.get("/health", async () => {
  return { ok: true };
});

app.post("/agent/chat", async (req, reply) => {
  const { tenantId, text } = (req.body as any) || {};
  
  if (!tenantId || !text) {
    return reply.code(400).send({ error: "tenantId and text required" });
  }
  
  try {
    const result = await planFromText(tenantId, text);
    
    if (result.needsClarification) {
      return reply.send({ 
        status: "clarify", 
        question: result.clarifyingQuestion 
      });
    }
    
    checkPlanAllowed(result.plan!);
    
    // Insert intent via Supabase MCP
    const insertResult = await insertIntent({
      tenant_id: tenantId,
      type: "auto",
      input_json: { text },
      plan_json: result.plan,
      status: "planned",
    });
    
    if (!insertResult.success) {
      return reply.code(500).send({ error: insertResult.error });
    }
    
    // Extract intent ID from result
    const intentData = insertResult.data as any;
    const intentId = intentData[0]?.content?.[0]?.text 
      ? JSON.parse(intentData[0].content[0].text)[0]?.id 
      : null;
    
    if (!intentId) {
      return reply.code(500).send({ error: "Failed to create intent" });
    }
    
    return reply.send({ 
      intentId, 
      status: "planned", 
      plan: result.plan 
    });
  } catch (error: any) {
    app.log.error(error);
    return reply.code(500).send({ error: error.message || "Failed to process chat" });
  }
});

app.post("/agent/approve", async (req, reply) => {
  const { intentId } = (req.body as any) || {};
  
  if (!intentId) {
    return reply.code(400).send({ error: "intentId required" });
  }
  
  try {
    // Get intent via Supabase MCP
    const intentResult = await getIntent(intentId);
    
    if (!intentResult.success) {
      return reply.code(404).send({ error: "Intent not found" });
    }
    
    // Parse intent data
    const intentData = intentResult.data as any;
    const intent = intentData[0]?.content?.[0]?.text 
      ? JSON.parse(intentData[0].content[0].text)[0] 
      : null;
    
    if (!intent) {
      return reply.code(404).send({ error: "Intent not found" });
    }
    
    // Record approval via MCP
    await insertApproval({
      intent_id: intentId,
      approver: "admin",
      status: "approved",
    });
    
    // Update intent status via MCP
    await updateIntentStatus(intentId, "approved");
    
    // Create log writer function using MCP
    const logWrite = async (entry: any) => {
      await insertAuditLog(entry);
    };
    
    try {
      const results = await executePlan(intentId, intent.plan_json, logWrite);
      
      await updateIntentStatus(intentId, "applied");
      
      return reply.send({ 
        intentId, 
        status: "applied", 
        results 
      });
    } catch (execError: any) {
      await updateIntentStatus(intentId, "failed");
      
      return reply.code(500).send({ 
        intentId, 
        status: "failed", 
        error: execError.message || "Execution failed" 
      });
    }
  } catch (error: any) {
    app.log.error(error);
    return reply.code(500).send({ error: error.message || "Failed to approve" });
  }
});

const PORT = Number(process.env.PORT || 3100);
app.listen({ port: PORT, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`Server listening at ${address}`);
});

