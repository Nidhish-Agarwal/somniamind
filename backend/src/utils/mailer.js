const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail({
  to,
  subject,
  html,
  text,
  from = "SomniaMind Support <support@somniamind.com>",
  replyTo = "support@somniamind.com",
}) {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
      text,
      reply_to: replyTo,
    });

    if (error) {
      console.error("Resend error:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Email send failed:", err);
    throw err;
  }
}

function sendPasswordResetEmail(to, link) {
  const text = `
Reset your SomniaMind password

We received a request to reset your password.

Use the link below to set a new password:
${link}

This link expires in 15 minutes.

If you did not request this, you can safely ignore this email.
`;

  const html = `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#0f172a;font-family:Arial,sans-serif;color:#e5e7eb;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#111827;border-radius:16px;padding:28px;border:1px solid rgba(255,255,255,0.12);">
            <tr>
              <td align="center" style="padding-bottom:12px;">
                <h1 style="margin:0;font-size:24px;color:#f8fafc;">SomniaMind</h1>
              </td>
            </tr>
            <tr>
              <td style="padding-bottom:12px;text-align:center;">
                <h2 style="margin:0;font-size:18px;color:#e5e7eb;">Reset your password</h2>
              </td>
            </tr>
            <tr>
              <td style="padding-bottom:18px;text-align:center;font-size:14px;line-height:1.6;color:#cbd5f5;">
                We received a request to reset your SomniaMind password.
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-bottom:22px;">
                <a href="${link}" style="display:inline-block;padding:12px 28px;border-radius:999px;background:#8b5cf6;color:#ffffff;text-decoration:none;font-weight:600;">
                  Reset Password
                </a>
              </td>
            </tr>
            <tr>
              <td style="font-size:12px;color:#94a3b8;text-align:center;">
                This link expires in 15 minutes.<br/>
                If you didn’t request this, you can safely ignore this email.
              </td>
            </tr>
            <tr>
              <td style="padding-top:18px;font-size:11px;color:#64748b;text-align:center;">
                © ${new Date().getFullYear()} SomniaMind
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

  return sendEmail({
    to,
    subject: "Reset your SomniaMind password",
    text,
    html,
  });
}

function sendFeedbackEmail(userName, userEmail, emoji, feedbackType, message) {
  const subjectEmoji = emoji || "📝";

  const text = `
    New feedback received on SomniaMind

    From: ${userName} <${userEmail}>
    Type: ${feedbackType.toUpperCase()}

    Message:
    ${message}
  `;

  const html = `
    <!DOCTYPE html>
    <html>
      <body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif;color:#111827;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 12px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" style="
                max-width:600px;
                background:#ffffff;
                border-radius:14px;
                padding:24px;
                border:1px solid #e5e7eb;
              ">
                <!-- Header -->
                <tr>
                  <td style="padding-bottom:16px;">
                    <h2 style="margin:0;font-size:20px;">
                      ${subjectEmoji} New Feedback
                    </h2>
                  </td>
                </tr>

                <!-- Meta -->
                <tr>
                  <td style="font-size:14px;line-height:1.6;padding-bottom:12px;">
                    <strong>From:</strong> ${userName} (<a href="mailto:${userEmail}">${userEmail}</a>)<br/>
                    <strong>Type:</strong> ${feedbackType.toUpperCase()}
                  </td>
                </tr>

                <tr>
                  <td style="padding:16px 0;">
                    <hr style="border:none;border-top:1px solid #e5e7eb;" />
                  </td>
                </tr>

                <!-- Message -->
                <tr>
                  <td style="font-size:14.5px;line-height:1.7;white-space:pre-wrap;">
                    ${message}
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding-top:20px;font-size:12px;color:#6b7280;">
                    This feedback was submitted via SomniaMind.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return sendEmail({
    from: "SomniaMind Feedback <feedback@somniamind.com>",
    replyTo: userEmail, // IMPORTANT: lets you reply directly to user
    to: "feedback@somniamind.com",
    subject: `${subjectEmoji} Feedback from ${userName}`,
    text,
    html,
  });
}

module.exports = { sendPasswordResetEmail, sendFeedbackEmail };
