const axios = require("axios");

const HF_ENDPOINT = "https://router.huggingface.co/v1/chat/completions";
const MODEL = "meta-llama/Meta-Llama-3-8B-Instruct";

exports.runTaskPlanner = async ({ prompt, hasFiles, fileTypes }) => {

  const response = await axios.post(
    HF_ENDPOINT,
    {
      model: MODEL,
      messages: [
        {
          role: "system",
          content: `
You are a task classifier.

Your ONLY job:
- Classify the user request into ONE task_type.

Allowed task types:
email, plan, analysis, code, general

Return ONLY valid JSON.
No explanations.

Format:
{
  "task_type": "email | plan | analysis | code | general",
  "title": "short title"
}
`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0,
      max_tokens: 120
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  const raw = response.data?.choices?.[0]?.message?.content;
  if (!raw) throw new Error("Planner returned empty response");

  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error("Planner returned invalid JSON");
  }

  return JSON.parse(raw.substring(start, end + 1));
};
