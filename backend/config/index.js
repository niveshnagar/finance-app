require("dotenv").config();

const jwtSecret = process.env.JWT_SECRET || "dummySecret";

const dbURL = process.env.DB_URL;

const saltRounds = 12;

module.exports = {
  jwtSecret,
  dbURL,
  saltRounds
};
