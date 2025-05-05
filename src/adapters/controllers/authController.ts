import { Response, Request, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { IAuthInteractor } from "../../interfaces/interactors/IAuthInteractor";
import { INTERFACE_TYPE } from "../../utils/appConst";
import { notFound } from "../../domain/errors";


@injectable()
export class authController {
    private interactor: IAuthInteractor

    constructor(
        @inject(INTERFACE_TYPE.authInteractor) interactor: IAuthInteractor

    ) {
        this.interactor = interactor
    }

    //registeration step 1 (normal)
    onbasicInfo = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData = req.body.userData

            await this.interactor.basicInfo(userData)
            res.status(200).json({ messge: 'success', email: userData.email })
            return
        } catch (error: any) {

            if (error.message === "Email is already taken") {
                res.status(400).json({ message: "Email is already taken" });
                return

            }

            next(error)
        }
    }

    //registeration step 1 (google)
    onBasicInfoGoogle = async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log('req query', req.query)
            const { code } = req.query

            if (!code) {
                res.status(400).json({ message: 'missing authorization code' })
            }

            const email = await this.interactor.basicInfoGoogle(code as string)

            res.status(200).json({ message: "success", email })
        } catch (error) {
            next(error)
        }
    }

    //registeration step 1 (facebook)
    onbasicInfoFB = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId, token } = req.body
            console.log('facebook register body ', req.body)
            if (!userId || userId == '' || !token || token == '') {
                res.status(400).json({ message: "userId and accessToken are required" });
                return
            }

            const email = await this.interactor.basicInfoFB(userId, token)

            res.status(200).json({ message: 'success', email })

        } catch (error) {
            next(error)
        }
    }

    onVerfiyOtp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, otp } = req.body
            console.log('body ', req.body)
            const result = await this.interactor.verifyOtp(email, otp)
            console.log('result ', result)
            result ? res.status(200).json({ message: 'success' }) : res.status(401).json({ message: 'invalid otp' })
            return
        } catch (error) {
            console.error('error ', error)
            next(error)
        }
    }

    onResentOtp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.body
            await this.interactor.resentOtp(email)

            res.status(200).json({ message: `new otp sent to ${email}` })
        } catch (error) {
            next(error)
        }
    }

    onUpdateRole = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, role } = req.body
            console.log('req body ', req.body)
            await this.interactor.updateRole(email, role)
            res.status(200).json({ message: 'success' })
        } catch (error) {
            next(error)
        }
    }

    onCompleteProfile = async (req: Request, res: Response, next: NextFunction) => {
        console.log('hello ')
        try {
            const data = req.body
            console.log('befor reponse', data)
            const response = await this.interactor.completeProfile(data, req.files as Record<string, Express.Multer.File[]>)
            console.log('response ', response)
            const { accessToken, refreshToken, role } = response

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
                maxAge: 1 * 24 * 60 * 60 * 1000,
            })
            console.log('complete profile backend successfull', accessToken)
            console.log('role ', role)
            res.status(201).json({ message: 'success', accessToken, role })
        } catch (error) {
            console.log('oncomplet profjie error ', error)
            next(error)
        }
    }

    onLogin = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body
            console.log('data ', data)

            const response = await this.interactor.login(data)

            const { accessToken, refreshToken, role } = response

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: 1 * 24 * 60 * 60 * 1000,
            })

            res.status(200).json({ message: 'success', accessToken, role })
        } catch (error) {
            next(error)
        }
    }

    onGoogleLogin = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { code } = req.query

            console.log('query ', code)
            if (!code) {
                res.status(400).json({ message: 'missing authorization code' })
                return
            }

            const response = await this.interactor.googleLogin(code as string)

            const { accessToken, refreshToken, role } = response

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: 1 * 24 * 60 * 60 * 1000,
            })

            res.status(200).json({ message: 'success', accessToken, role })
        } catch (error) {
            next(error)
        }
    }

    //facebook login
    onFacebookLogin = async (req: Request, res: Response, next: NextFunction) => {
        try {
            //destucture user id and acccess token from body
            const { userId, token } = req.body

            //verify user ID and access token
            if (!userId || userId == '' || !token || token == '') {
                res.status(400).json({ message: "userId and accessToken are required" });
                return
            }

            const { accessToken, refreshToken, role } = await this.interactor.facebookLogin(userId, token)

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: 1 * 24 * 60 * 60 * 1000,
            })

            res.status(200).json({ message: 'success', accessToken, role })

        } catch (error) {
            next(error)
        }
    }

    onForgotPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.body

            if(!email){
                res.status(400).json({message: 'email is required'})
            }

            await this.interactor.forgotPassword(email)

            res.status(200).json({message: 'success'})
        } catch (error) {
            next(error)
        }
    }

    onResetPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, newPassword } = req.body

            if(!email || !newPassword) {
                throw new notFound('email or password is missing')
            }

            await this.interactor.resetPassword(email, newPassword)

            res.status(200).json({message: 'success'})
            
        } catch (error) {
            next(error)
        }
    }

    onRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const refreshToken = req.cookies.refreshToken
            console.log('refresh token -> ', refreshToken)
            if (!refreshToken) {
                res.status(400).json({ message: "Unauthorized" })
                return
            }

            const { accessToken, role } = await this.interactor.refreshToken(refreshToken)
            console.log('result', role)

            res.status(200).json({ message: 'success', accessToken, role })
        } catch (error) {
            console.log('rfresth errror ', error)
            next(error)
        }
    }

    onLogOut = async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.clearCookie('refreshToken')
            res.status(200).json({ message: 'success' })
        } catch (error) {
            next(error)
        }
    }
}