import { IOtpService } from "../../interfaces/services/IOtpService";
import transporter from "../config/nodemailerConfig";
import { injectable, inject } from "inversify";
import redisClient from "../config/redis";

@injectable()
export class otpService implements IOtpService{
    
    async sentOtp (email: string, otp: string) {
        const mailOption = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'OTP FOR EMAIL VERIFICATION',
            html: `<p>Your OTP is: <strong>${otp}</strong>. Please do not share it with anyone.</p>`,
        }

        try {
            console.log('hello ', transporter.options)
            await transporter.sendMail(mailOption)
            await redisClient.setEx(email, 300, otp)
            console.log('OTP Sent to ', email)
        } catch (error) {
            console.error('error sending OTP', error)
        }
    }

    async verifyOtp(email: string, otp: string) {
        try {
            const actualOtp = await redisClient.get(email)   
            return otp === actualOtp
        } catch (error) {
            console.error('verifying otp  error ', error)
        }  
    }
}