const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';

const buildContext = ({ query, inventorySummary, topProduct, forecast, reorder, expiry }) =>
  `You are VyaparAI assistant for a local business owner.\nUser query: ${query}\nInventory summary: ${JSON.stringify(inventorySummary)}\nTop product: ${JSON.stringify(topProduct)}\nForecast: ${JSON.stringify(forecast)}\nReorder recommendations: ${JSON.stringify(reorder)}\nExpiry alerts: ${JSON.stringify(expiry)}\nReturn concise and actionable answer.`;

const askGPT = async ({ query, context }) => {
  if (!process.env.OPENAI_API_KEY) return null;

  const resp = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      temperature: 0.2,
      messages: [
        { role: 'system', content: 'You are a smart retail copilot for SMEs in India.' },
        { role: 'user', content: buildContext({ query, ...context }) }
      ]
    })
  });

  if (!resp.ok) return null;
  const data = await resp.json();
  return data?.choices?.[0]?.message?.content || null;
};

module.exports = { askGPT };
