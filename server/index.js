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

app.post("/user/users", users.postUser);

app.get("/user/users/:username", users.getUser);

app.get("/user/public/:type", () => {});

app.post("/user/:type/:parentId/:ownerId", users.postObj);

app.put("/user/:type/:id", users.putObj);

app.get("/user/:type/:id", users.putObj);

app.delete("/user/:type/:id", users.delObj);

// image hosting endpoints

// Monster Template creation called with function called by AI
app.post("/ai/templates", () => {});

// AI endpoints
app.post("/ai/chat", express.json(), async (req, res) => {
  if (!req.body) {
    console.log("Invalid input. Message is null.");
    return res.status(400).json({ error: "Invalid input. Message is null." });
  }

  try {
    const { input, history } = req.body;

    // Prepare messages array for mothercaller
    let messages = [
      {
        role: "system",
        content: "You are a helpful assistant that can use various functions.",
      },
      ...history, // Include previous messages
      { role: "user", content: input }, // Add the latest user input
    ];

    const response = await AI.mothercaller(messages);
    res.json({ response });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
});
app.post("/api/statblock", express.json(), async (req, res) => {
  try {
    let message = req.body.input; // Change this line

    if (typeof message !== "string") {
      throw new Error("Input must be a string");
    }

    // Generate AI response
    const response = await AI.createStatBlock(message);
    res.json({ response });
  } catch (error) {
    console.error("Error in AI function call:", error);
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
