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
Your goal is to extract a clean, structured task object with the following fields:

1. **title** – Short, action-oriented summary of the task.
2. **description** – If possible, expand on the title and describe about the title in description. Use the transcript to generate a meaningful description. If no extra details are available, set to null.
3. **dueDate** – Use the date parsing tool to extract a due date in ISO 8601 format. If the tool cannot find a date, infer it from context or set to null.
4. **priority** – Use the priority detection tool. If priority cannot be determined, infer the best guess from the transcript context.
5. **status** – Look for status hints in the transcript (TODO, IN_PROGRESS, DONE). If none are present, default to "TODO".

Rules:
- Always use the tools when available.
- If tools cannot provide a value, make a reasonable guess.
- The description should be informative and can mention title, status, or priority if relevant.
- Do NOT add filler phrases like "create a task" or "remind me to".
- Always return valid JSON only. Do NOT include any text outside the JSON.

Example JSON output format:
{
  "title": "...",
  "description": "...",
  "dueDate": "...",
  "priority": "LOW | MEDIUM | HIGH | CRITICAL",
  "status": "TODO | IN_PROGRESS | DONE"
}

Transcript:
{{transcript}}
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
