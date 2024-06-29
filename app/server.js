const express = require("express");
const bodyParser = require("body-parser");
const openai = require("openai");

const app = express();
app.use(bodyParser.json());

app.post("/api/chat", async (req, res) => {
  const { prompt } = req.body;
  // Call to the AI service
  const response = await openai.Completion.create({
    engine: "text-davinci-003",
    prompt: prompt,
    maxTokens: 150,
  });

  res.json({ reply: response.choices[0].text.trim() });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
