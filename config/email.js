const nodemailer = require('nodemailer');

// Gmail configuration with explicit SMTP settings for better compatibility
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465, // Use SSL port instead of TLS
  secure: true, // Use SSL
  auth: {
    user: process.env.EMAILID,
    pass: process.env.PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify transporter configuration on startup (don't block if it fails)
transporter.verify(function(error, success) {
  if (error) {
    console.error('⚠️  Email transporter verification failed:', error.message);
    console.log('⚠️  Email may not work. Consider using SendGrid instead.');
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

// Function to send OTP email
const sendOTPEmail = async (email, otp) => {
  try {
    console.log(`Attempting to send OTP to ${email}...`);
    
    const mailOptions = {
      from: `"Chat App" <${process.env.EMAILID}>`,
      to: email,
      subject: 'OTP Verification - Chat App',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">OTP Verification</h2>
          <p>Your OTP for verification is:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #007bff; font-size: 32px; margin: 0;">${otp}</h1>
          </div>
          <p>This OTP will expire in 2 minutes (120 seconds).</p>
          <p style="color: #666; font-size: 12px;">If you didn't request this OTP, please ignore this email.</p>
        </div>
      `,
      text: `Your OTP for verification is: ${otp}. This OTP will expire in 2 minutes.`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    console.error('Full error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendOTPEmail };

