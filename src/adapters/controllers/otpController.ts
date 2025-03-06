
import { Request, Response, NextFunction } from 'express'
import {injectable, inject} from 'inversify'
import { IOtpInteractor } from '../../interfaces/interactors/IOtpInteractor'
import { INTERFACE_TYPE } from '../../utils/appConst'


@injectable()
export class otpController {

    private interactor: IOtpInteractor

    constructor(
        @inject(INTERFACE_TYPE.otpInteractor) interactor: IOtpInteractor
    ){
        this.interactor = interactor
    }

     onSentOTP = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.body

            await this.interactor.sentOtp(email)

            res.status(200).json({message: 'success'})
            return 
        } catch (error) {
            console.error('error ', error)
            next(error)
        }
    }

    onVerifyOTP = async (req: Request, res: Response, next: NextFunction) =>{
        try {
            const { email, otp } = req.body

            await this.interactor.verifyOtp(email, otp)

            res.status(200).json({message: 'otp verifies successfully'})
        } catch (error) {
            console.log('error ', error)
            next(error)
        }
    }
}