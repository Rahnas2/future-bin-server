
import { Request, Response, NextFunction } from "express"
import { inject, injectable } from "inversify"
import { INTERFACE_TYPE } from "../../utils/appConst"
import { IUserManagmentInteractor } from "../../interfaces/interactors/IUserManagmentInteractor"

@injectable()
export class userManagmentController {

    constructor(@inject(INTERFACE_TYPE.userManagmentInteractor) private userManagmentInteratcor: IUserManagmentInteractor) { }

    //fetch all users 
    onFetchUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log('cookies', req.cookies.refreshToken)
            const users = await this.userManagmentInteratcor.fetchUsers()
            console.log('users ', users)

            res.status(200).json({ message: 'success', users })
        } catch (error) {
            next(error)
        }
    }

    //fetch single user details
    onUserDetail = async (req: Request, res: Response, next: NextFunction) => {
        try {
            
            const { userId } = req.query
            console.log('user id ', userId)
            const user = await this.userManagmentInteratcor.fetchUserDetail(userId as string)

            res.status(200).json({ message: 'success', user })
        } catch (error) {
            next(error)
        }
    }

    //toggle user status (block / unblock)
    onToggleStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = req.body

            await this.userManagmentInteratcor.toggleStatus(userId)

            res.status(200).json({ message: 'success' })
        } catch (error) {
            next(error)
        }
    }

    onFetchCollectors = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { approvedStatus } = req.query

            const collectors = await this.userManagmentInteratcor.fetchCollectors(approvedStatus as string)

            res.status(200).json({message: 'success', collectors})
        } catch (error) {
            next(error)
        }
    }

    onCollectorDetail = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = req.query
            const collector = await this.userManagmentInteratcor.fetchCollectorDetails(userId as string)

            res.status(200).json({message: 'success', collector})
        } catch (error) {
            next(error)
        }
    }

    //accept collector registeration request
    onAcceptRequest = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { collectorId, name, email } = req.body

            await this.userManagmentInteratcor.acceptRequest(collectorId, name, email)

            res.status(200).json({ message: 'accepted collector request' })
        } catch (error) {
            next(error)
        }
    }


    //reject collector registeration request
    onRejectRequest = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { collectorId, name, email } = req.body

            await this.userManagmentInteratcor.rejectRequest(collectorId, name, email)

            res.status(200).json({ message: 'rejected collector request' })
        } catch (error) {
            next(error)
        }
    }

}