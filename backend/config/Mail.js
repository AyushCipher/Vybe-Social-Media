import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user:process.env.EMAIL,
    pass:process.env.EMAIL_PASS,
  },
});

const sendMail = async (to, otp) => {
  await transporter.sendMail({
    from: `${process.env.EMAIL}`,
    to,
    subject: "🔑 Reset Your Password - OTP Inside",
    html: `
      <div style="font-family: Arial, sans-serif; background: #f4f4f7; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
          <p style="color: #555; font-size: 15px; text-align: center;">
            Hello 👋, we received a request to reset your password.  
            Use the OTP below to proceed. This code will expire in <b>5 minutes</b>.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <span style="display: inline-block; font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #ffffff; background: #4CAF50; padding: 12px 20px; border-radius: 8px;">
              ${otp}
            </span>
          </div>

          <p style="color: #555; font-size: 14px;">
            If you did not request this, please ignore this email. Your account remains secure.
          </p>

          <hr style="margin: 25px 0; border: none; border-top: 1px solid #eee;" />

          <p style="font-size: 12px; color: #999; text-align: center;">
            © ${new Date().getFullYear()} Vybe. All rights reserved.  
            <br/>This is an automated message, please do not reply.
          </p>
        </div>
      </div>
    `
  })
}


export default sendMail