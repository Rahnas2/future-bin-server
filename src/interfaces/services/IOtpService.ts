export interface IOtpService {
    sentOtp(email: string, otp: string): void
    verifyOtp(email: string, otp: string): void
}