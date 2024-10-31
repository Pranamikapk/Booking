import 'dotenv/config';
import nodemailer from 'nodemailer';

export async function sendOTPEmail(userEmail, otp) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user : process.env.EMAIL,
            pass:  process.env.PASSWORD
        }
    })

    const mailOptions = {
        from: process.env.EMAIL,
        to: userEmail,
        subject:'Your OTP Code',
        text: `Your OTP code is ${otp}. It will expire in 10 minutes`
    }

    await transporter.sendMail(mailOptions,(error,info)=>{
        if(error){
            console.log('Error sending mail:',error);
        }else{
            console.log('Email send:',otp);
            
        }
    })
}

export async function passwordResetEmail(userEmail, resetUrl) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
  
    const mailOptions = {
      from: process.env.EMAIL,
      to: userEmail,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Click the link below to reset your password: ${resetUrl}\nIf you didn't request this, please ignore this email.`,
    };
  
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Password reset email sent:', info.response);
    } catch (error) {
      console.error('Error sending password reset email:', error);
    }
  }