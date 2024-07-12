const express = require("express");
const { OpenAI } = require("openai");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.static("public"));

const openai = new OpenAI({
  apiKey: "sk-proj-y2nIbC6zEbNjLLOihKpFT3BlbkFJ9YM40oH3bzHprbyMNbT0",
});

function helloWorld(appendString) {
  let hello = "Hello World! " + appendString;
  console.log(hello);
  return hello;
}

function getTimeOfDay() {
  let date = new Date();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  let timeOfDay = "AM";
  if (hours > 12) {
    hours = hours - 12;
    timeOfDay = "PM";
  }
  return `${hours}:${minutes}:${seconds} ${timeOfDay}`;
}

function GetToDoList() {
  try {
    const filePath = path.resolve(__dirname, "data", "todolist.json");
    const jsonData = fs.readFileSync(filePath, "utf8");
    return jsonData;
  } catch (error) {
    console.error("Error reading the JSON file:", error);
    return "Error reading the to-do list.";
  }
}

function AddToDoList(task) {
  console.log("adding");
  try {
    const filePath = path.resolve(__dirname, "data", "todolist.json");
    const jsonData = fs.readFileSync(filePath, "utf8");
    const todoList = JSON.parse(jsonData);

    const newTask = {
      id: todoList.todoList.length + 1,
      task: task,
      status: "pending",
    };

    todoList.todoList.push(newTask);
    fs.writeFileSync(filePath, JSON.stringify(todoList, null, 2));
    return "Task added successfully.";
  } catch (error) {
    console.error("Error updating the JSON file:", error);
    return "Error adding the task.";
  }
}

function RemoveToDoList(id) {
  try {
    console.log("removing" + id);
    const filePath = path.resolve(__dirname, "data", "todolist.json");
    const jsonData = fs.readFileSync(filePath, "utf8");
    const todoList = JSON.parse(jsonData);
    todoList.todoList = todoList.todoList.filter((task) => task.id !== id);
    todoList.todoList.forEach((task, index) => {
      task.id = index + 1;
    });
    fs.writeFileSync(filePath, JSON.stringify(todoList, null, 2));
    return "Task removed successfully.";
  } catch (error) {
    console.error("Error updating the JSON file:", error);
    return "Error removing the task.";
  }
}

async function callChatGPTWithFunctions(messages) {
  let chat = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
    tools: [
      {
        type: "function",
        function: {
          name: "helloWorld",
          description: "Prints hello world with the string passed to it",
          parameters: {
            type: "object",
            properties: {
              appendString: {
                type: "string",
                description: "The string to append to the hello world message",
              },
            },
            required: ["appendString"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "getTimeOfDay",
          description: "Get the time of day.",
          parameters: {
            type: "object",
            properties: {},
          },
        },
      },
      {
        type: "function",
        function: {
          name: "GetToDoList",
          description: "Get a list of things to do.",
          parameters: {
            type: "object",
            properties: {},
          },
        },
      },
      {
        type: "function",
        function: {
          name: "AddToDoList",
          description: "Add a task to the to-do list.",
          parameters: {
            type: "object",
            properties: {
              task: {
                type: "string",
                description: "The task to add to the to-do list",
              },
            },
            required: ["task"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "RemoveToDoList",
          description: "Remove a task from the to-do list.",
          parameters: {
            type: "object",
            properties: {
              id: {
                type: "integer",
                description: "The ID of the task to remove from the to-do list",
              },
            },
            required: ["id"],
          },
        },
      },
    ],
    tool_choice: "auto",
  });

  messages.push(chat.choices[0].message);

  if (chat.choices[0].message.tool_calls) {
    for (const toolCall of chat.choices[0].message.tool_calls) {
      const functionName = toolCall.function.name;
      const argumentObj = JSON.parse(toolCall.function.arguments);
      let content = "";

      switch (functionName) {
        case "helloWorld":
          content = helloWorld(argumentObj.appendString);
          break;
        case "getTimeOfDay":
          content = getTimeOfDay();
          break;
        case "GetToDoList":
          content = GetToDoList();
          break;
        case "AddToDoList":
          content = AddToDoList(argumentObj.task);
          break;
        case "RemoveToDoList":
          content = RemoveToDoList(argumentObj.id);
          break;
        default:
          console.log("Function not found");
          content = "Function not found";
          break;
      }

      messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        name: functionName,
        content,
      });
    }
  }

  return messages;
}

async function mothercaller(messages) {
  let chat = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
    tools: [
      {
        type: "function",
        function: {
          name: "callChatGPTWithFunctions",
          description: "Sends a prompt to a ChatGPT-3.5 turbo function caller.",
          parameters: {
            type: "object",
            properties: {
              userMessage: {
                type: "string",
                description:
                  "The user's message to be processed by the function caller.",
              },
            },
            required: ["userMessage"],
          },
        },
      },
    ],
    tool_choice: "auto",
  });

  messages.push(chat.choices[0].message);

  if (chat.choices[0].message.tool_calls) {
    for (const toolCall of chat.choices[0].message.tool_calls) {
      if (toolCall.function.name === "callChatGPTWithFunctions") {
        let argumentObj = JSON.parse(toolCall.function.arguments);
        let functionMessages = [
          {
            role: "system",
            content:
              "You are a helpful assistant that can use various functions.",
          },
          { role: "user", content: argumentObj.userMessage },
        ];
        let updatedMessages = await callChatGPTWithFunctions(functionMessages);
        //console.log(updatedMessages);
        // Add the function response
        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          name: toolCall.function.name,
          content: JSON.stringify(updatedMessages.slice(2)), // Convert the messages to a string
        });
      } else {
        console.log("Function not found");
        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          name: toolCall.function.name,
          content: "Function not found",
        });
      }
    }
  }

  let finalResponse = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
  });

  return finalResponse.choices[0].message.content;
}

app.post("/api/function-call", async (req, res) => {
  const { input } = req.body;
  let messages = [
    {
      role: "system",
      content: "You are a helpful assistant that can use various functions.",
    },
    {
      role: "user",
      content: input,
    },
  ];

  try {
    const response = await mothercaller(messages);
    res.json({ response });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
