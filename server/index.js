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
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    // Validate input
    if (!Array.isArray(messages) || messages.length === 0) {
      return res
        .status(400)
        .json({ error: "Invalid input. Messages array is required." });
    }

    // Generate AI response
    const aiResponse = await AI.generateResponse(messages);

    // Send the AI response back to the client
    res.json({ response: aiResponse });
  } catch (error) {
    console.error("Error in AI chat:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
});

// This is where the server is listening
app.listen(8080, function () {
  console.log("server is running on http://localhost:8080...");
});

// This is where test code goes
async function test() {}
