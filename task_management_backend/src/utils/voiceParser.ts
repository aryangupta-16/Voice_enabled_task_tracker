import OpenAI from "openai";
import { z } from "zod";
import * as chrono from "chrono-node";
import { createAgent,tool } from "langchain";
import { ChatOpenAI } from "@langchain/openai";

// --------------------------------------------------
// 1️⃣ Structured Output Schema
// --------------------------------------------------
const TaskSchema = z.object({
  title: z.string(),
  description: z.string().nullable(),
  dueDate: z.string().nullable(),
  priority: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]),
  status: z.enum(["TODO", "in_progress", "done"]),
});

// --------------------------------------------------
// 2️⃣ Tools (Date Parsing + Priority Detection)
// --------------------------------------------------

// Natural-language date parsing (using chrono)
const parseDateTool = tool(
  ({ text }) => {
    const d = chrono.parseDate(text);
    return d ? d.toISOString() : null;
  },
  {
    name: "parse_date",
    description: "Parse natural language dates like 'tomorrow', 'next Friday'. Returns ISO string or null.",
    schema: z.object({ text: z.string() }),
  }
);

// Detect priority
const detectPriorityTool = tool(
  ({ text }) => {
    const t = text.toLowerCase();
    if (/(urgent|critical|asap|immediately|emergency)/.test(t)) return "CRITICAL";
    if (/(high priority|important|soon|today|this week)/.test(t)) return "HIGH";
    if (/(medium|normal|standard)/.test(t)) return "MEDIUM";
    if (/(low priority|whenever|later|someday|not urgent)/.test(t)) return "LOW";
    return "MEDIUM";
  },
  {
    name: "detect_priority",
    description: "Detect task priority from text (CRITICAL, HIGH, MEDIUM, LOW).",
    schema: z.object({ text: z.string() }),
  }
);

// --------------------------------------------------
// 3️⃣ LLM Model
// --------------------------------------------------
const llmModel = new ChatOpenAI({
  model: "gpt-4.1",
  temperature: 0.2,
});

// --------------------------------------------------
// 4️⃣ SYSTEM PROMPT
// --------------------------------------------------
const SYSTEM_PROMPT = `
You are a highly accurate task parsing agent.

You receive a natural language voice transcript.
Extract a clean structured task with:

1. title – Short, action oriented.
2. description – Extra info or null.
3. dueDate – Parse natural language using tools, return ISO or null.
4. priority – Use the priority detection tool.
5. status – Always "TODO".

Rules:
- Do NOT add filler phrases.
- Use tools when needed.
- If uncertain, make the best guess.
- Always output valid JSON only.
`;

// --------------------------------------------------
// 5️⃣ Create Agent (LangChain)
// --------------------------------------------------
const agent = createAgent({
  model: llmModel,
  tools: [parseDateTool, detectPriorityTool],
  systemPrompt: SYSTEM_PROMPT,
  responseFormat: TaskSchema,
});

// --------------------------------------------------
// 6️⃣ PUBLIC FUNCTION — SAME NAME AS BEFORE
// --------------------------------------------------
export async function parseVoiceWithLLM(transcript: string) {
  const result = await agent.invoke({
    messages: [{ role: "user", content: transcript }],
  });

  return result.structuredResponse; // Already JSON & validated by Zod
}
