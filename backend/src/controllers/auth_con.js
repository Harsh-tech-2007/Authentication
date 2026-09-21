const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const userModel = require('../models/user');
const tokenBlacklistModel = require('../models/blacklist');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/mailer');

// ── Helper: generate a 6-digit numeric OTP ───────────────────────────────────
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

// ── Helper: issue JWT and set httpOnly cookie ────────────────────────────────
function issueJWT(res, user, sameSite = "strict") {
    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    res.cookie("token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "production",
        sameSite,
    })

    return token
}

//-------------------------------------------------

/**
 * @route POST /api/auth/register
 * @description Register new user, send verification OTP
 * @access Public
 */
async function registerUserController(req, res) {
    try {
        const { username, email, password } = req.body

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Please provide username, email and password" })
        }

        const isUserAlreadyExists = await userModel.findOne({
            $or: [{ username }, { email }]
        })

        if (isUserAlreadyExists) {
            return res.status(400).json({ message: "Account already exists with this email address or username" })
        }

        const hash = await bcrypt.hash(password, 10)

        // Generate email verification OTP (expires 15m)
        const verificationOtp = generateOTP()
        const verificationOtpExpiry = new Date(Date.now() + 15 * 60 * 1000)

        await userModel.create({
            username,
            email,
            password: hash,
            isVerified: false,
            verificationOtp,
            verificationOtpExpiry,
        })

        // Send verification email
        try {
            await sendVerificationEmail(email, verificationOtp)
        } catch (mailErr) {
            console.error("Verification email send failed:", mailErr.message)
        }

        res.status(201).json({
            message: "Account created! Please check your email for the OTP.",
        })
    } catch (err) {
        console.error("Register error:", err)
        res.status(500).json({ message: "Internal server error" })
    }
}

//-------------------------------------------------

/**
 * @route POST /api/auth/verify-email
 * @description Verify user's email using OTP
 * @access Public
 */
async function verifyEmailController(req, res) {
    try {
        const { email, otp } = req.body

        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" })
        }

        const user = await userModel.findOne({
            email,
            verificationOtp: otp,
            verificationOtpExpiry: { $gt: new Date() }, // not expired
        })

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired OTP." })
        }

        // Mark as verified, clear OTP fields
        user.isVerified = true
        user.verificationOtp = null
        user.verificationOtpExpiry = null
        await user.save()

        // Issue JWT so user is logged in right after verifying
        issueJWT(res, user)

        res.status(200).json({
            message: "Email verified successfully!",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        })
    } catch (err) {
        console.error("Verify email error:", err)
        res.status(500).json({ message: "Internal server error" })
    }
}

//-------------------------------------------------

/**
 * @route POST /api/auth/resend-verification
 * @description Resend the verification OTP
 * @access Public
 */
async function resendVerificationController(req, res) {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({ message: "Please provide your email" })
        }

        const user = await userModel.findOne({ email })

        if (!user) {
            // Don't reveal whether the email exists
            return res.status(200).json({ message: "If that email exists, a new OTP has been sent." })
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "This account is already verified." })
        }

        // Refresh the OTP and expiry (15m)
        user.verificationOtp = generateOTP()
        user.verificationOtpExpiry = new Date(Date.now() + 15 * 60 * 1000)
        await user.save()

        try {
            await sendVerificationEmail(email, user.verificationOtp)
        } catch (mailErr) {
            console.error("Resend verification email failed:", mailErr.message)
        }

        res.status(200).json({ message: "Verification OTP resent. Please check your inbox." })
    } catch (err) {
        console.error("Resend verification error:", err)
        res.status(500).json({ message: "Internal server error" })
    }
}

//-------------------------------------------------

/**
 * @route POST /api/auth/login
 * @description Login — requires email verified
 * @access Public
 */
async function loginUserController(req, res) {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" })
        }

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" })
        }

        if (!user.password) {
            return res.status(400).json({ message: "This account uses Google Sign-In. Please log in with Google." })
        }

        // Block login until email is verified
        if (!user.isVerified) {
            return res.status(403).json({
                message: "Please verify your email before logging in.",
                needsVerification: true,
                email: user.email,
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" })
        }

        issueJWT(res, user)

        res.status(200).json({
            message: "Logged in successfully.",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        })
    } catch (err) {
        console.error("Login error:", err)
        res.status(500).json({ message: "Internal server error" })
    }
}

//-------------------------------------------------

/**
 * @route POST /api/auth/logout
 * @description Clear token and blacklist it
 * @access Public
 */
async function logoutUserController(req, res) {
    try {
        const token = req.cookies.token

        if (token) {
            await tokenBlacklistModel.create({ token })
        }

        res.clearCookie("token")

        res.status(200).json({ message: "Logged out successfully" })
    } catch (err) {
        console.error("Logout error:", err)
        res.status(500).json({ message: "Internal server error" })
    }
}

//-------------------------------------------------

/**
 * @route GET /api/auth/get-me
 * @description Get current logged-in user
 * @access Private
 */
async function getMeController(req, res) {
    try {
        const user = await userModel.findById(req.user.id)

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        res.status(200).json({
            message: "User details fetched successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
                isVerified: user.isVerified,
            },
        })
    } catch (err) {
        console.error("GetMe error:", err)
        res.status(500).json({ message: "Internal server error" })
    }
}

//-------------------------------------------------

/**
 * @route POST /api/auth/forgot-password
 * @description Send a password reset OTP
 * @access Public
 */
async function forgotPasswordController(req, res) {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({ message: "Please provide your email address" })
        }

        const user = await userModel.findOne({ email })

        // Always return success to not reveal whether email exists
        if (!user || !user.password) {
            return res.status(200).json({ message: "If that email is registered, an OTP has been sent." })
        }

        // Generate reset OTP (expires 15m)
        const resetOtp = generateOTP()
        user.resetPasswordOtp = resetOtp
        user.resetPasswordOtpExpiry = new Date(Date.now() + 15 * 60 * 1000)
        await user.save()

        try {
            await sendPasswordResetEmail(email, resetOtp)
        } catch (mailErr) {
            console.error("Reset email send failed:", mailErr.message)
        }

        res.status(200).json({ message: "If that email is registered, an OTP has been sent." })
    } catch (err) {
        console.error("Forgot password error:", err)
        res.status(500).json({ message: "Internal server error" })
    }
}

//-------------------------------------------------

/**
 * @route POST /api/auth/reset-password
 * @description Reset password using OTP
 * @access Public
 */
async function resetPasswordController(req, res) {
    try {
        const { email, otp, password } = req.body

        if (!email || !otp || !password) {
            return res.status(400).json({ message: "Email, OTP and new password are required" })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" })
        }

        const user = await userModel.findOne({
            email,
            resetPasswordOtp: otp,
            resetPasswordOtpExpiry: { $gt: new Date() }, // not expired
        })

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired OTP." })
        }

        // Update password, clear reset OTP fields
        user.password = await bcrypt.hash(password, 10)
        user.resetPasswordOtp = null
        user.resetPasswordOtpExpiry = null
        await user.save()

        res.status(200).json({ message: "Password reset successfully. You can now log in." })
    } catch (err) {
        console.error("Reset password error:", err)
        res.status(500).json({ message: "Internal server error" })
    }
}

//-------------------------------------------------

/**
 * @route GET /api/auth/google/callback
 * @description Google OAuth callback — issue JWT, redirect to frontend
 * @access Public
 */
async function googleAuthCallbackController(req, res) {
    try {
        const user = req.user

        // Google users are auto-verified
        if (!user.isVerified) {
            user.isVerified = true
            await user.save()
        }

        issueJWT(res, user, "lax")

        res.redirect(`${process.env.FRONTEND_URL}/dashboard`)
    } catch (err) {
        console.error("Google callback error:", err)
        res.redirect(`${process.env.FRONTEND_URL}/login?error=google_failed`)
    }
}

//-------------------------------------------------

module.exports = {
    registerUserController,
    verifyEmailController,
    resendVerificationController,
    loginUserController,
    logoutUserController,
    getMeController,
    forgotPasswordController,
    resetPasswordController,
    googleAuthCallbackController,
}