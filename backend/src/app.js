const express = require('express')
const authRouter = require('./routes/auth_route');
const app = express();
const passport = require("./config/passport");

const cors = require('cors');
const cookieParser = require('cookie-parser');

const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
}

app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

app.use("/api/auth", authRouter);

// 404 handler for undefined API routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`
    });
});

module.exports = app;