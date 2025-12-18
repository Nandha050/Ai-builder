const axios = require("axios");

const HF_CHAT_ENDPOINT = "https://router.huggingface.co/v1/chat/completions";
const KNOWLEDGE_MODEL = "meta-llama/Meta-Llama-3-8B-Instruct";

exports.runKnowledgeAgent = async ({ task, description }) => {
  try {
    const response = await axios.post(
      HF_CHAT_ENDPOINT,
      {
        model: KNOWLEDGE_MODEL,
        messages: [
          {
            role: "system",
            content: `
You are a Knowledge Agent.

Your job:
- Provide domain knowledge relevant to the task
- Suggest best practices or context
- Do NOT repeat raw data
- Do NOT explain step-by-step
- Be concise and structured

Return ONLY valid JSON.

JSON FORMAT:
{
  "best_practices": [
    "practice 1",
    "practice 2"
  ],
  "business_insights": [
    "insight 1",
    "insight 2"
  ],
  "recommended_focus_areas": [
    "area 1",
    "area 2"
  ]
}
`
          },
          {
            role: "user",
            content: `
Task prompt:
"${task.userPrompt}"

Subtask:
"${description}"
`
          }
        ],
        temperature: 0.3,
        max_tokens: 350
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const raw = response.data?.choices?.[0]?.message?.content;
    if (!raw) throw new Error("Empty KnowledgeAgent response");

    return JSON.parse(raw);
  } catch (error) {
    console.error("KnowledgeAgent Error:", error.response?.data || error.message);
    throw error;
  }
};
