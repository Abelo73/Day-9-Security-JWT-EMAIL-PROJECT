# 🌐 Advanced Secure Authentication API 🚀

Welcome to the **Advanced Secure Authentication API**! This API provides a robust and secure system for managing user authentication and email-based verification. It's built with **Node.js**, **Express.js**, and **MongoDB**, ensuring reliability and scalability.

## 🎯 Key Features

### 🔒 Advanced Security
- **Password Encryption:** User passwords are securely hashed using `bcrypt`.
- **JWT Authentication:** Provides secure access tokens for user sessions.
- **OTP-Based Password Reset:** One-Time Password (OTP) for secure password recovery.
- **Token-Based Email Verification:** Verify user accounts with unique, time-limited tokens.

### 📧 Email-Based Features
- **Email Verification:** Send email verification links upon registration.
- **Password Reset via Email:** Reset passwords with OTPs sent directly to users' inboxes.

### 📂 User Management
- **Registration & Login:** Users can register and log in with email and password.
- **Error Handling:** Comprehensive error responses for better debugging and feedback.

---

## 🛠️ Tech Stack

- **Backend Framework:** [Node.js](https://nodejs.org/) with [Express.js](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/)
- **Authentication:** JSON Web Tokens (JWT) & `bcrypt` for password security
- **Email Service:** [Nodemailer](https://nodemailer.com/) for email functionality
- **Utilities:** `crypto` for secure token generation

---

## 📂 Project Structure

```plaintext
├── models/
│   └── User.js              # Mongoose schema for user authentication
├── routes/
│   └── authRoutes.js        # Main authentication-related API routes
├── utils/
│   ├── authUtils.js         # Password hashing and token generation
│   ├── emailUtils.js        # Functions for sending verification/reset emails
│   ├── otpUtils.js          # OTP generation and verification utilities
├── .env                     # Environment variables configuration
├── app.js                   # Entry point of the application
├── package.json             # Project metadata and dependencies
└── README.md                # You're here!

🚀 API Endpoints
Base URL
bash
Copy
Edit
http://localhost:<PORT>/api/students
1️⃣ Register User
Endpoint: POST /register
Description: Register a new user with email verification.
Request Body:
json
Copy
Edit
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "password123"
}
Response:
json
Copy
Edit
{
  "message": "Registration successful. Please verify your email.",
  "status": true
}
2️⃣ Login
Endpoint: POST /login
Description: Authenticate user and provide a JWT token.
Request Body:
json

{
  "email": "johndoe@example.com",
  "password": "password123"
}
Response:
json

{
  "message": "User logged in successfully",
  "status": true,
  "data": {
    "token": "<JWT_TOKEN>",
    "user": {
      "name": "John Doe",
      "email": "johndoe@example.com"
    }
  }
}
3️⃣ Email Verification
Endpoint: GET /verify-email
Description: Verify user's email via token.
Query Parameters:


?token=<VERIFICATION_TOKEN>
Response:
json

{
  "message": "Email verified successfully",
  "status": true
}
4️⃣ Send Password Reset OTP
Endpoint: POST /reset-password-otp
Description: Sends an OTP to reset the user's password.
Request Body:
json

{
  "email": "johndoe@example.com"
}
Response:
json

{
  "message": "Reset password OTP sent to johndoe@example.com",
  "status": true
}
5️⃣ Verify OTP
Endpoint: POST /verify-otp
Description: Verifies the OTP sent to the user's email.
Request Body:
json

{
  "email": "johndoe@example.com",
  "otp": "123456"
}
Response:
json

{
  "message": "OTP verified successfully",
  "status": true
}
6️⃣ Change Password
Endpoint: POST /change-password
Description: Change the user's password after OTP verification.
Request Body:
json

{
  "email": "johndoe@example.com",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
Response:
json
Copy
Edit
{
  "message": "Password changed successfully",
  "status": true
}

⚙️ Setup & Installation
Clone the repository:

git clone https://github.com/Abelo73/secure-authentication-api.git
Install dependencies:

bash
Copy
Edit
npm install

Create a .env file in the project root and add:

PORT=8080
DB_URI=mongodb://localhost:27017/authdb
JWT_SECRET=your_jwt_secret
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
Run the server:
npm run dev

🧪 Testing the API
Use tools like Postman or cURL to test endpoints.
Ensure the database connection is active before running the server.
🛡️ Best Practices
Environment Variables: Store sensitive data like API keys in .env.
Secure Connections: Always use HTTPS in production.
Strong Secrets: Use strong JWT_SECRET and password policies.
🤝 Contributions
Contributions are welcome! Feel free to fork the repository, create a branch, and submit a pull request. Check the issues page for existing bugs or feature requests.

📄 License
This project is licensed under the MIT License. See the LICENSE file for details.

✉️ Contact
For inquiries or support, reach out to:

Email: abeladisu73@example.com
GitHub: Abelo73
phone: 0934777843
✨ Happy Coding! ✨


### Key Improvements:
1. **Title and Branding**: Updated the title to "Advanced Secure Authentication API" to sound more professional.
2. **Features Section**: Highlighted advanced security and email-based features for better readability.
3. **Project Structure**: Organized project files with a clear description.
4. **Endpoints**: Simplified and structured API endpoints for easy understanding.
5. **Best Practices**: Added a section for security and deployment tips.
6. **Contact Section**: Made it easy for users to reach out or contribute.

