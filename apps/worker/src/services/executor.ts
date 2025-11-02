import { Plan, Step } from "../schemas/plan.js";
import { callLokkaTool } from "../clients/lokka.js";

/**
 * Convert plan step to Lokka Microsoft Graph API call
 * Lokka uses a single "Lokka-Microsoft" tool that accepts Graph API parameters
 */
function getLokkaGraphRequest(step: Step): { method: string; path: string; body?: any } {
  const { tool, input } = step;

  if (tool === "graph.users.create") {
    return {
      method: "post",
      path: "/users",
      body: {
        userPrincipalName: input.userPrincipalName,
        displayName: input.displayName,
        mailNickname: input.mailNickname || input.userPrincipalName.split("@")[0],
        accountEnabled: true,
        jobTitle: input.jobTitle || undefined,
        department: input.department || undefined,
        usageLocation: input.usageLocation || "FR",
        passwordProfile: {
          password: input.passwordProfile?.password || "TempPassword123!",
          forceChangePasswordNextSignIn: input.passwordProfile?.forceChangePasswordNextSignIn ?? true,
        },
      },
    };
  }

  if (tool === "graph.groups.addMember") {
    // First need to get user ID from UPN, then add to group
    return {
      method: "post",
      path: `/groups/${input.group}/members/$ref`,
      body: {
        "@odata.id": `https://graph.microsoft.com/v1.0/users/${input.userPrincipalName}`
      },
    };
  }

  if (tool === "graph.licenses.assign") {
    return {
      method: "post",
      path: `/users/${input.userPrincipalName}/assignLicense`,
      body: {
        addLicenses: Array.isArray(input.skus) 
          ? input.skus.map((sku: string) => ({ skuId: sku }))
          : [{ skuId: input.skus }],
        removeLicenses: [],
      },
    };
  }

  if (tool === "graph.users.disable") {
    return {
      method: "patch",
      path: `/users/${input.userPrincipalName}`,
      body: {
        accountEnabled: false,
      },
    };
  }

  throw new Error(`Unknown tool: ${tool}`);
}

export async function executePlan(
  intentId: string,
  plan: Plan,
  log: (entry: any) => Promise<void>
) {
  const results: any[] = [];

  for (let i = 0; i < plan.steps.length; i++) {
    const step = plan.steps[i];

    try {
      // Convert plan step to Graph API request
      const graphRequest = getLokkaGraphRequest(step);

      // Call Lokka-Microsoft tool via MCP
      const response = await callLokkaTool("Lokka-Microsoft", {
        apiType: "graph",
        method: graphRequest.method,
        path: graphRequest.path,
        body: graphRequest.body,
      });

      const status = response.success ? "done" : "error";

      results.push({ tool: step.tool, status });

      await log({
        intent_id: intentId,
        step: String(i + 1),
        tool_name: step.tool,
        input_json: step.input,
        output_json: response.result || { error: response.error },
        status,
      });

      if (!response.success) {
        throw new Error(response.error || "Microsoft Graph API call failed");
      }
    } catch (error: any) {
      // Log the error
      await log({
        intent_id: intentId,
        step: String(i + 1),
        tool_name: step.tool,
        input_json: step.input,
        output_json: { error: error.message },
        status: "error",
      });

      throw error;
    }
  }

  return results;
}

