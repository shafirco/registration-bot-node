const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");
const { handleChat } = require("./dist/agent/index.js");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Route: return random Hebrew message
app.get("/random-message", async (req, res) => {
  try {
    const completion = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: "תן משפט רנדומלי ומעורר השראה בעברית, עד 15 מילים בלבד.",
        },
      ],
    });

    const quote = completion.choices[0].message.content.trim();
    res.json({ quote });
  } catch (error) {
    console.error("Error fetching OpenAI message:", error.message);
    res.status(500).json({ error: "Failed to fetch message" });
  }
});

// Route: LangChain Agent Chat
app.post("/agent/chat", async (req, res) => {
  try {
    const { name, phone, message } = req.body;

    // Validate input
    if (!name || !phone || !message) {
      return res.status(400).json({
        error: "Missing required fields: name, phone, message",
      });
    }

    // Handle the chat with LangChain agent
    const response = await handleChat({ name, phone, message });

    res.json(response);
  } catch (error) {
    console.error("Error in agent chat:", error.message);
    res.status(500).json({
      error: "Failed to process chat",
      details: error.message,
    });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Node server running on port ${PORT}`);
  if (process.env.NODE_ENV === 'production') {
    console.log(`🌐 Production server running`);
  } else {
    console.log(`📱 Mobile access: http://10.0.0.5:${PORT}`);
    console.log(`💻 Local access: http://localhost:${PORT}`);
  }
});
