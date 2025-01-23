const jwt = require("jsonwebtoken");
require("dotenv").config;

const generateToken = (studentId) => {
  try {
    const token = jwt.sign(
      {
        id: studentId,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return token;
  } catch (error) {
    throw new Error("Error generating token");
  }
};

module.exports = { generateToken };
