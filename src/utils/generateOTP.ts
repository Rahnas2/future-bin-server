import crypto from 'crypto'

const generateOTP = (): string =>  {
    const otp = crypto.randomInt(100000, 999999)
    return otp.toString()
}

export default generateOTP