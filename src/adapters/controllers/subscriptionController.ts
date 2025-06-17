import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils/appConst";
import { ISubscriptionInteractor } from "../../interfaces/interactors/ISubscriptionInteractor";
import { AuthRequest } from "../../dtos/authRequestDto";
import { HttpStatusCode } from "../../utils/statusCode";

@injectable()
export  class subscriptionController {

    constructor(@inject(INTERFACE_TYPE.subscriptionInteractor) private subscriptionInteractor: ISubscriptionInteractor){}

    OnfetchSubscriptons = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const page = parseInt(req.query.page as string) || 1
            const limit = parseInt(req.query.limit as string) || 10

           const {subscriptions, total} = await this.subscriptionInteractor.fetchSubscriptions(page, limit) 

           res.status(HttpStatusCode.OK).json({message: 'success', subscriptions, currentPage: page, totalPages: Math.ceil(total / limit)})
        } catch (error) {
            next(error)
        }
    }

    onFetchSubscriptonById = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            if(!req._id){
                res.status(HttpStatusCode.BAD_REQUEST).json({message: 'user id not found'})
                return 
            }
            const subscriptionId = req.params.id
            const subscription = await this.subscriptionInteractor.fetchSubscriptionById(subscriptionId)

            res.status(HttpStatusCode.OK).json({message: 'success', subscription})

        } catch (error) {
            next(error)
        }
    }

    onAddSubscription = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body.data
            console.log('req body ', req.body)

            if(!data){
                res.status(HttpStatusCode.BAD_REQUEST).json({message: 'data is missing'})
                return
            }

            const subscription = await this.subscriptionInteractor.addSubscription(data)
            console.log('subscription ', subscription)
            res.status(HttpStatusCode.CREATED).json({message: 'success', subscription})
        } catch (error) {
            next(error)
        }
    } 

    onEditSubscription = async(req: Request, res: Response, next: NextFunction) => {
        try {
            console.log('not coming heree ', req.body)
            const { _id, ...data} = req.body
            
            if(!_id){
                res.status(HttpStatusCode.BAD_REQUEST).json({message: 'id is missing'})
                return
            }

            const result = await this.subscriptionInteractor.editSubscription(_id, data)

            res.status(HttpStatusCode.OK).json({message: 'success', subscription: result})
        } catch (error) {
            next(error)
        }
        

    }

    onDeleteSubscription = async(req: Request, res: Response, next: NextFunction) =>{
        try {
            const id = req.query.id

            if(!id){  
                res.status(HttpStatusCode.BAD_REQUEST).json({message: 'id is missing'})
            }   

            await this.subscriptionInteractor.deleteSubscription(id as string)

            res.status(HttpStatusCode.OK).json({message: 'success'})
        } catch (error) {
            next(error)
        }
    }
}