const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: false,
        unique: true,
        sparse: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email already taken"]
    },
    password: {
        type: String,
        required: false
    },
    googleId: {
        type: String,
        default: null
    },
    profilePicture: {
        type: String,
        default: null
    },

    // ── Email verification ───────────────────────────────────────
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationOtp: {
        type: String,
        default: null
    },
    verificationOtpExpiry: {
        type: Date,
        default: null
    },

    // ── Password reset ───────────────────────────────────────────
    resetPasswordOtp: {
        type: String,
        default: null
    },
    resetPasswordOtpExpiry: {
        type: Date,
        default: null
    },
}, { timestamps: true })

const userModel = mongoose.model("Users", userSchema)

module.exports = userModel;