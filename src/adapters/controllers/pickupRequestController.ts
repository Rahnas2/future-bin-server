import { inject, injectable } from "inversify";
import { AuthRequest } from "../../dtos/authRequestDto";
import { Request, Response, NextFunction } from "express";
import { INTERFACE_TYPE } from "../../utils/appConst";
import { IPickupRequestInteractor } from "../../interfaces/interactors/IPickupRequestInteractor";
import { IStripService } from "../../interfaces/services/IStripService";
import { HttpStatusCode } from "../../utils/statusCode";


@injectable()
export class pickupRequestController {

    constructor(@inject(INTERFACE_TYPE.pickupRequestInteractor) private pickupRequestInteractor: IPickupRequestInteractor,
        @inject(INTERFACE_TYPE.stripeService) private stripeService: IStripService) { }


    //create new pickup request
    onCreatePickupRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req._id

            const requestData = req.body
            requestData['userId'] = userId

            if (!requestData) {
                res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'data is missing' })
                return
            }

            await this.pickupRequestInteractor.createPickupRequest(requestData)

            res.status(HttpStatusCode.CREATED).json({ message: 'your request is created please wait for collector acceptence' })

        } catch (error) {
            next(error)
        }
    }

    //get all neaby pending pickup request for collectors
    onGetNearPickupRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
        console.log('hello ', req._id)
        try {
            const id = req._id

            if (!id) {
                res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'id is missing' })
                return
            }

            const requests = await this.pickupRequestInteractor.getPickupRequestByCollectorId(id)
            console.log('pickup reuqest ', requests)
            res.status(HttpStatusCode.OK).json({ message: 'success', requests })
        } catch (error) {
            next(error)
        }
    }

    //get pickup request by id
    ongetPickupRequestById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id

            if (!id) {
                res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'id not found' })
                return
            }

            const request = await this.pickupRequestInteractor.getPickupRequestById(id)

            res.status(HttpStatusCode.OK).json({ message: 'success', request })
        } catch (error) {
            next(error)
        }
    }

    //accept a pickup request
    onAcceptRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const collectorId = req._id

            const { requestId, collectorName } = req.body

            if (!collectorId) {
                res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'id is missing' })
                return
            }

            await this.pickupRequestInteractor.acceptRequest(collectorId, requestId, collectorName)

            res.status(HttpStatusCode.OK).json({ message: 'success' })

        } catch (error) {
            next(error)
        }
    }

    onUpdatePickupRequest = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { _id, ...data } = req.body

            if (!_id) {
                res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'id is missing' })
                return
            }

            const request = await this.pickupRequestInteractor.updatePickupRequest(_id, data)

            res.status(HttpStatusCode.OK).json({ message: 'success', request })
        } catch (error) {
            next(error)
        }
    }

    //Get Area Data For Collector 
    onGetAreaDataForCollector = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const collectorId = req._id

            if (!collectorId) {
                res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'id is missing' })
                return
            }

            const data = await this.pickupRequestInteractor.getAreaDataForCollector(collectorId)

            res.status(HttpStatusCode.OK).json({message: 'success', data})
        } catch (error) {
            next(error)
        }
    }

    onUserPickupRequestHistoryByStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const id = req._id
            const role = req.role

            const status = req.params.status
            console.log('status ', status)

            const page = parseInt(req.query.page as string) || 1
            const limit = parseInt(req.query.limit as string) || 10

            if (!id || !role) {
                res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'id or role is missing' })
                return
            }

            const { requests, total } = await this.pickupRequestInteractor.userPickupRequestHistoryByStatus(id, role, status, page, limit)

            res.status(HttpStatusCode.OK).json({ message: 'success', requests, currentPage: page, totalPages: Math.ceil(total / limit), total })
        } catch (error) {
            next(error)
        }
    }

    onGetPickupRequestsByTypeAndStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { type, status } = req.params

            const role = req.role
            const userId = req._id

            const pickupRequests = await this.pickupRequestInteractor.getPickupRequestsByTypeAndStatus(type, status, role!, userId!)

            res.status(HttpStatusCode.OK).json({ message: 'success', pickupRequests })
        } catch (error) {
            next(error)
        }
    }



    //cancel pickup request for both user and collector
    onCacelRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const role = req.role
            const { id, data } = req.body

            const request = await this.pickupRequestInteractor.cancelRequest(id, role as 'resident' | 'collector', data)
            res.status(HttpStatusCode.OK).json({ message: 'success', request })
        } catch (error) {
            next(error)
        }

    }

    onCompleteRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { id } = req.body

            await this.pickupRequestInteractor.completeRequest(id)

            res.status(HttpStatusCode.OK).json({ message: 'success' })
        } catch (error) {
            next(error)
        }
    }

}