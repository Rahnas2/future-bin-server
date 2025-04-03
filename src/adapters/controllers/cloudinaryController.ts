import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils/appConst";
import { ICloudinaryService } from "../../interfaces/services/ICloudinaryService";

@injectable()
export class cloudinaryController {
    constructor(@inject(INTERFACE_TYPE.cloudinaryService) private cloudinaryService: ICloudinaryService){}

    onDeleteImage = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const { public_id } = req.body

            if(!public_id){
                res.status(400).json({message: 'public id not found'})
                return 
            }

            const response = await this.cloudinaryService.deleteImage(public_id as string)

            res.status(200).json({message: 'success', response})
            
        } catch (error) {
            next(error)
        }
    }
}