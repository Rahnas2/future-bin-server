import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils/appConst";
import { IWasteTypeInteractor } from "../../interfaces/interactors/IWasteTypeInteractor";

@injectable()
export class wasteTypeController {

    constructor(@inject(INTERFACE_TYPE.wasteTypeInteractor) private wasteTypeInteractor: IWasteTypeInteractor) {}

    onGetAllWasteTypes = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const page = parseInt(req.query.page as string) || 1
            const limit = parseInt(req.query.limit as string) || 10
            const search = req.query.search?.toString() || ""

            const {wasteTypes, total} = await this.wasteTypeInteractor.getAllWasteTypes(page, limit, search)
            res.status(200).json({message: 'success', wasteTypes, currentPage: page, totalPages: Math.ceil(total / limit)})
        } catch (error) {
            next(error)    
        }
    }

    onAddWasteType = async(req: Request, res: Response, next: NextFunction) => {
        try {

            const { name, price } = req.body

            if(!name || !price){
                res.status(400).json({message: 'required fields are missing'})
            }

            const wasteType = await this.wasteTypeInteractor.addWasteType({name, price})

            res.status(200).json({message: 'success', wasteType})
        } catch (error) {
            next(error)
        }
    }

    onEditWasteType = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const { _id, ...data } = req.body

            if(!_id){
                res.status(400).json({message: 'id is missing'})
                return 
            }

            const updatedWasteType = await this.wasteTypeInteractor.editWasteType(_id, data)

            res.status(200).json({message: 'success', updatedWasteType})
        } catch (error) {
            next(error)
        }
    }

    onDeleteWasteType = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const { _id } = req.query

            if(!_id){
                res.status(400).json({message: '_id is missing'})
                return
            }

            await this.wasteTypeInteractor.deleteWasteType(_id as string)

            res.status(200).json({message: 'success'})
        } catch (error) {
            next(error)
        }
    }

}