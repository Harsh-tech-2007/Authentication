# Advanced Authentication System

A full-stack, production-ready authentication system built with the MERN stack (MongoDB, Express, React, Node.js). It features a modern, clean UI and implements secure authentication practices including JWTs in httpOnly cookies, Google OAuth 2.0, and email-based 6-digit OTP verification.

## 🌟 Features

- **Email & Password Authentication**: Secure registration and login flow.
- **Email Verification**: Sends a 6-digit OTP via email to verify new users before granting access.
- **Password Reset**: Forgot password flow using 6-digit OTP sent to the user's email.
- **Google OAuth 2.0**: Seamless "Continue with Google" integration.
- **JWT Session Management**: Tokens are securely stored in `httpOnly` cookies (protected against XSS attacks).
- **Modern UI**: Clean, responsive, and minimalistic forms built with React and raw CSS.
- **Protected Routes**: Frontend routing safely guards authenticated pages (like the Dashboard).

## 🚀 Tech Stack

**Frontend**
- React (Vite)
- React Router DOM
- Axios (configured with `withCredentials` for cookies)

**Backend**
- Node.js & Express
- MongoDB & Mongoose
- JSON Web Tokens (JWT)
- Passport.js (Google OAuth20)
- Nodemailer (Email delivery)
- bcryptjs (Password hashing)

## 📦 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file inside the `/backend` folder and add the following variables:
   ```env
   MONGO_URI=your_mongodb_connection_string
   PORT=4000
   JWT_SECRET=your_super_secret_jwt_string
   FRONTEND_URL=http://localhost:5173

   # Google OAuth Credentials
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   CALLBACK_URL=http://localhost:4000/api/auth/google/callback

   # Email Configuration (for Nodemailer)
   EMAIL_USER=your_gmail@gmail.com
   EMAIL_APP_PASSWORD=your_16_char_gmail_app_password
   ```
   *(Note: To send emails via Gmail, you must use an **App Password** instead of your regular password. Enable 2-Step Verification on your Google Account, then generate an App Password.)*

4. Start the backend development server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## 💻 Usage

1. Access the frontend application at `http://localhost:5173`.
2. The backend server runs on `http://localhost:4000`.
3. Try registering a new account — you will receive a 6-digit OTP to your email.
4. Try out the Google Sign-in to bypass the OTP flow automatically.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.
