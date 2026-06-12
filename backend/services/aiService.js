const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

async function generateCampaign(prompt) {
  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `
You are a CRM campaign assistant.

Return ONLY valid JSON.

Example:
{
  "segmentName":"High Value Customers",
  "channel":"WHATSAPP",
  "message":"Hi {{name}}, enjoy 15% off on your next purchase!"
}
`,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
  });

  return JSON.parse(
    completion.choices[0].message.content
  );
}

module.exports = {
  generateCampaign,
};