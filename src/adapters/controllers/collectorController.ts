import { Response, Request, NextFunction } from "express";
import { id, inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils/appConst";
import { IUserManagmentInteractor } from "../../interfaces/interactors/IUserManagmentInteractor";
import { AuthRequest } from "../../dtos/authRequestDto";
import { ICollectorInteractor } from "../../interfaces/interactors/ICollectorInteractor";

@injectable()
export class collectorController {
    constructor(@inject(INTERFACE_TYPE.userManagmentInteractor) private userManagementInteractor: IUserManagmentInteractor,
        @inject(INTERFACE_TYPE.collectorInteractor) private collectorInteractor: ICollectorInteractor) { }

    //fetch collector
    onFetchCollector = async (req: AuthRequest, res: Response, next: NextFunction) => {
        console.log('start fetching ')
        try {
            const userId = req._id
            const collector = await this.userManagementInteractor.fetchCollectorDetails(userId as string)
            res.status(200).json({ message: 'success', collector })
        } catch (error) {
            next(error)
        }
    }

    //update collector
    onPatchUpdates = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { _id, ...data } = req.body

            if (!_id) {
                res.status(400).json({ message: 'id is missing' })
                return
            }

            const updatedCollector = await this.collectorInteractor.patchUpdate(_id, data)
            res.status(200).json({message: 'success', updatedCollector})
        } catch (error) {
            next(error)
        }
    }

    //collector earnings summary 
    onGetMyEarnings = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const collectorId = req._id

            if(!collectorId){
                res.status(400).json({message: 'collector id is missing '})
                return 
            }

            const summary = await this.collectorInteractor.getMyEarnings(collectorId)

            res.status(200).json({message: 'success', summary})
        } catch (error) {
            next(error)
        }
    }

    //Generate on boarding link for conncted account
    onGetOnboardingLink = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const { stripeAccountId } = req.params

            const url = await this.collectorInteractor.generateOnboardingLink(stripeAccountId)

            res.status(200).json({message: 'success', url})
        } catch (error) {
            next(error)
        }
    }

    onWithdrawBalance = async(req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const collectorId = req._id

            const { amount } = req.body
            if(!collectorId) {
                res.status(400).json({message: 'collector id is missing '})
                return 
            }

            if(!amount || amount < 1){
                res.status(400).json({message: 'mininum withdrawal amount is 1'})
                return 
            }

            const payout = await this.collectorInteractor.withdrawBalance(collectorId, amount)

            res.status(200).json({message: 'success', payout})

        } catch (error) {
            next(error)
        }
    }
}