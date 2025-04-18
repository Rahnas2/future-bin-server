import { Response, Request, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils/appConst";
import { IAdminteractor } from "../../interfaces/interactors/IAdminInteractor";

@injectable()
export class adminController {

    constructor(@inject(INTERFACE_TYPE.adminInteractor) private adminteractor: IAdminteractor) { }

    onLogin = async (req: Request, res: Response, next: NextFunction) => {
        console.log('login started ',)
        try {
            
            const { email, password, secret } = req.body

            const response = await this.adminteractor.login(email, password, secret)

            const { accessToken, refreshToken, role } = response
            console.log('refresh token ', refreshToken)

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: 1 * 24 * 60 * 60 * 1000,
            })

            res.status(200).json({ message: 'success', accessToken, role })

        } catch (error) {
            console.error('hello error ', error)
            next(error)
        }
    }
}