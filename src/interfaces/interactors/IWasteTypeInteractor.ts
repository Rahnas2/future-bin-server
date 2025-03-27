import { IWasteTypeDocument } from "../documents/IWasteTypeDocument";

export interface IWasteTypeInteractor {
    getAllWasteTypes(): Promise<IWasteTypeDocument []> 
    addWasteType(data: Partial<IWasteTypeDocument>): Promise<IWasteTypeDocument>
    editWasteType(id: string, data: Partial<IWasteTypeDocument>): Promise<IWasteTypeDocument>
    deleteWasteType(id: string): Promise<void>
}