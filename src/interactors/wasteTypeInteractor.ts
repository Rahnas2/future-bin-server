import { inject, injectable } from "inversify";
import { IWasteTypeDocument } from "../interfaces/documents/IWasteTypeDocument";
import { IWasteTypeInteractor } from "../interfaces/interactors/IWasteTypeInteractor";
import { INTERFACE_TYPE } from "../utils/appConst";
import { IWasteTypeRepository } from "../interfaces/repositories/IWasteTypeRepository";
import { conflictError, InvalidCredentialsError } from "../domain/errors";

@injectable()
export class wasteTypeInteractor implements IWasteTypeInteractor {
    constructor(@inject(INTERFACE_TYPE.wasteTypeRepository) private wasteTypeRepository: IWasteTypeRepository) {}

    async getAllWasteTypes(page: number, limit: number): Promise<{wasteTypes: IWasteTypeDocument [], total: number}> {
        const wasteTypes =  await this.wasteTypeRepository.findAll(page, limit)
        const total = await this.wasteTypeRepository.totalDocumentCount()
        return {wasteTypes, total}
    }

    async addWasteType(data: Partial<IWasteTypeDocument>): Promise<IWasteTypeDocument> {

        const waste = await this.wasteTypeRepository.findWasteTypeByName(data.name as string)

        if(waste) throw new conflictError('already exist')


        return await this.wasteTypeRepository.create(data)
    }

    async editWasteType(id: string, data: Partial<IWasteTypeDocument> ): Promise<IWasteTypeDocument> {

        if(data.name){
            const waste = await this.wasteTypeRepository.findWasteTypeByName(data.name)

            if(waste && waste._id.toString() !== id) throw new conflictError('already exist')
        }
        return await this.wasteTypeRepository.findByIdAndUpdate(id, data)
    }

    async deleteWasteType(id: string): Promise<void> {
        await this.wasteTypeRepository.deleteById(id)
    }
}