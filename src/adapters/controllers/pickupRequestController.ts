import { inject, injectable } from "inversify";
import { AuthRequest } from "../../dtos/authRequestDto";
import { Request, Response, NextFunction } from "express";
import { INTERFACE_TYPE } from "../../utils/appConst";
import { IPickupRequestInteractor } from "../../interfaces/interactors/IPickupRequestInteractor";
import { json } from "body-parser";


@injectable()
export class pickupRequestController {

    constructor(@inject(INTERFACE_TYPE.pickupRequestInteractor) private pickupRequestInteractor: IPickupRequestInteractor) {}

    onCreatePickupRequest = async(req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req._id

            const requestData = req.body
            requestData['userId'] = userId

            if(!requestData){
                res.status(400).json({message: 'data is missing'})
                return
            }

            await this.pickupRequestInteractor.createPickupRequest(requestData)

            res.status(201).json({message: 'your request is created'})

        } catch (error) {
            next(error)
        }
    }

    onGetNearPickupRequest = async(req: AuthRequest, res: Response, next: NextFunction) => {

        try {
            const id = req._id

            if(!id){
                res.status(400).json({message: 'id is missing'})
                return 
            }

            const requests = await this.pickupRequestInteractor.getNearPickupRequestById(id)

            res.status(200).json({message: 'success', requests})

        } catch (error) {
            next(error)
        }
    }

    ongetPickupRequestById = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id

            if(!id){
                res.status(400).json({message: 'id not found'})
                return 
            }

            const request = await this.pickupRequestInteractor.getPickupRequestById(id)

            res.status(200).json({message: 'success', request})
        } catch (error) {
            next(error)
        }
    }
}