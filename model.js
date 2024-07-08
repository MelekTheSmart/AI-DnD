const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;
require("dotenv").config();

mongoose.connect(process.env.MONGO_URL);

// This is the Mongoose Schema section

// This is the mongoose model declaration field

//export field
module.exports = {
  User,
  Server,
};
