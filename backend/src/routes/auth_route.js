const express = require("express");
const authRouter = express.Router();
const passport = require("../config/passport");
const authController = require("../controllers/auth_con");
const authMiddlewar = require("../middlewares/auth_mid");

// ── Email / password ─────────────────────────────────────────────────────────
authRouter.post("/register", authController.registerUserController);
authRouter.post("/login", authController.loginUserController);
authRouter.post("/logout", authController.logoutUserController);
authRouter.get("/get-me", authMiddlewar.authUser, authController.getMeController);

// ── Email verification ───────────────────────────────────────────────────────
authRouter.post("/verify-email", authController.verifyEmailController);
authRouter.post("/resend-verification", authController.resendVerificationController);

// ── Password reset ───────────────────────────────────────────────────────────
authRouter.post("/forgot-password", authController.forgotPasswordController);
authRouter.post("/reset-password", authController.resetPasswordController);

// ── Google OAuth ─────────────────────────────────────────────────────────────
authRouter.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

authRouter.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_failed`,
    }),
    authController.googleAuthCallbackController
);

module.exports = authRouter;
