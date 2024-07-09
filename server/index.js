const express = require("express");
const cors = require("cors");
const {} = require("./model");
const app = express();
app.use(cors());
app.use(express.json());

// This is where the general endpoints are defined

// This is where the server is listening
app.listen(8080, function () {
  console.log("server is running on http://localhost:8080...");
});
