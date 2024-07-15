const fs = require("fs");
const path = require("path");

async function GetToDoList() {
  try {
    const filePath = path.resolve(__dirname, "data", "todolist.json");
    const jsonData = fs.readFileSync(filePath, "utf8");
    return jsonData; // Return the JSON data as a string
  } catch (error) {
    console.error("Error reading the JSON file:", error);
    return "Error reading the to-do list.";
  }
}

GetToDoList()
  .then((todoListString) => {
    console.log(todoListString); // This will be a string representation of the JSON data
  })
  .catch((error) => {
    console.error(error);
  });
