const axios = require("axios");

const HF_CHAT_ENDPOINT = "https://router.huggingface.co/v1/chat/completions";
const DATA_MODEL = "meta-llama/Meta-Llama-3-8B-Instruct";

exports.runDataAgent = async ({ task, description }) => {
  try {
    const response = await axios.post(
      HF_CHAT_ENDPOINT,
      {
        model: DATA_MODEL,
        messages: [
          {
            role: "system",
            content: `
You are a Data Analysis Agent.

Your job:
- Analyze data based on task context
- Extract structured insights
- Do NOT explain steps
- Do NOT include markdown

Return ONLY valid JSON.

JSON FORMAT:
{
  "metrics": {
    "total_sales": "<number or estimate>",
    "average_sales": "<number or estimate>"
  },
  "trends": [
    "trend 1",
    "trend 2"
  ],
  "anomalies": [
    "anomaly 1"
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
        max_tokens: 400
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const raw = response.data?.choices?.[0]?.message?.content;

    if (!raw) throw new Error("Empty DataAgent response");

    return JSON.parse(raw);
    console.log("DataAgent raw output:", raw);

  } catch (error) {
    console.error("DataAgent Error:", error.response?.data || error.message);
    throw error;
  }
};
