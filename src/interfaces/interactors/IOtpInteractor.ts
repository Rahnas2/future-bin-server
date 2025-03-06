export interface IOtpInteractor {
    sentOtp(email: string): void
    verifyOtp(email: string, otp: string): unknown
}