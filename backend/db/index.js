const mongoose = require("mongoose");
const { dbURL } = require("../config");

// Connect to database
try {
  mongoose.connect(dbURL);
} catch (error) {
  console.log("Failed to connect to the database");
}

// Schema definitions
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 1,
    maxLength: 50,
  },
  password: {
    type: String,
    required: true,
    maxLength: 100,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = {
  User,
};
