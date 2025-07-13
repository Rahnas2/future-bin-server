import { Response, Request, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils/appConst";
import { IAdminteractor } from "../../interfaces/interactors/IAdminInteractor";
import { HttpStatusCode } from "../../utils/statusCode";

@injectable()
export class adminController {

    constructor(@inject(INTERFACE_TYPE.adminInteractor) private adminteractor: IAdminteractor) { }

    onLogin = async (req: Request, res: Response, next: NextFunction) => {
        try {
            
            const { email, password, secret } = req.body

            const response = await this.adminteractor.login(email, password, secret)

            const { accessToken, refreshToken, role } = response
            console.log('refresh token ', refreshToken)

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production' ? true : false,
                sameSite: 'strict',
                maxAge: 1 * 24 * 60 * 60 * 1000,
            })

            res.status(HttpStatusCode.OK).json({ message: 'success', accessToken, role })

        } catch (error) {
            console.error('hello error ', error)
            next(error)
        }
    }

    //Dashboard Summary
    onGetSummary = async (req: Request, res: Response, next: NextFunction) => {
        try {
            
            const summary =  await this.adminteractor.getSummary()

            res.status(HttpStatusCode.OK).json({message: 'success', summary})
        } catch (error) {
            next(error)
        }
    }

    // Dashboard Analytics 
    onAnalytics = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { from, to } = req.query
            if(!from || !to) {
                res.status(HttpStatusCode.BAD_REQUEST).json({message: 'date is missing '})
                return
            }

            const analytics = await this.adminteractor.analytics(from as string, to as string)

            res.status(HttpStatusCode.OK).json({message: 'success', analytics})
        } catch (error) {    
            next(error)
        }    
    }


    //Revenue 
    onRevenue = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const summary = await this.adminteractor.revenue()
            res.status(HttpStatusCode.OK).json({message: 'success', summary})
        } catch (error) {
            next(error)
        }
    }

}