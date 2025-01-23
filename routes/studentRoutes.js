const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const Student = require("../models/Student");
const { hashPassword, comparePassword } = require("../utils/authUtils");
const { generateToken } = require("../utils/tokenUtils");
const { sendEmail } = require("../utils/emailSenderUtils");

router.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    if (!students.length === 0) {
      return res
        .status(404)
        .json({ message: "No students found", status: false, data: null });
    }
    res.json({
      message: "Student fetched successfully",
      status: true,
      data: students,
    });
  } catch (error) {
    console.log("Error fetching students, ", error);
  }
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill all fields", status: false, data: null });
    }

    // hash password before storing in to database

    const hashedPassword = await hashPassword(password);

    // Generate verification token and expiry
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // Expires in 24 hours

    const student = new Student({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiry,
    });
    await student.save();

    // Send verification email
    // const verificationLink = `http://localhost:8080/api/students/verify-email?token=${verificationToken}`;
    const verificationLink = `${process.env.BASE_URL}/verify-email?token=${verificationToken}`;
    console.log("Email verification Link :", verificationLink);
    await sendEmail({
      to: student.email,
      subject: "Email verification",
      text: `Hi ${student.name},\n\nPlease verify your email by clicking the link below:\n\n${verificationLink}\n\nThis link will expire in 24 hours.`,
    });

    res.json({
      message: "Registration successful. Please verify your email.",
      status: true,
    });
  } catch (error) {
    console.log("Error creating student, ", error);
    res.status(500).json({
      message: "Error creating student",
      status: false,
      data: null,
    });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "Please fill all fields",
        status: false,
        data: null,
      });
    }

    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({
        message: `Student with email ${email} not found`,
        status: false,
        data: null,
      });
    }

    // Compare password
    const isValidPassword = await comparePassword(password, student.password);
    if (!isValidPassword) {
      return res.status(401).json({
        message: "Invalid password",
        status: false,
        data: null,
      });
    }

    // Generate token
    const token = generateToken(student._id);
    res.json({
      message: "Student logged in successfully",
      status: true,
      data: {
        token,
        student: {
          name: student.name,
          email: student.email,
        },
      },
    });
  } catch (error) {
    console.error("Error logging in student:", error);
    res.status(500).json({
      message: "Error while logging in",
      status: false,
      data: null,
    });
  }
});

// router.get("/:id", async (req, res) => {
//   try {
//     const id = req.params.id;
//     const student = await Student.findById(id);
//     if (!student) {
//       res.status(404).json({
//         message: `Student with id ${id} not found`,
//         status: false,
//         data: null,
//       });
//     }
//     res.json({
//       message: "Student found",
//       status: true,
//       data: student,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error while fetching student by student id:::",
//       status: false,
//       data: null,
//     });
//   }
// });

// Reset-password-otp sending

router.post("/reset-password-otp", async (req, res) => {
  const { email } = req.body;
  try {
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({
        message: `Student with email ${email} not found`,
        status: true,
        data: null,
      });
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiry = new Date(Date.now() + 300000); // 5 minutes

    student.otp = otp;
    student.otpExpire = otpExpiry;
    await student.save();

    // Send Email with OTP

    await sendEmail({
      to: student.email,
      subject: `Reset password OTP`,
      text: `Dear ${student.name}, your reset password OTP is ${otp}. OTP is valid for 5 minutes.`,
    });
    res.status(200).json({
      message: `Reset password OTP is sent to Email :${student.email}`,
      status: true,
      data: null,
    });
  } catch (error) {
    console.error("Error sending otp for password reset:", error);
    res.status(500).json({
      message: error.message,
      status: false,
      data: null,
    });
  }
});

// verify OTP is valid or not before reset password
router.post("/verify-otp", async (req, res) => {
  const { email } = req.body;

  try {
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({
        message: `Student with email ${email} not found`,
        status: false,
        data: null,
      });
    }
    const otp = req.body.otp;
    if (!otp) {
      return res.status(400).json({
        message: "OTP is required",
        status: false,
        data: null,
      });
    }
    const otpExpiry = new Date(student.otpExpire);
    if (otpExpiry < new Date()) {
      return res.status(400).json({
        message: "OTP has expired",
        status: false,
        data: null,
      });
    }

    // OTP valid or not
    if (otp !== student.otp) {
      return res.status(400).json({
        message: "Invalid OTP",
        status: false,
        data: null,
      });
    }

    // Valid OTP then clear otp and expiry
    student.otp = undefined;
    student.otpExpire = undefined;
    await student.save();
    return res.status(200).json({
      message: "OTP verified successfully",
      status: true,
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error while verifying-otp request",
      status: false,
      data: null,
    });
  }
});

router.post("/change-password", async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;
  try {
    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "Email, newPassword and confirm password are required",
        status: false,
        data: null,
      });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords does not match.",
        status: false,
        data: null,
      });
    }
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({
        message: "Student not found",
        status: false,
        data: null,
      });
    }
    // Hash the new password before saving to database
    student.password = await hashPassword(newPassword);
    await student.save();
    // Send password change to the email
    await sendEmail({
      to: student.email,
      subject: `Password change confirmation`,
      text: `Dear ${student.name}, you have successfully changed your password.`,
    });
    return res.status(200).json({
      message: "Password changed successfully",
      status: true,
      data: null,
    });
  } catch (error) {
    console.log("Error while changing password", error);
  }
});

// verify email endpoint

// router.get("/verify-email", async (req, res) => {
//   try {
//     const { verificationToken } = req.query; // Extract the token from the query params
//     console.log("Verification token, ", verificationToken);

//     // Check if the token is provided
//     if (!verificationToken) {
//       return res.status(400).json({
//         message: "Verification token is required",
//         status: false,
//         data: null,
//       });
//     }

//     // Find the student using the verificationToken
//     const student = await Student.findOne({ verificationToken });
//     console.log("Student fetched by verification token, ", student);

//     if (!student) {
//       return res.status(404).json({
//         message: "Student not found or invalid token",
//         status: false,
//         data: null,
//       });
//     }

//     // Return the student data
//     res.status(200).json({
//       message: "Student fetched successfully",
//       status: true,
//       data: student,
//     });
//   } catch (error) {
//     console.error("Error while fetching student by token: ", error);
//     res.status(500).json({
//       message: "Error while fetching student by token",
//       status: false,
//       data: null,
//     });
//   }
// });

// Email verification route
router.get("/verify-email", async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({
        message: "Token is required",
        status: false,
      });
    }

    const student = await Student.findOne({ verificationToken: token });

    if (!student) {
      return res.status(404).json({
        message: "Invalid or expired token",
        status: false,
      });
    }

    if (new Date(student.verificationTokenExpiry) < new Date()) {
      return res.status(400).json({
        message: "Token has expired",
        status: false,
      });
    }
    // checking email is verified or not

    if (student.verified) {
      return res.status(400).json({
        message: "Email is already verified",
        status: true,
      });
    }

    // Verify student email
    student.verified = true;
    // student.verificationToken = undefined;
    student.verificationTokenExpiry = undefined;

    await student.save();

    res.status(200).json({
      message: "Email verified successfully",
      status: true,
    });
  } catch (error) {
    console.error("Error while verifying email: ", error);
    res.status(500).json({
      message: "Error while verifying email",
      status: false,
    });
  }
});

// router.get("/verify-email", async (req, res) => {
//   try {
//     const { token } = req.query;
//     if (!token) {
//       return res.status(400).json({
//         message: "Token is required",
//         status: false,
//       });
//     }
//     const student = await Student.findOne({
//       verificationToken: token, // check if token exists in database
//     });

//     if (!student) {
//       return res.status(404).json({
//         message: "Invalid or expired token",
//         status: false,
//       });
//     }

//     // if (student.verificationTokenExpiry < Date.now()) {
//     //   return res.status(400).json({
//     //     message: "Token has expired",
//     //     status: false,
//     //   });
//     // }

//     if (new Date(student.verificationTokenExpiry) < new Date()) {
//       return res.status(400).json({
//         message: "Token has expired",
//         status: false,
//       });
//     }

//     // verify student email
//     student.verified = true;
//     student.verificationToken = undefined;
//     student.verificationTokenExpiry = undefined;

//     await student.save();

//     res.status(200).json({
//       message: "Email verified successfully",
//       status: true,
//     });
//   } catch (error) {
//     console.log("Error while verifying email: ", error);
//     res.status(500).json({
//       message: "Error while verifying email",
//       status: false,
//     });
//   }
// });

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const student = await Student.findByIdAndDelete(id);
    if (!student) {
      return res.status(404).json({
        message: `Student with id ${id} Not found to delete`,
        status: false,
        data: null,
      });
    }

    res.status(200).json({
      message: `Student with id ${id} deleted successfully`,
      status: true,
      data: student,
    });
  } catch (error) {
    console.log("Error deleting student, ", error);
    res.status(500).json({
      message: `Error while deleting with id ${req.params.id}`,
      status: false,
      data: null,
    });
  }
});
module.exports = router;
