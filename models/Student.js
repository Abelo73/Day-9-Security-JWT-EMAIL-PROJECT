const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: [true, "Email already exists, please choose another one"],
    },
    password: {
      type: String,
      required: true,
    },
    otp: {
      type: Number,
    },
    otpExpire: {
      type: Date,
    },
    token: {
      type: String,
    },
    tokenExpire: {
      type: Date,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    verificationTokenExpiry: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
