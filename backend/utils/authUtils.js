const bcrypt = require("bcrypt");
const { saltRounds } = require("../config");

const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

const comparePassword = async (plainPassword, hashedPassword) => {
  try {
    const isValid = await bcrypt.compare(plainPassword, hashedPassword);
    console.log('isValid: ', isValid);
    if (isValid) {
      return true;
    }
    return false;
  } catch (error) {
    console.log('Error while comparing password: ', error);
    return false;
  }
};

module.exports = {
  hashPassword,
  comparePassword,
};
