// routes/generatedMessages.js
const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

/**
 * Generates 3 AI marketing messages.
 */
async function generateAiMessages(rules, objective) {
  const prompt = `
You're an expert marketing assistant. Based on the objective "${objective}" and the audience defined by the rule "${rules}", generate 3 short, engaging marketing messages for a push/SMS/email campaign.

Each message should:
- Align with the campaign objective
- Be personalized and persuasive
- Avoid numbering or markdown
- Be separated by a newline

Return only the 3 messages.
Don't add any name/product/service, just the messages.
`;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  const response = await result.response;

  const generatedText = response?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!generatedText || typeof generatedText !== 'string') {
    throw new Error('Invalid response from Gemini API');
  }

  const messages = generatedText
    .split('\n')
    .map(msg => msg.trim())
    .filter(msg => msg.length > 0);

  if (messages.length < 3) {
    throw new Error('Generated fewer than 3 messages');
  }

  return messages.slice(0, 3);
}

router.post('/generate-messages', async (req, res) => {
  const { rules, objective } = req.body;
  if (!rules || !objective) {
    return res.status(400).json({ error: 'Missing rules or objective' });
  }

  try {
    const messages = await generateAiMessages(rules, objective);
    res.json({ messages });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate messages' });
  }
});

module.exports = router;
