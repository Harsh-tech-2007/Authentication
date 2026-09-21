const nodemailer = require("nodemailer");

// ── Transporter (Gmail + App Password) ──────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

// ── Shared email wrapper ─────────────────────────────────────────────────────
async function sendMail({ to, subject, html }) {
  await transporter.sendMail({
    from: `"AuthApp" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}

// ── Email verification ───────────────────────────────────────────────────────
async function sendVerificationEmail(email, otp) {
  await sendMail({
    to: email,
    subject: "Verify your email — AuthApp",
    html: ```
<div style="font-family:Inter,Arial,sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#f8fafc;border-radius:16px;color:#0f172a;">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:24px;">
        <div style="display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;background:#4f46e5;border-radius:10px;color:#fff;font-size:20px;font-weight:800;margin-bottom:14px;">
            A
        </div>

        <h1 style="margin:0;font-size:24px;font-weight:700;letter-spacing:-0.02em;">
            Verify your email
        </h1>

        <p style="margin:8px 0 0;color:#64748b;font-size:14px;line-height:1.5;">
            Use the verification code below to continue.
        </p>
    </div>

    <!-- OTP Card -->
    <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;padding:28px 24px;text-align:center;">

        <p style="margin:0 0 16px;color:#475569;font-size:14px;">
            Your verification code is
        </p>

        <div style="display:inline-block;background:#eef2ff;border-radius:10px;padding:14px 22px;color:#4f46e5;font-size:32px;font-weight:800;letter-spacing:8px;">
            ${otp}
        </div>

        <p style="margin:18px 0 0;color:#94a3b8;font-size:12px;">
            This code expires in 15 minutes.
        </p>

    </div>

    <!-- Footer -->
    <p style="margin:20px 0 0;text-align:center;color:#94a3b8;font-size:12px;line-height:1.5;">
        If you didn't create an account, you can safely ignore this email.
    </p>

</div>
```,
  });
}

// ── Password reset ───────────────────────────────────────────────────────────
async function sendPasswordResetEmail(email, otp) {
  await sendMail({
    to: email,
    subject: "Reset your password — AuthApp",
    html: ```
<div style="font-family:Inter,Arial,sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#f8fafc;border-radius:16px;color:#0f172a;">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:24px;">

        <div style="display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;background:#4f46e5;border-radius:10px;color:#fff;font-size:20px;font-weight:800;margin-bottom:14px;">
            A
        </div>

        <h1 style="margin:0;font-size:24px;font-weight:700;letter-spacing:-0.02em;">
            Reset your password
        </h1>

        <p style="margin:8px 0 0;color:#64748b;font-size:14px;line-height:1.5;">
            We received a request to reset your password.
        </p>

    </div>

    <!-- OTP Card -->
    <div style="background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:28px 24px;text-align:center;">

        <p style="margin:0 0 16px;color:#475569;font-size:14px;">
            Use the verification code below to continue.
        </p>

        <div style="display:inline-block;background:#eef2ff;border-radius:10px;padding:14px 22px;color:#4f46e5;font-size:32px;font-weight:800;letter-spacing:8px;">
            ${otp}
        </div>

        <p style="margin:18px 0 0;color:#94a3b8;font-size:12px;">
            This code expires in 15 minutes.
        </p>

    </div>

    <!-- Security Notice -->
    <p style="margin:20px 0 0;text-align:center;color:#94a3b8;font-size:12px;line-height:1.5;">
        If you didn't request a password reset, you can safely ignore this email.
    </p>

</div>
```,
  });
}

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
