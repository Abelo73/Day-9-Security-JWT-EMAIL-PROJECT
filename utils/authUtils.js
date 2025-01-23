const bcrypt = require("bcryptjs");

// hash password
const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    return hashPassword;
  } catch (error) {
    console.log("Error hashing password", error);
  }
};

const comparePassword = async (password, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    console.log("Error while comparing password", error);
  }
};

module.exports = { hashPassword, comparePassword };
