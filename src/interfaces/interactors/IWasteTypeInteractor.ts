import { IWasteTypeDocument } from "../documents/IWasteTypeDocument";

export interface IWasteTypeInteractor {
    getAllWasteTypes(page: number, limit: number, search: string): Promise<{wasteTypes: IWasteTypeDocument [], total: number}> 
    addWasteType(data: Partial<IWasteTypeDocument>): Promise<IWasteTypeDocument>
    editWasteType(id: string, data: Partial<IWasteTypeDocument>): Promise<IWasteTypeDocument>
    deleteWasteType(id: string): Promise<void>
}