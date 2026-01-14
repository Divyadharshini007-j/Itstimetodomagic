import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("AI Study Helper Backend using Cohere Chat is running");
});

// /ask route
app.post("/ask", async (req, res) => {
  const { notes, question } = req.body;

  // Input validation
  if (!notes || !question || notes.trim() === "" || question.trim() === "") {
    return res.status(400).json({
      error: "Both notes and question must be provided and non-empty."
    });
  }

  try {
    // Combine notes + question for the API
    const inputText = `You are a study assistant. Answer the question only using the notes below.\n\nNotes:\n${notes.trim()}\nQuestion:\n${question.trim()}`;

    const response = await axios.post(
      "https://api.cohere.com/v1/chat",
      {
        model: "command",          // Cohere Chat model
        input: inputText,
        max_output_tokens: 150
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const answer = response.data.output_text;
    res.json({ answer });

  } catch (error) {
    console.error("Cohere Chat ERROR:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
