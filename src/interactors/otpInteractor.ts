import { injectable, inject } from "inversify";
import generateOTP from "../utils/generateOTP";

import { INTERFACE_TYPE } from "../utils/appConst";
import { otpService } from "../infrastructure/services/otpService";
import { IOtpService } from "../interfaces/services/IOtpService";
import { IOtpInteractor } from "../interfaces/interactors/IOtpInteractor";


@injectable()
export class otpInteractor implements IOtpInteractor {
    private otpService: IOtpService;

    constructor(
        @inject(INTERFACE_TYPE.otpService) otpService: IOtpService
    ){
        this.otpService = otpService
    }

    async sentOtp(email: string) {
        const otp = generateOTP()
        await this.otpService.sentOtp(email, otp)
    }

    async verifyOtp(email: string, otp: string) {
        await this.otpService.verifyOtp(email, otp)
    }

}