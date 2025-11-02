import { z } from "zod";

export const Step = z.object({
  tool: z.enum([
    "graph.users.create",
    "graph.groups.addMember",
    "graph.licenses.assign",
    "graph.users.disable",
  ]),
  input: z.record(z.any()),
});

export const PlanSchema = z.object({ 
  steps: z.array(Step).min(1) 
});

export type Plan = z.infer<typeof PlanSchema>;
export type Step = z.infer<typeof Step>;

