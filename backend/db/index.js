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

const AccountSchema = new mongoose.Schema({
  // Referencing the user to prevent adding funds to non-existing users
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
});

const User = mongoose.model("User", UserSchema);
const Account = mongoose.model("Account", AccountSchema);

module.exports = {
  User,
  Account,
};
