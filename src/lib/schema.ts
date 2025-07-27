import z from "zod";

export const askAiSchema = z.object({
  chatInput: z.string(),
  sessionId: z.string()
})