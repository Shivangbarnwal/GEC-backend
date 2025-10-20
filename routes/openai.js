const express = require("express");
const router = express.Router();
const axios = require("axios");

require("dotenv").config();

router.post("/translate", async (req, res) => {
  const { text, targetLanguage } = req.body;

  if (!text || !targetLanguage) {
    return res.status(400).json({ error: "Missing input text or target language" });
  }

  try {
    const prompt = `You are a helpful and friendly AI assistant. The following sentence is in ${targetLanguage}. Understand it and reply in the same language, keeping your response clear, polite, and conversational.
                    Sentence: "${text}"
                    Please respond in ${targetLanguage}, ensuring your tone is friendly and natural.`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "gpt-3.5-turbo", // you can change to gpt-4 or others if available
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000/", // change to your domain when deploying
          "X-Title": "Multilingual Voice Assistant"
        },
      }
    );

    const translatedText = response.data.choices[0].message.content.trim();

    res.json({ translatedText });
  } catch (error) {
    console.error("OpenRouter Translation Error:", error.message);
    res.status(500).json({ error: "Translation failed" });
  }
});

module.exports = router;