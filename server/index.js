const express = require("express");

const cors = require("cors");
const app = express();
const {
  User,
  Campaign,
  Session,
  Statblock,
  Creature,
  Encounter,
  MODELS,
} = require("./resource/model");
const mongoose = require("mongoose");
const validate = require("./utils/validate");
const users = require("./utils/users");
const AI = require("./utils/ai");

// middleware

app.use(function (req, res, next) {
  console.log("request to " + req.url + " with ip " + req.ip);
  next();
});

app.use(cors());

// static hosting

// session handling endpoints

app.post("/sessions", validate.mkSession);

// user handling endpoints

app.post("/users", users.postUser);

app.get("/users/:username", users.getUser);

app.get("/public/:type", () => {});

app.post("/:type/:parentId/:ownerId", users.postObj);

app.put("/:type/:id", users.putObj);

app.get("/:type/:id", users.putObj);

app.delete("/:type/:id", users.delObj);

// image hosting endpoints

// Monster Template creation called with function called by AI
app.post("/templates", () => {});

// AI endpoints
// Modified AI endpoint to save message history
app.post("/api/function-call", async (req, res) => {
  const { input, userId } = req.body;
  console.log("test");
  let messages = [
    {
      role: "system",
      content:
        "You are a helpful assistant that can call a function caller AI model ONLY if user prompts with a command by signaling with a '/' before any potential command.",
    },
    {
      role: "user",
      content: input,
    },
  ];

  try {
    // Save user message
    await Message.create({ userId, content: input, role: "user" });

    const response = await AI.mothercaller(messages);

    // Save AI response
    await Message.create({ userId, content: response, role: "assistant" });

    res.json({ response });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
});

// New endpoint to delete message history
app.delete("/api/message-history/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    await Message.deleteMany({ userId });
    res.json({ message: "Message history deleted successfully" });
  } catch (error) {
    console.error("Error deleting message history:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting message history." });
  }
});
// This is where the server is listening
app.listen(8080, function () {
  console.log("server is running on http://localhost:8080...");
});

// This is where test code goes
async function test() {}
