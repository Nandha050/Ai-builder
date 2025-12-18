const axios = require("axios");
const Subtask = require("../../models/subtask.model");

const HF_ENDPOINT = "https://router.huggingface.co/v1/chat/completions";
const MODEL = "meta-llama/Meta-Llama-3-8B-Instruct";

exports.runContentAgent = async ({ task }) => {
  const data = await Subtask.findOne({
    task_id: task._id,
    agent_type: "data",
    status: "completed"
  });

  const knowledge = await Subtask.findOne({
    task_id: task._id,
    agent_type: "knowledge",
    status: "completed"
  });

  const systemPrompt = `
You are a PROFESSIONAL content generation agent.

Your job is to produce FINAL, USER-READY output.
DO NOT leave sections empty.
DO NOT use placeholders.
DO NOT explain what you are doing.

TASK-TYPE RULES:

1️ analysis
- MUST include:
  - A clear summary paragraph
  - At least 3 concrete insights
  - Actionable recommendations
- If charts are requested:
  - Describe the chart clearly (type, axes, insight)
  - Assume chart rendering happens later

2️ email
- MUST be a complete, ready-to-send email
- Include greeting, body, closing
- No headings, no analysis

3️ plan
- MUST be structured (day-wise or step-wise)
- Clear progression
- No meta commentary

4️ code
- Output ONLY code
- No explanations

5️ general
- Provide a direct, helpful response
- No empty sections

CRITICAL RULE:
If required data exists, USE IT.
If data is missing, infer reasonably.
NEVER return empty sections.
`;

  const userPrompt = `
Task type: ${task.task_type}
User request:
"${task.userPrompt}"

Data output:
${JSON.stringify(data?.output || {}, null, 2)}

Knowledge output:
${JSON.stringify(knowledge?.output || {}, null, 2)}
`;

  const response = await axios.post(
    HF_ENDPOINT,
    {
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 800
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  const output = response.data?.choices?.[0]?.message?.content;
  if (!output) throw new Error("ContentAgent returned empty output");

  return output.trim();
};