import { inject, injectable } from "inversify";
import { AuthRequest } from "../../dtos/authRequestDto";
import { Request, Response, NextFunction } from "express";
import { INTERFACE_TYPE } from "../../utils/appConst";
import { IPickupRequestInteractor } from "../../interfaces/interactors/IPickupRequestInteractor";
import { json } from "body-parser";
import { emailService } from "../../infrastructure/services/emailService";


@injectable()
export class pickupRequestController {

    constructor(@inject(INTERFACE_TYPE.pickupRequestInteractor) private pickupRequestInteractor: IPickupRequestInteractor) {}

    
    //create new pickup request
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

            res.status(201).json({message: 'your request is created please wait for collector acceptence'})

        } catch (error) {
            next(error)
        }
    }

    //get all neaby pending pickup request for collectors
    onGetNearPickupRequest = async(req: AuthRequest, res: Response, next: NextFunction) => {

        try {
            const id = req._id

            if(!id){
                res.status(400).json({message: 'id is missing'})
                return 
            }

            const requests = await this.pickupRequestInteractor.getPickupRequestByCollectorId(id)

            res.status(200).json({message: 'success', requests})

        } catch (error) {
            next(error)
        }
    }

    //get pickup request by id
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

    //accept a pickup request
    onAcceptRequest = async(req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const collectorId = req._id

            const { requestId, collectorName } = req.body

            if(!collectorId){
                res.status(400).json({message: 'id is missing'})
                return 
            }

            await this.pickupRequestInteractor.acceptRequest(collectorId, requestId, collectorName)

            res.status(200).json({message: 'success'})

        } catch (error) {
            next(error)
        }
    }

    onUpdatePickupRequest = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const { _id, ...data} = req.body

            if(!_id){
                res.status(400).json({message: 'id is missing'})
                return
            }

            const request = await this.pickupRequestInteractor.updatePickupRequest(_id, data)

            res.status(200).json({message: 'success', request})
        } catch (error) {
            next(error)
        }
    }

    onUserPickupRequestHistory = async(req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const id = req._id
            const role = req.role

            if(!id || !role){
                res.status(400).json({message: 'id or role is missing'})
                return 
            }

            const requestHistory = await this.pickupRequestInteractor.userPickupRequestHistory(id, role)

            res.status(200).json({message: 'success', requestHistory})
        } catch (error) {
            next(error)
        }
    }


    onCompleteRequest = async(req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            
        } catch (error) {
            
        }
    }

    //cancel pickup request for both user and collector
    onCacelRequest = async(req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const role = req.role
            const {id, data} = req.body
    
            const request = await this.pickupRequestInteractor.cancelRequest(id, role as 'resident' | 'collector', data) 

            res.status(200).json({message: 'success', request})
        } catch (error) {
            next(error)
        }
        
    }
    
}