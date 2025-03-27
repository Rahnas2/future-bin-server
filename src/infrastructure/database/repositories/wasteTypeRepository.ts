import { injectable } from "inversify";
import { BaseRepository } from "./baseRepository";
import { IWasteTypeDocument } from "../../../interfaces/documents/IWasteTypeDocument";
import { IWasteTypeRepository } from "../../../interfaces/repositories/IWasteTypeRepository";
import wasteTypeModel from "../models/wasteType";
import { DatabaseError } from "../../../domain/errors";

@injectable()
export class wasteTypeRepository extends BaseRepository<IWasteTypeDocument> implements IWasteTypeRepository {
    constructor(){
        super(wasteTypeModel)
    }

    async findWasteTypeByName(name: string): Promise<IWasteTypeDocument | null> {
        try {
            return await this.model.findOne({name: { $regex: new RegExp(name, 'i') }})
        } catch (error) {
            throw new DatabaseError('data base error')
        }
    }
    
}